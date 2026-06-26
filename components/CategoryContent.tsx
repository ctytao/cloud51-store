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

      <ProductModal product={selected} onClose={() => setSelected(null)} installmentSettings={installmentSettings} />
    </>
  );
}
