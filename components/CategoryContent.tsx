"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { ProductModal } from "./ProductModal";
import { formatPriceDisplay } from "@/lib/installment";
import type { Product, InstallmentSettings } from "@/lib/sanity/types";

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
            const display = formatPriceDisplay(p);
            return (
              <div key={p._id} className="card" onClick={() => setSelected(p)}>
                <div className="card-media">
                  {imgUrl && (
                    <Image src={imgUrl} alt={p.title} fill sizes="200px" className="light-img" loading={i === 0 ? "eager" : "lazy"} />
                  )}
                </div>
                <div className="card-body">
                  <div className="card-name">{p.title}</div>
                  <div className="card-price">{display.primary}</div>
                  {display.secondary && <div className="card-installment">{display.secondary}</div>}
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
