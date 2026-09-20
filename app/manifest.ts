import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dorori — 나를 키우는 작은 습관",
    short_name: "Dorori",
    description: "나만의 캐릭터와 함께 작은 습관을 키우는 성장 앱",
    start_url: "/",
    display: "standalone",
    background_color: "#fffefa",
    theme_color: "#d7f9f0",
    orientation: "portrait",
    lang: "ko",
    icons: [
      { src: "/characters/pingo.png", sizes: "1254x1254", type: "image/png", purpose: "any" },
      { src: "/characters/pingo.png", sizes: "1254x1254", type: "image/png", purpose: "maskable" },
    ],
  };
}
