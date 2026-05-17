/**
 * Seed sanPham (products) into Sanity — FULL CLEAN SLATE.
 *
 * ⚠️  Deletes ALL existing sanPham documents, then recreates them.
 *
 * Usage:
 *   SANITY_TOKEN=<write-token> node scripts/seed-sanpham.mjs
 *
 * Get token: https://www.sanity.io/manage/project/sxnhv6cd/api
 * → API → Tokens → Add API token → Editor
 *
 * After running: update price for each product in Sanity Studio.
 * Then optionally run: node scripts/link-installment-models.mjs (already done inline)
 */

import { createClient } from "@sanity/client";
import https from "https";

const token = process.env.SANITY_TOKEN;
if (!token) {
  console.error("❌  SANITY_TOKEN env var required.");
  console.error("    SANITY_TOKEN=<token> node scripts/seed-sanpham.mjs");
  process.exit(1);
}

const client = createClient({
  projectId: "sxnhv6cd",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// modelName must match exactly what's in seed-installment.mjs / Sanity installmentModel.name
const PRODUCTS = [
  // ── iPhone 17 ──────────────────────────────────────────────────────
  { name: "iPhone 17 Pro Max", slug: "iphone-17-pro-max", priority: 170, series: "17", modelName: "17 Pro Max" },
  { name: "iPhone 17 Pro",     slug: "iphone-17-pro",     priority: 169, series: "17", modelName: "17 Pro"     },
  { name: "iPhone 17 Air",     slug: "iphone-17-air",     priority: 168, series: "17", modelName: "17 Air"     },
  { name: "iPhone 17",         slug: "iphone-17",         priority: 167, series: "17", modelName: "17"         },
  // ── iPhone 16 ──────────────────────────────────────────────────────
  { name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", priority: 160, series: "16", modelName: "16 Pro Max" },
  { name: "iPhone 16 Pro",     slug: "iphone-16-pro",     priority: 159, series: "16", modelName: "16 Pro"     },
  { name: "iPhone 16 Plus",    slug: "iphone-16-plus",    priority: 158, series: "16", modelName: "16 Plus"    },
  { name: "iPhone 16",         slug: "iphone-16",         priority: 157, series: "16", modelName: "16"         },
  // ── iPhone 15 ──────────────────────────────────────────────────────
  { name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", priority: 150, series: "15", modelName: "15 Pro Max" },
  { name: "iPhone 15 Pro",     slug: "iphone-15-pro",     priority: 149, series: "15", modelName: "15 Pro"     },
  { name: "iPhone 15 Plus",    slug: "iphone-15-plus",    priority: 148, series: "15", modelName: "15 Plus"    },
  { name: "iPhone 15",         slug: "iphone-15",         priority: 147, series: "15", modelName: "15"         },
  // ── iPhone 14 ──────────────────────────────────────────────────────
  { name: "iPhone 14 Pro Max", slug: "iphone-14-pro-max", priority: 140, series: "14", modelName: "14 Pro Max" },
  { name: "iPhone 14 Pro",     slug: "iphone-14-pro",     priority: 139, series: "14", modelName: "14 Pro"     },
  { name: "iPhone 14 Plus",    slug: "iphone-14-plus",    priority: 138, series: "14", modelName: "14 Plus"    },
  { name: "iPhone 14",         slug: "iphone-14",         priority: 137, series: "14", modelName: "14"         },
  // ── iPhone 13 ──────────────────────────────────────────────────────
  { name: "iPhone 13 Pro Max", slug: "iphone-13-pro-max", priority: 130, series: "13", modelName: "13 Pro Max" },
  { name: "iPhone 13 Pro",     slug: "iphone-13-pro",     priority: 129, series: "13", modelName: "13 Pro"     },
  { name: "iPhone 13",         slug: "iphone-13",         priority: 128, series: "13", modelName: "13"         },
  { name: "iPhone 13 Mini",    slug: "iphone-13-mini",    priority: 127, series: "13", modelName: "13 Mini"    },
  // ── iPhone 12 ──────────────────────────────────────────────────────
  { name: "iPhone 12 Pro Max", slug: "iphone-12-pro-max", priority: 120, series: "12", modelName: "12 Pro Max" },
  { name: "iPhone 12 Pro",     slug: "iphone-12-pro",     priority: 119, series: "12", modelName: "12 Pro"     },
  { name: "iPhone 12",         slug: "iphone-12",         priority: 118, series: "12", modelName: "12"         },
  { name: "iPhone 12 Mini",    slug: "iphone-12-mini",    priority: 117, series: "12", modelName: "12 Mini"    },
  // ── iPhone 11 ──────────────────────────────────────────────────────
  { name: "iPhone 11 Pro Max", slug: "iphone-11-pro-max", priority: 110, series: "11", modelName: "11 Pro Max" },
  { name: "iPhone 11 Pro",     slug: "iphone-11-pro",     priority: 109, series: "11", modelName: "11 Pro"     },
  { name: "iPhone 11",         slug: "iphone-11",         priority: 108, series: "11", modelName: "11"         },
];

// Official Apple Newsroom press images — verified working URLs.
// Pro/Max variants share a newsroom page with their base model (same image).
// iPhone 13 Pro/Mini share the 13 image (Apple removed the Pro newsroom article).
// iPhone 12 series use the 12 Pro image. iPhone 11 Pro series use the 11 image.
const IMAGE_URLS = {
  // ── iPhone 17 ── (Sep 2025)
  "iphone-17-pro-max": "https://www.apple.com/newsroom/images/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/article/Apple-iPhone-17-Pro-cosmic-orange-250909_inline.jpg.large.jpg",
  "iphone-17-pro":     "https://www.apple.com/newsroom/images/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/article/Apple-iPhone-17-Pro-cosmic-orange-250909_inline.jpg.large.jpg",
  "iphone-17-air":     "https://www.apple.com/newsroom/images/2025/09/introducing-iphone-air-a-powerful-new-iphone-with-a-breakthrough-design/article/Apple-iPhone-Air-hero-250909_big.jpg.large.jpg",
  "iphone-17":         "https://www.apple.com/newsroom/images/2025/09/apple-debuts-iphone-17/article/Apple-iPhone-17-hero-250909_inline.jpg.large.jpg",
  // ── iPhone 16 ── (Sep 2024)
  "iphone-16-pro-max": "https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
  "iphone-16-pro":     "https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
  "iphone-16-plus":    "https://www.apple.com/newsroom/images/2024/09/apple-introduces-iphone-16-and-iphone-16-plus/article/Apple-iPhone-16-hero-240909_inline.jpg.large.jpg",
  "iphone-16":         "https://www.apple.com/newsroom/images/2024/09/apple-introduces-iphone-16-and-iphone-16-plus/article/Apple-iPhone-16-hero-240909_inline.jpg.large.jpg",
  // ── iPhone 15 ── (Sep 2023)
  "iphone-15-pro-max": "https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-hero-230912_Full-Bleed-Image.jpg.large.jpg",
  "iphone-15-pro":     "https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-hero-230912_Full-Bleed-Image.jpg.large.jpg",
  "iphone-15-plus":    "https://www.apple.com/newsroom/images/2023/09/apple-debuts-iphone-15-and-iphone-15-plus/article/Apple-iPhone-15-lineup-hero-230912_inline.jpg.large.jpg",
  "iphone-15":         "https://www.apple.com/newsroom/images/2023/09/apple-debuts-iphone-15-and-iphone-15-plus/article/Apple-iPhone-15-lineup-hero-230912_inline.jpg.large.jpg",
  // ── iPhone 14 ── (Sep 2022)
  "iphone-14-pro-max": "https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-hero-220907_Full-Bleed-Image.jpg.large.jpg",
  "iphone-14-pro":     "https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-hero-220907_Full-Bleed-Image.jpg.large.jpg",
  "iphone-14-plus":    "https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-iPhone-14-Plus-hero-220907_Full-Bleed-Image.jpg.large.jpg",
  "iphone-14":         "https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-iPhone-14-Plus-hero-220907_Full-Bleed-Image.jpg.large.jpg",
  // ── iPhone 13 ── (Sep 2021)
  "iphone-13-pro-max": "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone13_hero_09142021_inline.jpg.large.jpg",
  "iphone-13-pro":     "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone13_hero_09142021_inline.jpg.large.jpg",
  "iphone-13":         "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone13_hero_09142021_inline.jpg.large.jpg",
  "iphone-13-mini":    "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone13_hero_09142021_inline.jpg.large.jpg",
  // ── iPhone 12 ── (Oct 2020)
  "iphone-12-pro-max": "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_announce-iphone12pro_10132020_big.jpg.large.jpg",
  "iphone-12-pro":     "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_announce-iphone12pro_10132020_big.jpg.large.jpg",
  "iphone-12":         "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_announce-iphone12pro_10132020_big.jpg.large.jpg",
  "iphone-12-mini":    "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_announce-iphone12pro_10132020_big.jpg.large.jpg",
  // ── iPhone 11 ── (Sep 2019)
  "iphone-11-pro-max": "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone_11-rosette-family-lineup-091019_big.jpg.large.jpg",
  "iphone-11-pro":     "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone_11-rosette-family-lineup-091019_big.jpg.large.jpg",
  "iphone-11":         "https://www.apple.com/newsroom/images/product/iphone/standard/Apple_iphone_11-rosette-family-lineup-091019_big.jpg.large.jpg",
};

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const get = (u) =>
      https
        .get(u, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
          if (res.statusCode === 301 || res.statusCode === 302) {
            return get(res.headers.location);
          }
          if (res.statusCode !== 200) {
            return reject(new Error(`HTTP ${res.statusCode} for ${u}`));
          }
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => resolve(Buffer.concat(chunks)));
          res.on("error", reject);
        })
        .on("error", reject);
    get(url);
  });
}

async function uploadImage(slug) {
  const url = IMAGE_URLS[slug];
  if (!url) return null;
  try {
    const buf = await fetchBuffer(url);
    const asset = await client.assets.upload("image", buf, {
      filename: `${slug}.jpg`,
      contentType: "image/jpeg",
    });
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  } catch (err) {
    console.warn(`\n   ⚠️  Image failed [${slug}]: ${err.message}`);
    return null;
  }
}

async function seed() {
  // ── Step 1: Delete all existing sanPham ─────────────────────────────
  console.log("🗑️   Deleting all existing sanPham...");
  const existingIds = await client.fetch(`*[_type == "sanPham"]._id`);
  if (existingIds.length > 0) {
    const tx = client.transaction();
    for (const id of existingIds) tx.delete(id);
    await tx.commit();
    console.log(`   ✓ Deleted ${existingIds.length} products.`);
  } else {
    console.log("   No existing products found.");
  }

  // ── Step 2: Fetch installment models for linking ─────────────────────
  console.log("\n🔗  Fetching installment models...");
  const installmentModels = await client.fetch(
    `*[_type == "installmentModel"]{_id, name, series}`
  );
  if (installmentModels.length === 0) {
    console.warn("   ⚠️  No installment models found.");
    console.warn("      Run: SANITY_TOKEN=<token> node scripts/seed-installment.mjs first.");
  } else {
    console.log(`   Found ${installmentModels.length} models.`);
  }

  // Map "series-modelName" → Sanity _id
  const modelMap = new Map(
    installmentModels.map((m) => [`${m.series}-${m.name}`, m._id])
  );

  // ── Step 3: Create products ──────────────────────────────────────────
  console.log(`\n🌱  Seeding ${PRODUCTS.length} products...`);
  let noImage = 0;
  let noModel = 0;

  for (const p of PRODUCTS) {
    process.stdout.write(`   ${p.name}... `);

    const imageRef = await uploadImage(p.slug);
    if (!imageRef) noImage++;

    const installmentModelId = modelMap.get(`${p.series}-${p.modelName}`);
    if (!installmentModelId) noModel++;

    await client.create({
      _type: "sanPham",
      title: p.name,
      slug: { _type: "slug", current: p.slug },
      price: 0, // ← TODO: set actual sale price in Sanity Studio
      priority: p.priority,
      ...(imageRef ? { image: imageRef } : {}),
      ...(installmentModelId
        ? { installmentModel: { _type: "reference", _ref: installmentModelId } }
        : {}),
    });

    const flags = [
      imageRef ? null : "no image",
      installmentModelId ? null : "no installment link",
    ]
      .filter(Boolean)
      .join(", ");

    console.log(flags ? `✓ (${flags})` : "✓");
  }

  // ── Summary ──────────────────────────────────────────────────────────
  console.log(`\n✅  Created ${PRODUCTS.length} products.`);
  if (noImage > 0) {
    console.log(`⚠️  ${noImage} products missing image — update in Sanity Studio.`);
    console.log("   Apple may have changed their image URLs. Check and update IMAGE_URLS in this script.");
  }
  if (noModel > 0) {
    console.log(`⚠️  ${noModel} products not linked to installment model.`);
    console.log("   Run seed-installment.mjs first, then re-run this script.");
  }
  console.log("\n📝  Next: update price for each product in Sanity Studio.");
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
