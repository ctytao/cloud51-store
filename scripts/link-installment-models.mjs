/**
 * Auto-link products to installment models in Sanity.
 *
 * Usage:
 *   SANITY_TOKEN=<your-write-token> node scripts/link-installment-models.mjs
 *
 * Dry run (no writes):
 *   DRY_RUN=1 SANITY_TOKEN=<token> node scripts/link-installment-models.mjs
 */

import { createClient } from "@sanity/client";

const token = process.env.SANITY_TOKEN;
if (!token) {
  console.error("❌  SANITY_TOKEN env var required.");
  process.exit(1);
}

const DRY_RUN = process.env.DRY_RUN === "1";

const client = createClient({
  projectId: "sxnhv6cd",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

function norm(s) {
  return s.toLowerCase().replace(/\s+/g, "");
}

function stripStorage(s) {
  return s.replace(/\s*(128|256|512|1|2)\s*(gb|tb)\b/gi, "").trim();
}

function findMatch(productTitle, models) {
  const normTitle = norm(productTitle);
  // Exact normalized match
  const exact = models.find((m) => normTitle.includes(norm(m.name)));
  if (exact) return { model: exact, method: "exact" };
  // Match ignoring storage variant
  const loose = models.find((m) => normTitle.includes(norm(stripStorage(m.name))));
  if (loose) return { model: loose, method: "fuzzy" };
  return null;
}

async function main() {
  console.log(DRY_RUN ? "🔍  DRY RUN — no writes\n" : "🚀  Linking products to installment models\n");

  const [products, models] = await Promise.all([
    client.fetch(`*[_type == "sanPham"]{_id, title, installmentModel}`),
    client.fetch(`*[_type == "installmentModel"]{_id, name, series}`),
  ]);

  console.log(`Found ${products.length} products, ${models.length} installment models\n`);

  const matched = [];
  const unmatched = [];
  const skipped = [];

  for (const product of products) {
    if (product.installmentModel?._ref) {
      skipped.push(product.title);
      continue;
    }
    const result = findMatch(product.title, models);
    if (result) {
      matched.push({ product, model: result.model, method: result.method });
    } else {
      unmatched.push(product.title);
    }
  }

  // Print matches
  console.log("✅  MATCHED:");
  for (const { product, model, method } of matched) {
    console.log(`   [${method}] "${product.title}" → "${model.name}" (${model.series})`);
  }

  console.log("\n⏭️   ALREADY LINKED (skipped):");
  for (const title of skipped) {
    console.log(`   "${title}"`);
  }

  console.log("\n❌  NO MATCH (needs manual linking in Studio):");
  for (const title of unmatched) {
    console.log(`   "${title}"`);
  }

  if (DRY_RUN) {
    console.log(`\nDry run complete. Would patch ${matched.length} products.`);
    return;
  }

  if (matched.length === 0) {
    console.log("\nNothing to patch.");
    return;
  }

  console.log(`\nPatching ${matched.length} products…`);
  const tx = client.transaction();
  for (const { product, model } of matched) {
    tx.patch(product._id, {
      set: { installmentModel: { _type: "reference", _ref: model._id } },
    });
  }
  await tx.commit();
  console.log("✅  Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
