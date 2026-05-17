"use client";

import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { CONTACT, zaloUrl } from "@/lib/contact";
import type { Product, InstallmentSettings } from "@/lib/sanity/types";

function fmtVND(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

function fmtNum(n: number) {
  return Math.round(n).toLocaleString("vi-VN");
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

const DEFAULT_RATES = [
  { period: 5,  feeRatePercent: 9  },
  { period: 10, feeRatePercent: 18 },
  { period: 15, feeRatePercent: 27 },
  { period: 20, feeRatePercent: 36 },
];

interface Props {
  product: Product | null;
  onClose: () => void;
  installmentSettings: InstallmentSettings | null;
}

export function ProductModal({ product, onClose, installmentSettings }: Props) {
  const isDesktop = useIsDesktop();
  const rates = installmentSettings?.rates?.length ? installmentSettings.rates : DEFAULT_RATES;

  const [phonePrice, setPhonePrice] = useState("");
  const [upfront, setUpfront] = useState("");
  const [period, setPeriod] = useState<number | null>(null);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      const min = (product.minPayment ?? 0) * 1000;
      setUpfront(min > 0 ? String(min) : "");
      setPhonePrice("");
      setPeriod(null);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  const category = product?.tag?.[0]?.name ?? "Sản phẩm";
  const imgUrl = product?.image ? urlFor(product.image).width(600).height(450).fit("max").url() : "";
  const minUpfront = (product?.minPayment ?? 0) * 1000;

  const phonePriceNum = parseFloat(phonePrice) || 0;
  const upfrontNum = parseFloat(upfront) || 0;
  const gop = Math.max(0, phonePriceNum - upfrontNum);
  const upfrontValid = upfrontNum >= minUpfront;
  const phonePriceValid = phonePriceNum === 0 || phonePriceNum >= minUpfront;

  const selectedRate = rates.find((r) => r.period === period) ?? null;
  const result = useMemo(() => {
    if (!selectedRate || gop <= 0) return null;
    const fee = (gop * selectedRate.feeRatePercent) / 100;
    const totalPaid = gop + fee;
    const weekly = Math.ceil(totalPaid / selectedRate.period);
    return { fee, totalPaid, weekly };
  }, [gop, selectedRate]);

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
            <div className="modal-price">
              {product.minPayment != null
                ? `Hỗ trợ: ${product.minPayment.toLocaleString("vi-VN")}k`
                : fmtVND(product.price)}
            </div>
            <div className="modal-desc">
              {product.detail ?? "Vui lòng liên hệ để nhận ưu đãi!!"}
            </div>

            {minUpfront > 0 && (
              <div className="mini-calc">
                <div className="mini-calc-title">Tính trả góp</div>
                <div className="mini-calc-row">
                  <div className="calc-field">
                    <label>Giá máy (VND)</label>
                    <input
                      type="number"
                      className="calc-input"
                      placeholder="vd: 28000000"
                      value={phonePrice}
                      min={minUpfront}
                      onChange={(e) => setPhonePrice(e.target.value)}
                    />
                    {phonePrice && !phonePriceValid && (
                      <div className="calc-err">Phải ≥ {fmtNum(minUpfront)} VND</div>
                    )}
                  </div>
                  <div className="calc-field">
                    <label>Trả trước (VND)</label>
                    <input
                      type="number"
                      className="calc-input"
                      value={upfront}
                      min={minUpfront}
                      onChange={(e) => setUpfront(e.target.value)}
                    />
                    <div className="calc-hint">Tối thiểu: {fmtNum(minUpfront)} VND</div>
                    {upfront && !upfrontValid && (
                      <div className="calc-err">Phải ≥ {fmtNum(minUpfront)} VND</div>
                    )}
                  </div>
                </div>

                {phonePriceNum > 0 && phonePriceValid && upfrontValid && gop > 0 && (
                  <>
                    <div className="mini-calc-gop">
                      Trả góp: <strong>{fmtNum(gop)} VND</strong>
                    </div>
                    <div className="mini-calc-periods">
                      {rates.map((r) => (
                        <button
                          key={r.period}
                          className={`period-btn${period === r.period ? " on" : ""}`}
                          onClick={() => setPeriod(r.period)}
                        >
                          {r.period} kỳ
                          <span className="period-fee">phí {r.feeRatePercent}%</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {result && (
                  <div className="mini-calc-result">
                    <span className="mini-calc-result-label">Mỗi tuần trả</span>
                    <span className="mini-calc-result-amount">{fmtNum(result.weekly)} VND</span>
                  </div>
                )}
              </div>
            )}

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
