export interface SanityImage {
  asset: { _ref: string };
  hotspot?: { x: number; y: number; height: number; width: number };
}

export interface Tag {
  _id: string;
  name: string;
  slug: { current: string };
}

export interface Product {
  _id: string;
  title: string;
  priority: number;
  slug: { current: string };
  image: SanityImage;
  detail?: string;
  price: number;
  tag?: Tag[];
}

export interface Banner {
  _id: string;
  title?: string;
  image: SanityImage;
  url: string;
  isActive: boolean;
}

export interface StoreEvent {
  _id: string;
  title?: string;
  image: SanityImage;
  url: string;
  isActive: boolean;
}
