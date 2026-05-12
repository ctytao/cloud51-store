"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import type { Banner } from "@/lib/sanity/types";
import { zaloUrl } from "@/lib/contact";

interface Props {
  banners: Banner[];
  fallbackZalo: string;
}

export function BannerCarousel({ banners, fallbackZalo }: Props) {
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  if (banners.length === 0) return null;

  return (
    <div className="carousel">
      <div className="carousel-viewport" ref={emblaRef}>
        <div className="carousel-track">
          {banners.map((banner) => {
            const imgUrl = urlFor(banner.image).width(800).height(450).fit("crop").url();
            const href = banner.url || zaloUrl(fallbackZalo);
            return (
              <div key={banner._id} className="banner" onClick={() => window.open(href, "_blank")}>
                <Image className="banner-img" src={imgUrl} alt={banner.title ?? "Banner"} fill sizes="430px" priority />
                {banner.title && (
                  <div className="banner-inner">
                    <div className="b-title">{banner.title}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {banners.length > 1 && (
        <div className="dots">
          {banners.map((_, i) => (
            <div key={i} className={`dot${i === selectedIndex ? " on" : ""}`} />
          ))}
        </div>
      )}
    </div>
  );
}
