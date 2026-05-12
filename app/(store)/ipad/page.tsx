import type { Metadata } from "next";
import { getProducts, filterByCategory } from "@/lib/sanity/fetcher";
import { CategoryContent } from "@/components/CategoryContent";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "iPad — Cloud51 Store",
  description: "Mua iPad Pro, iPad Air mới 100%. Hỗ trợ trả góp, Apple Pencil.",
};

export default async function IPadPage() {
  const all = await getProducts();
  const products = filterByCategory(all, "ipad");
  return <CategoryContent products={products} label="Creative Power" sublabel="iPad Pro & Air" />;
}
