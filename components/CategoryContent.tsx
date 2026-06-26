"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { ProductModal } from "./ProductModal";
import type { Product, InstallmentSettings } from "@/lib/sanity/types";

function fmtVND(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

interface Props {
  products: Product[];
  label: string;
  sublabel: string;
  installmentSettings?: InstallmentSettings | null;
}

export function CategoryContent({ products, label, sublabel, installmentSettings = null }: Props) {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <div className="cat-header fade-in">
        <div className="sec-h">{label}</div>
        <div className="sec-title">{sublabel}</div>
      </div>

      <div className="cat-grid">
        <div className="grid">
          {products.map((p, i) => {
            const imgUrl = p.image
              ? urlFor(p.image).width(400).height(400).fit("crop").url()
              : null;
            const isNewest = /iPhone 17\b/i.test(p.title);
            return (
              <div key={p._id} className={`card ${isNewest ? "card-newest" : ""}`} onClick={() => setSelected(p)}>
                {isNewest && (
                  <svg className="hot-flame-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 23c-4.97 0-9-4.03-9-9 0-3.32 1.8-6.22 4.5-7.8l.5-.3.2.5c.9 2.1 2 3 3.3 3.7C12.3 8.3 13 6.2 13 4v-2l1.2 1.6C17.5 7.6 19 11 19 14c0 4.97-4.03 9-9 9z" />
                  </svg>
                )}
                <div className="card-media">
                  {imgUrl && (
                    <Image src={imgUrl} alt={p.title} fill sizes="200px" className="light-img" loading={i === 0 ? "eager" : "lazy"} />
                  )}
                </div>
                <div className="card-body">
                  <div className="card-name">{p.title}</div>
                  <div className="card-price">
                    {p.minPayment != null
                      ? `Hỗ trợ: ${p.minPayment.toLocaleString("vi-VN")}k`
                      : fmtVND(p.price)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} installmentSettings={installmentSettings} />
    </>
  );
}
