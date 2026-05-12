# PRD — Cloud51 Store

## 1. Overview

**Product:** Cloud51 Store  
**Domain:** Apple device retail + iCloud financial services (Vietnam market)  
**Tagline:** Mở khoá iCloud | Bán iPhone góp qua iCloud | Vay - Góp iCloud  
**Translation:** iCloud Unlock | Sell iPhone on installment via iCloud | Borrow/Pay iCloud  
**Stage:** v0.0.1 — live prototype, single developer

---

## 2. Problem

Vietnamese buyers want Apple devices (iPhone, Macbook, iPad) but face two barriers:
1. **Price** — full upfront cost is prohibitive
2. **Locked devices** — iCloud-locked secondhand devices are cheap but unusable without unlock

Cloud51 bridges both gaps: sells installment-financed Apple devices and offers iCloud unlock services, mediated entirely via Zalo (Vietnam's dominant chat app).

---

## 3. Goals

| Priority | Goal |
|----------|------|
| P0 | Display products by device category with price and detail |
| P0 | Drive customer contact via Zalo / phone call |
| P1 | Showcase active promotions via banner carousel and event image |
| P1 | CMS-driven content — owner updates products without code deploys |
| P2 | Dark/light theme for user preference |
| P3 | About page for trust-building |

**Non-goals (current scope):**
- Cart / checkout / payment processing
- User auth / accounts
- Order tracking
- Search (UI exists but disabled)

---

## 4. Users

### Primary — Potential Buyer
- Vietnamese, mobile-first
- Looking for affordable Apple device or iCloud unlock
- Contacts via Zalo or phone; does NOT expect to buy online
- Needs: see product + price → contact seller

### Secondary — Store Owner (Admin)
- Manages product catalog, banners, events via Sanity Studio
- Needs: simple CMS, no code required for content updates

---

## 5. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Animation | Framer Motion |
| CMS | Sanity v3 (hosted) |
| Deployment | Vercel (inferred — `@vercel/analytics`) |
| Carousel | Embla Carousel |
| Language | TypeScript |

**Data flow:** Sanity CDN API → `fetch` with 60s ISR revalidation → Next.js RSC → Client components

---

## 6. Information Architecture

```
/                   → Home (banner + all products tabbed by device)
/iphone             → iPhone products only
/macbook            → Macbook products only
/ipad               → iPad products only
/about              → Store info / trust page
/studio             → Sanity CMS (admin only, no auth gate currently)
```

---

## 7. Data Model (Sanity)

### `sanPham` (Product)
| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Required |
| `priority` | number | Lower = shown later |
| `slug` | slug | Auto from title |
| `image` | image | Hotspot enabled |
| `detail` | text | Optional description |
| `price` | number | VND |
| `tag` | reference[] → `tag` | Maps to device model (iPhone12, etc.) |

### `tag`
| Field | Type |
|-------|------|
| `name` | string |
| `slug` | slug |

### `banner`
| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Optional |
| `image` | image | Required |
| `url` | string | Click target URL |
| `isActive` | boolean | Toggle visibility |

### `event`
| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Optional |
| `image` | image | Square format |
| `url` | string | Click target URL |
| `isActive` | boolean | Latest active shown |

### `vendor`
| Field | Type |
|-------|------|
| `name` | string |
| `slug` | slug |

> [!NOTE]
> `vendor` defined in schema but not fetched in current `fetcher.ts`. Unused in UI. Planned feature.

---

## 8. Feature Specs

### F-01: Banner Carousel (Home)
- Fetch all `banner` where `isActive == true`
- Display as auto-advancing Embla carousel
- Each banner links to `url` on click
- Full-width, responsive

### F-02: Product Listing
- Fetch all `sanPham`, sorted by `priority` descending (higher = shown first)
- Tabbed view: iPhone / Macbook / iPad tabs filter by `tag`
- ProductCard shows: image, title, price (VND formatted), "Chi Tiết" button
- Click card or button → modal with detail text + "Liên hệ" CTA

### F-03: Product Detail Modal
- Title, detail text (fallback: "Vui lòng liên hệ để nhận ưu đãi!!")
- "Liên hệ" → opens `https://zalo.me/0888393339` in new tab
- "Close" → dismiss

### F-04: Event Image (Home)
- Latest active `event` document shown as square image below products
- Links to `url` on click
- Only one event shown (most recent active)

### F-05: Category Pages (/iphone, /macbook, /ipad)
- Same product list filtered server-side by tag slug
- Same ProductCard + modal behavior

### F-06: Floating Contact Buttons
- Fixed bottom-right, two buttons: Phone + Zalo
- Phone → `tel:888393339`
- Zalo → `https://zalo.me/0888393339`
- Both use spinning icon animation

### F-07: Dark/Light Theme
- Toggle in navbar (ThemeSwitch component)
- Persisted via `next-themes`

### F-08: About Page
- Static content (trust-building, store info)

### F-09: Sanity Studio (/studio)
- Embedded Next.js Sanity Studio
- Owner manages all content (products, banners, events, tags, vendors)

> [!WARNING]
> Studio at `/studio` has no auth gate. Any user who knows the URL can access the CMS.

---

## 9. Current Gaps & Issues

| # | Issue | Severity |
|---|-------|----------|
| G-01 | `/studio` unprotected — no auth | High |
| G-02 | Search UI built but disabled (commented out) | Medium |
| G-03 | `vendor` schema exists but unused in fetcher/UI | Low |
| G-04 | `priority` sort logic inverted in schema comment ("Nhỏ hiển thị cuối" = small shows last) — needs GROQ `order(priority desc)` verified | Medium |
| G-05 | Phone number hardcoded in 3 places (`ProductCard`, `FloatingContactButton`) | Low |
| G-06 | No `sitemap.xml` / `robots.txt` for SEO | Medium |
| G-07 | No error boundary on data fetch failures beyond `error.tsx` | Low |
| G-08 | No loading skeleton — blank flash during ISR revalidation | Low |
| G-09 | `/studio` link in nav items absent — admin access not navigable | Low |

---

## 10. Roadmap

### Now (stabilize)
- [ ] Protect `/studio` with Sanity auth or basic password
- [ ] Centralize contact number in env/config
- [ ] Verify GROQ sort order matches priority intent
- [ ] Add `sitemap.xml` + `robots.txt`

### Next (enhance)
- [ ] Enable search (already has UI skeleton)
- [ ] Connect `vendor` to product display
- [ ] Loading skeletons for product grid
- [ ] WhatsApp/Facebook contact option alongside Zalo

### Later (scale)
- [ ] Multi-language (VI/EN)
- [ ] Product inquiry form (no full checkout needed)
- [ ] Analytics dashboard for owner (view counts per product)
- [ ] Image optimization audit (all images via Sanity CDN with width params)

---

## 11. Success Metrics

| Metric | Target |
|--------|--------|
| Zalo contact click-through rate | > 5% of product views |
| Page load (LCP mobile) | < 2.5s |
| Product update time (owner) | < 5 min without developer |
| Uptime | > 99.5% |
