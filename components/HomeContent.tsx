"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { ProductModal } from "./ProductModal";
import { BannerCarousel } from "./BannerCarousel";
import { CONTACT, zaloUrl } from "@/lib/contact";
import type { Banner, Product, StoreEvent, InstallmentModel, InstallmentSettings } from "@/lib/sanity/types";
import { filterByCategory } from "@/lib/sanity/fetcher";
import { InstallmentCalculator } from "./InstallmentCalculator";

function fmtVND(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

function extractSeries(title: string): string {
  return title.match(/iPhone (\d+)/)?.[1] ?? "Other";
}

function shortName(title: string): string {
  return title.replace(/^iPhone\s+/, "").replace(/\s+/g, "");
}

const TABS = [
  { id: "iphone", label: "iPhone" },
  { id: "macbook", label: "MacBook" },
  { id: "ipad", label: "iPad" },
];

interface Props {
  banners: Banner[];
  products: Product[];
  event: StoreEvent | null;
  installmentModels: InstallmentModel[];
  installmentSettings: InstallmentSettings | null;
}

const PAGE_TABS = [
  { id: "products", label: "Sản phẩm" },
  { id: "installment", label: "Trả góp" },
];

export function HomeContent({ banners, products, event, installmentModels, installmentSettings }: Props) {
  const [pageTab, setPageTab] = useState("products");
  const [activeTab, setActiveTab] = useState("iphone");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = filterByCategory(products, activeTab);
  const eventImgUrl = event?.image ? urlFor(event.image).width(800).height(800).fit("crop").url() : null;

  const seriesGroups = activeTab === "iphone"
    ? Object.entries(
        filtered.reduce((acc, p) => {
          const s = extractSeries(p.title);
          (acc[s] ??= []).push(p);
          return acc;
        }, {} as Record<string, Product[]>)
      ).sort(([a], [b]) => Number(b) - Number(a))
    : [];

  return (
    <>
      <BannerCarousel banners={banners} fallbackZalo={CONTACT.zalo} />

      <div className="page-tabs">
        {PAGE_TABS.map((t) => (
          <button key={t.id} className={`page-tab${pageTab === t.id ? " on" : ""}`} onClick={() => setPageTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {pageTab === "products" && (
        <>
          <div className="tabs-container">
            <div className="tabs">
              {TABS.map((tab) => (
                <button key={tab.id} className={`tab${activeTab === tab.id ? " on" : ""}`} onClick={() => setActiveTab(tab.id)}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "iphone" ? (
            <div className="series-list">
              {seriesGroups.map(([series, models]) => (
                <div key={series} className="series-row">
                  <div className="series-label">{series}</div>
                  <div className="series-cards">
                    {models.map((p) => {
                      const imgUrl = p.image
                        ? urlFor(p.image).width(200).height(200).fit("crop").url()
                        : null;
                      return (
                        <div key={p._id} className="sc" onClick={() => setSelected(p)}>
                          <div className="sc-img">
                            {imgUrl && (
                              <Image src={imgUrl} alt={p.title} fill sizes="44px" className="light-img" />
                            )}
                          </div>
                          <div className="sc-body">
                            <div className="sc-name">{shortName(p.title)}</div>
                            <div className="sc-pay">Trả trước</div>
                            <div className="sc-amount">
                              {p.minPayment != null
                                ? `${p.minPayment.toLocaleString("vi-VN")}k`
                                : fmtVND(p.price)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="panel on">
              <div className="grid">
                {filtered.map((p, i) => {
                  const imgUrl = p.image
                    ? urlFor(p.image).width(400).height(400).fit("crop").url()
                    : null;
                  return (
                    <div key={p._id} className="card" onClick={() => setSelected(p)}>
                      <div className="card-media">
                        {imgUrl && (
                          <Image src={imgUrl} alt={p.title} fill sizes="200px" className="light-img" loading={i === 0 ? "eager" : "lazy"} />
                        )}
                      </div>
                      <div className="card-body">
                        <div className="card-name">{p.title}</div>
                        <div className="card-price">
                          {p.minPayment != null
                            ? `Trả trước: ${p.minPayment.toLocaleString("vi-VN")}k`
                            : fmtVND(p.price)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {event && (
            <>
              <div className="sec-hd">
                <div className="sec-h">Promotions</div>
                <div className="sec-title">Limited Offers</div>
              </div>
              <div className="event-block" onClick={() => window.open(event.url || zaloUrl(CONTACT.zalo), "_blank")}>
                {eventImgUrl && <Image src={eventImgUrl} alt={event.title ?? "Event"} fill sizes="430px" style={{ objectFit: "cover" }} />}
                <div className="event-gradient" />
                <div className="event-content">
                  <div className="event-tag">Hot Event</div>
                  {event.title && <div className="event-h">{event.title}</div>}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {pageTab === "installment" && (
        <InstallmentCalculator models={installmentModels} settings={installmentSettings} />
      )}

      <ProductModal product={selected} onClose={() => setSelected(null)} installmentSettings={installmentSettings} />
    </>
  );
}
