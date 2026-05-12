"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { ProductModal } from "./ProductModal";
import type { Product } from "@/lib/sanity/types";

function fmtVND(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

interface Props {
  products: Product[];
  label: string;
  sublabel: string;
}

export function CategoryContent({ products, label, sublabel }: Props) {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <div className="cat-header fade-in">
        <div className="sec-h">{label}</div>
        <div className="sec-title">{sublabel}</div>
      </div>

      <div className="cat-grid">
        <div className="grid">
          {products.map((p) => {
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

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
