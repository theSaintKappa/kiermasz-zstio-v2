import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-config";

export const alt = `${SITE_NAME} — ${SITE_DESCRIPTION}`;
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

function getSchoolEmblemDataUri(): string {
    const emblemPath = path.join(process.cwd(), "public", "school_emblem_small.png");
    const emblemBuffer = fs.readFileSync(emblemPath);
    return `data:image/png;base64,${emblemBuffer.toString("base64")}`;
}

export default async function OpenGraphImage(): Promise<ImageResponse> {
    const emblemSrc = getSchoolEmblemDataUri();

    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "80px",
                background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
                color: "#f8fafc",
                fontFamily: "sans-serif",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                {/* biome-ignore lint/performance/noImgElement: <img> is required inside ImageResponse JSX */}
                <img src={emblemSrc} width={120} height={120} alt="Logo szkoły" style={{ borderRadius: "16px" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ fontSize: "64px", fontWeight: 700 }}>{SITE_NAME}</div>
                    <div style={{ fontSize: "28px", color: "#94a3b8" }}>{SITE_DESCRIPTION}</div>
                </div>
            </div>

            <div
                style={{
                    marginTop: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid rgba(148,163,184,0.2)",
                    paddingTop: "24px",
                    color: "#94a3b8",
                    fontSize: "24px",
                }}
            >
                <span>Sprzedawaj i kupuj podręczniki szkolne znacznie taniej.</span>
                <span style={{ color: "#38bdf8", fontWeight: 600 }}>{SITE_URL.replace("https://", "")}</span>
            </div>
        </div>,
        {
            width: size.width,
            height: size.height,
        },
    );
}
