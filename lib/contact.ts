export const CONTACT = {
  zalo: process.env.NEXT_PUBLIC_ZALO ?? "0888393339",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "0888393339",
};

export function zaloUrl(phone: string) {
  return `https://zalo.me/${phone}`;
}

export function telUrl(phone: string) {
  return `tel:${phone}`;
}
