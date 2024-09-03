import { v1 } from "@google-cloud/firestore";
import { initializeApp } from "firebase-admin/app";
import { Timestamp, getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { createTransport } from "nodemailer";

const region = "europe-central2";
const timeZone = "Europe/Warsaw";

initializeApp();
const db = getFirestore();

const client = new v1.FirestoreAdminClient();

exports.sendEmail = onCall({ region }, async (request) => {
    if (!request.auth) throw new HttpsError("failed-precondition", "The function must be called while authenticated.");
    if (!request.data.to || !request.data.subject || !request.data.html) throw new HttpsError("invalid-argument", "Missing required parameters.");

    const transporter = createTransport({ host: process.env.SMTP_HOST, port: 465, secure: true, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } });

    const { to, subject, html } = request.data;
    await transporter.sendMail({ from: '"Kiermasz ZSTiO 📚" <kiermasz@mechaniktg.pl>', to, subject, html });
});

exports.cancelReservation = onDocumentUpdated({ document: "sellers/{sellerId}/textbooks/{textbookId}", region }, async (event) => {
    const before = <TextbookDocument>event.data?.before.data();
    const after = <TextbookDocument>event.data?.after.data();

    if (before.reservation.status && !after.reservation.status) return event.data?.after.ref.set({ reservation: { holder: null, expiry: null } }, { merge: true });

    return null;
});

exports.updateSoldAt = onDocumentUpdated({ document: "sellers/{sellerId}/textbooks/{textbookId}", region }, async (event) => {
    const before = <TextbookDocument>event.data?.before.data();
    const after = <TextbookDocument>event.data?.after.data();

    if (before.sold && !after.sold) return event.data?.after.ref.set({ soldAt: null }, { merge: true });

    if (!before.sold && after.sold && !after.soldAt) return event.data?.after.ref.set({ soldAt: Timestamp.now(), reservation: { status: false } }, { merge: true });

    return null;
});

exports.reservationCleanup = onSchedule({ schedule: "0 0 * * *", timeZone, region }, async () => {
    const snapshot = await db.collectionGroup("textbooks").where("reservation.expiry", "<=", Timestamp.now()).get();

    for (const doc of snapshot.docs) {
        await doc.ref.set({ reservation: { status: false } }, { merge: true });
        logger.log(`Reservation for ${(<TextbookDocument>doc.data()).reservation.holder} has been cancelled.`);
    }
});

// At minute 0 past every hour from 8 through 16 and 0 on every day-of-week from Monday through Friday.
exports.scheduleBackup = onSchedule({ schedule: "0 8-16,0 * * 1-5", timeZone, region }, async () => {
    await db.collection("backups").add({ createdAt: Timestamp.now(), status: "pending", type: "scheduled" });
});

exports.performBackup = onDocumentCreated({ document: "backups/{backupId}", region }, async (event) => {
    const document = <Backup>event.data?.data();
    if (!document.createdAt) event.data?.ref.set({ createdAt: Timestamp.now() }, { merge: true });
    if (document.status !== "pending") await event.data?.ref.set({ status: "pending" }, { merge: true });

    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const name = client.databasePath(projectId ?? "", "(default)");
    const outputUriPrefix = `${process.env.BUCKET_NAME}/${Timestamp.now().toDate().toISOString()}`;

    try {
        const responses = await client.exportDocuments({ name, outputUriPrefix, collectionIds: ["sellers", "textbooks"] });
        event.data?.ref.set({ status: "complete" }, { merge: true });
        logger.info("Export operation triggered: ", responses[0]?.name);
    } catch (err) {
        event.data?.ref.set({ status: "failed" }, { merge: true });
        logger.error("Export operation failed: ", err);
    }
});
