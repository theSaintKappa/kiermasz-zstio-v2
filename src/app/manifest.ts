import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: SITE_NAME,
        short_name: "Kiermasz",
        description: SITE_DESCRIPTION,
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0a0a0a",
        lang: "pl",
        scope: "/",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
            {
                src: "/school_emblem_small.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}
