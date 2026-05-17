import { client } from "./client";
import type { Banner, Product, StoreEvent, InstallmentModel, InstallmentSettings } from "./types";

const PRODUCT_FIELDS = `_id, title, priority, slug, image, detail, price, "tag": tag[]->{_id, name, slug}, "minPayment": installmentModel->minPayment`;
const revalidate = { next: { revalidate: 60 } };

export async function getBanners(): Promise<Banner[]> {
  return client.fetch(
    `*[_type == "banner" && isActive == true]{_id, title, image, url, isActive}`,
    {},
    revalidate
  );
}

export async function getProducts(): Promise<Product[]> {
  return client.fetch(
    `*[_type == "sanPham"] | order(priority desc){${PRODUCT_FIELDS}}`,
    {},
    revalidate
  );
}

export async function getLatestEvent(): Promise<StoreEvent | null> {
  const result = await client.fetch(
    `*[_type == "event" && isActive == true] | order(_createdAt desc)[0]{_id, title, image, url, isActive}`,
    {},
    revalidate
  );
  return result ?? null;
}

export async function getInstallmentModels(): Promise<InstallmentModel[]> {
  return client.fetch(
    `*[_type == "installmentModel"] | order(series desc, sortOrder asc){_id, name, series, minPayment, sortOrder}`,
    {},
    revalidate
  );
}

export async function getInstallmentSettings(): Promise<InstallmentSettings | null> {
  const result = await client.fetch(
    `*[_type == "installmentSettings"][0]{_id, rates}`,
    {},
    revalidate
  );
  return result ?? null;
}

export function filterByCategory(products: Product[], category: string): Product[] {
  const keyword = category.toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(keyword) ||
      p.tag?.some(
        (t) =>
          t.name?.toLowerCase().includes(keyword) ||
          t.slug?.current?.toLowerCase().includes(keyword)
      )
  );
}
