export const CONTACT = {
  zalo: process.env.NEXT_PUBLIC_ZALO ?? "0946507090",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "0946507090",
};

export function zaloUrl(phone: string) {
  return `https://zalo.me/${phone}`;
}

export function telUrl(phone: string) {
  return `tel:${phone}`;
}
