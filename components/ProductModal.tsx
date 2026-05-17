"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { CONTACT, zaloUrl } from "@/lib/contact";
import type { Product } from "@/lib/sanity/types";

function fmtVND(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

interface Props {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: Props) {
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  const category = product?.tag?.[0]?.name ?? "Sản phẩm";
  const imgUrl = product?.image ? urlFor(product.image).width(600).height(450).fit("max").url() : "";

  const slideVariants = {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
  };
  const scaleVariants = {
    initial: { scale: 0.96, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.96, opacity: 0 },
  };
  const modalVariants = isDesktop ? scaleVariants : slideVariants;
  const modalTransition = isDesktop
    ? { duration: 0.2 }
    : { type: "spring" as const, damping: 30, stiffness: 300 };

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
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={modalTransition}
            onClick={(e) => e.stopPropagation()}
          >
            {!isDesktop && <div className="modal-handle" />}
            <div className="modal-img">
              <Image src={imgUrl} alt={product.title} fill sizes="(min-width: 640px) 560px, 430px" className="light-img" />
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
