/**
 * Seed installment models and settings into Sanity.
 *
 * Usage:
 *   SANITY_TOKEN=<your-write-token> node scripts/seed-installment.mjs
 *
 * Get a write token at: https://www.sanity.io/manage/project/sxnhv6cd/api
 * → Tokens → Add API token → choose "Editor" or "Deploy Studio"
 */

import { createClient } from "@sanity/client";

const token = process.env.SANITY_TOKEN;
if (!token) {
  console.error("❌  SANITY_TOKEN env var required.");
  console.error("    SANITY_TOKEN=<token> node scripts/seed-installment.mjs");
  process.exit(1);
}

const client = createClient({
  projectId: "sxnhv6cd",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// ── iPhone models ────────────────────────────────────────────
// minPayment in thousands VND (e.g. 16000 = 16,000k = 16 triệu)
const MODELS = [
  // series 17
  { series: "17", name: "17 Pro Max", minPayment: 16000, sortOrder: 1 },
  { series: "17", name: "17 Pro",     minPayment: 15000, sortOrder: 2 },
  { series: "17", name: "17 Air",     minPayment: 12000, sortOrder: 3 },
  { series: "17", name: "17",         minPayment: 10000, sortOrder: 4 },
  // series 16
  { series: "16", name: "16 Pro Max", minPayment: 12000, sortOrder: 1 },
  { series: "16", name: "16 Pro",     minPayment: 11000, sortOrder: 2 },
  { series: "16", name: "16 Plus",    minPayment:  7000, sortOrder: 3 },
  { series: "16", name: "16",         minPayment:  6000, sortOrder: 4 },
  // series 15
  { series: "15", name: "15 Pro Max", minPayment:  8000, sortOrder: 1 },
  { series: "15", name: "15 Pro",     minPayment:  7000, sortOrder: 2 },
  { series: "15", name: "15 Plus",    minPayment:  6000, sortOrder: 3 },
  { series: "15", name: "15",         minPayment:  5000, sortOrder: 4 },
  // series 14
  { series: "14", name: "14 Pro Max", minPayment:  7000, sortOrder: 1 },
  { series: "14", name: "14 Pro",     minPayment:  6000, sortOrder: 2 },
  { series: "14", name: "14 Plus",    minPayment:  5000, sortOrder: 3 },
  { series: "14", name: "14",         minPayment:  4000, sortOrder: 4 },
  // series 13
  { series: "13", name: "13 Pro Max", minPayment:  5000, sortOrder: 1 },
  { series: "13", name: "13 Pro",     minPayment:  4500, sortOrder: 2 },
  { series: "13", name: "13",         minPayment:  4000, sortOrder: 3 },
  { series: "13", name: "13 Mini",    minPayment:  3000, sortOrder: 4 },
  // series 12
  { series: "12", name: "12 Pro Max", minPayment:  5000, sortOrder: 1 },
  { series: "12", name: "12 Pro",     minPayment:  4000, sortOrder: 2 },
  { series: "12", name: "12",         minPayment:  3000, sortOrder: 3 },
  { series: "12", name: "12 Mini",    minPayment:  2500, sortOrder: 4 },
  // series 11
  { series: "11", name: "11 Pro Max", minPayment:  3000, sortOrder: 1 },
  { series: "11", name: "11 Pro",     minPayment:  2500, sortOrder: 2 },
  { series: "11", name: "11",         minPayment:  2000, sortOrder: 3 },
];

// ── Installment rates ────────────────────────────────────────
const RATES = [
  { period: 5,  feeRatePercent: 9  },
  { period: 10, feeRatePercent: 18 },
  { period: 15, feeRatePercent: 27 },
  { period: 20, feeRatePercent: 36 },
];

async function seed() {
  console.log("🌱  Seeding installment models…");

  // Check for existing models to avoid duplicates
  const existing = await client.fetch(
    `*[_type == "installmentModel"]{name, series}`
  );
  const existingKeys = new Set(existing.map((m) => `${m.series}-${m.name}`));

  const toCreate = MODELS.filter(
    (m) => !existingKeys.has(`${m.series}-${m.name}`)
  );

  if (toCreate.length === 0) {
    console.log("   All models already exist, skipping.");
  } else {
    const tx = client.transaction();
    for (const m of toCreate) {
      tx.create({
        _type: "installmentModel",
        name: m.name,
        series: m.series,
        minPayment: m.minPayment,
        sortOrder: m.sortOrder,
      });
    }
    await tx.commit();
    console.log(`   ✓ Created ${toCreate.length} models.`);
  }

  // Upsert installment settings singleton
  console.log("🌱  Seeding installment settings…");
  const settingsId = "installment-settings-singleton";
  await client.createOrReplace({
    _id: settingsId,
    _type: "installmentSettings",
    rates: RATES.map((r) => ({
      _key: `period-${r.period}`,
      period: r.period,
      feeRatePercent: r.feeRatePercent,
    })),
  });
  console.log("   ✓ Settings saved.");

  console.log("✅  Done!");
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
