import type { InstallmentModel, InstallmentRate } from "./sanity/types";

export const DEFAULT_RATES: InstallmentRate[] = [
  { period: 5,  feeRatePercent: 9  },
  { period: 10, feeRatePercent: 18 },
  { period: 15, feeRatePercent: 27 },
  { period: 20, feeRatePercent: 36 },
];

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
