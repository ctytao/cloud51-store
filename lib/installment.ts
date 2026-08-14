import type { InstallmentModel, InstallmentRate } from "./sanity/types";

export const DEFAULT_RATES: InstallmentRate[] = [
  { period: 5,  feeRatePercent: 9  },
  { period: 10, feeRatePercent: 18 },
  { period: 15, feeRatePercent: 27 },
  { period: 20, feeRatePercent: 36 },
];

export interface PriceDisplay {
  primary: string;
  secondary?: string;
}

export function formatPriceDisplay(product: {
  price?: number;
  minPayment?: number;
}): PriceDisplay {
  const price = product.price;
  const min = product.minPayment;
  const hasPrice = typeof price === "number" && price > 0;
  const hasMin = typeof min === "number" && min > 0;

  if (hasPrice) {
    const primary = `${price.toLocaleString("vi-VN")}đ`;
    if (hasMin) {
      return {
        primary,
        secondary: `Trả trước ${(min * 1000).toLocaleString("vi-VN")}đ`,
      };
    }
    return { primary };
  }
  if (hasMin) {
    return { primary: `Trả trước: ${min.toLocaleString("vi-VN")}k` };
  }
  return { primary: "Liên hệ" };
}

export interface InstallmentOption {
  period: number;
  feeRatePercent: number;
  weekly: number;
}

export function calcInstallments(
  price: number,
  model: InstallmentModel,
  rates: InstallmentRate[]
): InstallmentOption[] {
  const minUpfront = model.minPayment * 1000;
  const gop = Math.max(0, price - minUpfront);
  if (gop <= 0) return [];
  return rates.map((r) => ({
    period: r.period,
    feeRatePercent: r.feeRatePercent,
    weekly: Math.ceil((gop * (1 + r.feeRatePercent / 100)) / r.period),
  }));
}
