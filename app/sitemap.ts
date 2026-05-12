import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://cloud51.store";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/iphone`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/macbook`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/ipad`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
