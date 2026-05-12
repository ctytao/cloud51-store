import type { Metadata } from "next";
import { getProducts, filterByCategory } from "@/lib/sanity/fetcher";
import { CategoryContent } from "@/components/CategoryContent";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "iPhone — Cloud51 Store",
  description: "Mua iPhone chính hãng, trả góp 0% qua iCloud. iPhone 13, 14, 15 Series.",
};

export default async function IPhonePage() {
  const all = await getProducts();
  const products = filterByCategory(all, "iphone");
  return <CategoryContent products={products} label="Premium Retail" sublabel="iPhone Series" />;
}
