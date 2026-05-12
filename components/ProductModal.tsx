"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { CONTACT, zaloUrl, telUrl } from "@/lib/contact";
import type { Product } from "@/lib/sanity/types";

function fmtVND(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

interface Props {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: Props) {
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  const category = product?.tag?.[0]?.name ?? "Sản phẩm";
  const imgUrl = product ? urlFor(product.image).width(600).height(450).fit("max").url() : "";

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="modal"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-handle" />
            <div className="modal-img">
              <Image src={imgUrl} alt={product.title} fill sizes="400px" className="light-img" />
            </div>
            <div className="modal-cat">{category}</div>
            <div className="modal-title">{product.title}</div>
            <div className="modal-price">{fmtVND(product.price)}</div>
            <div className="modal-desc">
              {product.detail ?? "Vui lòng liên hệ để nhận ưu đãi!!"}
            </div>
            <div className="cta-row">
              <button className="btn btn-p" onClick={() => window.open(zaloUrl(CONTACT.zalo), "_blank")}>
                Liên hệ Zalo
              </button>
              <button className="btn btn-s" onClick={onClose}>
                Đóng
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
