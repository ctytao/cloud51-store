import type { Metadata } from "next";
import { getProducts, filterByCategory } from "@/lib/sanity/fetcher";
import { CategoryContent } from "@/components/CategoryContent";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "MacBook — Cloud51 Store",
  description: "Mua MacBook Pro, MacBook Air mới 100%. Trả góp 0% qua iCloud.",
};

export default async function MacBookPage() {
  const all = await getProducts();
  const products = filterByCategory(all, "macbook");
  return <CategoryContent products={products} label="Performance" sublabel="MacBook Pro & Air" />;
}
