"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { ProductModal } from "./ProductModal";
import { BannerCarousel } from "./BannerCarousel";
import { CONTACT, zaloUrl } from "@/lib/contact";
import type { Banner, Product, StoreEvent } from "@/lib/sanity/types";
import { filterByCategory } from "@/lib/sanity/fetcher";

function fmtVND(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
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
}

export function HomeContent({ banners, products, event }: Props) {
  const [activeTab, setActiveTab] = useState("iphone");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = filterByCategory(products, activeTab);
  const eventImgUrl = event?.image ? urlFor(event.image).width(800).height(800).fit("crop").url() : null;

  return (
    <>
      <BannerCarousel banners={banners} fallbackZalo={CONTACT.zalo} />

      <div className="sec-hd">
        <div className="sec-h">Categories</div>
        <div className="sec-title">Product Catalog</div>
      </div>

      <div className="tabs">
        {TABS.map((tab) => (
          <button key={tab.id} className={`tab${activeTab === tab.id ? " on" : ""}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="panel on">
        <div className="grid">
          {filtered.map((p) => {
            const imgUrl = urlFor(p.image).width(400).height(400).fit("crop").url();
            return (
              <div key={p._id} className="card" onClick={() => setSelected(p)}>
                <div className="card-media">
                  <Image src={imgUrl} alt={p.title} fill sizes="200px" className="light-img" />
                </div>
                <div className="card-body">
                  <div className="card-name">{p.title}</div>
                  <div className="card-price">{fmtVND(p.price)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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

      <a href="/studio" className="studio-link">Admin Studio</a>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
