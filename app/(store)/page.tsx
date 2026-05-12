import { getBanners, getProducts, getLatestEvent } from "@/lib/sanity/fetcher";
import { HomeContent } from "@/components/HomeContent";

export const revalidate = 60;

export default async function HomePage() {
  const [banners, products, event] = await Promise.all([
    getBanners(),
    getProducts(),
    getLatestEvent(),
  ]);

  return <HomeContent banners={banners} products={products} event={event} />;
}
