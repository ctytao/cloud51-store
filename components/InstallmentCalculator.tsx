"use client";

import { useState, useMemo, useRef } from "react";
import { toPng } from "html-to-image";
import type { InstallmentModel, InstallmentSettings } from "@/lib/sanity/types";

function fmtVND(n: number) {
  return Math.round(n).toLocaleString("vi-VN");
}

function nowGMT7(): string {
  return new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

interface Props {
  models: InstallmentModel[];
  settings: InstallmentSettings | null;
}

const DEFAULT_RATES = [
  { period: 5,  feeRatePercent: 9  },
  { period: 10, feeRatePercent: 18 },
  { period: 15, feeRatePercent: 27 },
  { period: 20, feeRatePercent: 36 },
];

export function InstallmentCalculator({ models, settings }: Props) {
  const rates = settings?.rates?.length ? settings.rates : DEFAULT_RATES;

  const seriesGroups = useMemo(() => {
    const map = new Map<string, InstallmentModel[]>();
    for (const m of models) {
      if (!map.has(m.series)) map.set(m.series, []);
      map.get(m.series)!.push(m);
    }
    return map;
  }, [models]);

  const seriesList = useMemo(() => Array.from(seriesGroups.keys()), [seriesGroups]);

  const [activeSeries, setActiveSeries] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phonePrice, setPhonePrice] = useState("");
  const [upfront, setUpfront] = useState("");
  const [period, setPeriod] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  const exportRef = useRef<HTMLDivElement>(null);

  const selectedModel = models.find((m) => m._id === selectedId) ?? null;
  const seriesModels = activeSeries ? (seriesGroups.get(activeSeries) ?? []) : [];

  const phonePriceNum = parseFloat(phonePrice) || 0;
  const upfrontNum = parseFloat(upfront) || 0;
  const gop = Math.max(0, phonePriceNum - upfrontNum);

  const selectedRate = rates.find((r) => r.period === period) ?? null;

  const result = useMemo(() => {
    if (!selectedRate || gop <= 0) return null;
    const fee = (gop * selectedRate.feeRatePercent) / 100;
    const totalPaid = gop + fee;
    const weekly = Math.ceil(totalPaid / selectedRate.period);
    return { fee, totalPaid, weekly };
  }, [gop, selectedRate]);

  const minUpfront = (selectedModel?.minPayment ?? 0) * 1000;
  const upfrontValid = upfrontNum >= minUpfront;

  function handleSeriesSelect(series: string) {
    setActiveSeries(series);
    setSelectedId(null);
    setPhonePrice("");
    setUpfront("");
    setPeriod(null);
  }

  function handleModelSelect(id: string, minPay: number) {
    setSelectedId(id);
    setUpfront(String(minPay * 1000));
    setPeriod(null);
  }

  async function handleExport() {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `tragop-${selectedModel?.name ?? "iphone"}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="installment-calc">
      {/* Step 1: Series picker */}
      <div className="calc-section">
        <div className="calc-label">1. Chọn dòng iPhone</div>
        <div className="series-row">
          {seriesList.map((s) => (
            <button
              key={s}
              className={`series-chip${activeSeries === s ? " on" : ""}`}
              onClick={() => handleSeriesSelect(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {activeSeries && (
          <div className="model-series-items">
            {seriesModels.map((m) => (
              <button
                key={m._id}
                className={`model-item${selectedId === m._id ? " on" : ""}`}
                onClick={() => handleModelSelect(m._id, m.minPayment)}
              >
                <span className="model-name">iPhone {m.name}</span>
                <span className="model-min">HT {fmtVND(m.minPayment * 1000)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Step 2: Price inputs */}
      {selectedModel && (
        <div className="calc-section">
          <div className="calc-label">2. Nhập giá máy & số tiền trả trước</div>
          <div className="calc-inputs">
            <div className="calc-field">
              <label>Giá máy (VND)</label>
              <input
                type="number"
                className="calc-input"
                placeholder="vd: 28.000.000"
                value={phonePrice}
                min={0}
                onChange={(e) => setPhonePrice(e.target.value)}
              />
            </div>
            <div className="calc-field">
              <label>Trả trước (VND)</label>
              <input
                type="number"
                className="calc-input"
                placeholder={`Tối thiểu ${fmtVND(minUpfront)}`}
                value={upfront}
                min={minUpfront}
                onChange={(e) => setUpfront(e.target.value)}
              />
              <div className="calc-hint">Tối thiểu: {fmtVND(minUpfront)} VND</div>
              {upfront && !upfrontValid && (
                <div className="calc-err">Số tiền nhập phải lớn hơn {fmtVND(minUpfront)} VND</div>
              )}
            </div>
          </div>
          {phonePriceNum > 0 && upfrontValid && (
            <div className="calc-gop">
              Số tiền trả góp: <strong>{fmtVND(gop)} VND</strong>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Period picker */}
      {selectedModel && phonePriceNum > 0 && upfrontValid && gop > 0 && (
        <div className="calc-section">
          <div className="calc-label">3. Chọn số kỳ</div>
          <div className="period-row">
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
        </div>
      )}

      {/* Result */}
      {result && period && selectedModel && (
        <>
          <div ref={exportRef} className="calc-export-card">
            <div className="export-header">
              <div className="export-brand">Cloud51 Store</div>
              <div className="export-sub">Bảng tính trả góp</div>
            </div>
            <div className="export-model">iPhone {selectedModel.name}</div>
            <div className="export-rows">
              <div className="export-row">
                <span>Giá máy</span>
                <span>{fmtVND(phonePriceNum)} VND</span>
              </div>
              <div className="export-row">
                <span>Trả trước</span>
                <span>{fmtVND(upfrontNum)} VND</span>
              </div>
              <div className="export-row">
                <span>Số tiền trả góp</span>
                <span>{fmtVND(gop)} VND</span>
              </div>
              <div className="export-row">
                <span>Số kỳ</span>
                <span>{period} tuần</span>
              </div>
            </div>
            <div className="export-weekly-label">Mỗi tuần trả</div>
            <div className="export-weekly">{fmtVND(result.weekly)} <span>VND</span></div>
            <div className="export-totals">
              <div className="export-row">
                <span>Tổng phí</span>
                <span>{fmtVND(result.fee)} VND</span>
              </div>
              <div className="export-row">
                <span>Tổng thanh toán</span>
                <strong>{fmtVND(result.totalPaid)} VND</strong>
              </div>
            </div>
            <div className="export-ts">{nowGMT7()} (GMT+7)</div>
          </div>

          <button className="btn btn-p export-btn" onClick={handleExport} disabled={exporting}>
            {exporting ? "Đang xuất…" : "Xuất ảnh"}
          </button>
        </>
      )}
    </div>
  );
}
