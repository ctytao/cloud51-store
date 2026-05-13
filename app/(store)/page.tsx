import { getBanners, getProducts, getLatestEvent, getInstallmentModels, getInstallmentSettings } from "@/lib/sanity/fetcher";
import { HomeContent } from "@/components/HomeContent";

export const revalidate = 60;

export default async function HomePage() {
  const [banners, products, event, installmentModels, installmentSettings] = await Promise.all([
    getBanners(),
    getProducts(),
    getLatestEvent(),
    getInstallmentModels(),
    getInstallmentSettings(),
  ]);

  return (
    <HomeContent
      banners={banners}
      products={products}
      event={event}
      installmentModels={installmentModels}
      installmentSettings={installmentSettings}
    />
  );
}
