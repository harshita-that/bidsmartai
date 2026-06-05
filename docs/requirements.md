# BidSmart — Requirements Document

> Derived from [idea.md](file:///c:/projects/bidsmart/idea.md)

---

## Table of Contents

1. [Overview](#overview)
2. [User Roles & Personas](#user-roles--personas)
3. [Functional Requirements](#functional-requirements)
4. [Non-Functional Requirements](#non-functional-requirements)
5. [User Stories](#user-stories)
6. [Data Models](#data-models)
7. [API Requirements](#api-requirements)
8. [Third-Party Integrations](#third-party-integrations)
9. [UI/UX Requirements](#uiux-requirements)
10. [Security & Compliance](#security--compliance)
11. [Phased Delivery Plan](#phased-delivery-plan)
12. [Success Metrics & KPIs](#success-metrics--kpis)

---

## 1. Overview

**Product Name:** BidSmart
**Tagline:** Predict prices. Bid smarter. Never overpay again.
**Purpose:** An auction intelligence platform that analyzes historical auction data to predict sale prices, surface comparable sales, and generate personalized bidding strategies for collectors and resellers.

### Goals

| # | Goal | Description |
|---|------|-------------|
| G1 | Price Accuracy | Predict auction final sale prices within ±15% accuracy |
| G2 | Actionable Strategy | Provide platform-specific bidding tactics (timing, max bid, walk-away price) |
| G3 | Multi-Platform | Support major auction platforms (eBay, Heritage, LiveAuctioneers, Catawiki) |
| G4 | Accessibility | Make professional-grade market intelligence available to casual users |
| G5 | Monetization | Drive revenue through tiered subscription plans |

---

## 2. User Roles & Personas

### 2.1 Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **Guest** | Unauthenticated visitor | View landing page, pricing, sample predictions |
| **Free User** | Registered user on free tier | 5 lookups/month, basic price estimates |
| **Pro User** | Subscribed at $19/month | Unlimited lookups, full strategies, watchlist, alerts |
| **Dealer User** | Subscribed at $49/month | Everything in Pro + bulk analysis, API access, reseller tools, portfolio |
| **Admin** | Internal platform administrator | User management, data pipeline monitoring, model performance dashboards |

### 2.2 Personas

| Persona | Role | Behavior |
|---------|------|----------|
| **Alex** — Casual Collector | Free → Pro | Collects vintage watches, bids on eBay 2–3 times/month, wants to avoid overpaying |
| **Maria** — Reseller / Flipper | Pro → Dealer | Buys and resells trading cards, needs margin calculations and ROI tracking |
| **David** — Estate Sale Buyer | Pro | Attends estate sales, wants to snap photos and get instant valuations on-site |
| **Linda** — Antique Dealer | Dealer | Runs a shop, needs bulk comp analysis and portfolio tracking for inventory |

---

## 3. Functional Requirements

### 3.1 Authentication & User Management

| ID | Requirement | Priority | Tier |
|----|-------------|----------|------|
| FR-AUTH-01 | Users can register with email/password or OAuth (Google, Apple) | Must | All |
| FR-AUTH-02 | Users can log in, log out, and reset passwords | Must | All |
| FR-AUTH-03 | Users can manage their profile (name, email, avatar, notification preferences) | Must | All |
| FR-AUTH-04 | Users can view and manage their subscription tier | Must | All |
| FR-AUTH-05 | System enforces lookup limits based on subscription tier (5/month for free) | Must | Free |
| FR-AUTH-06 | Remaining lookup count is visible in the UI at all times | Should | Free |

---

### 3.2 Item Lookup & Price Prediction

| ID | Requirement | Priority | Tier |
|----|-------------|----------|------|
| FR-PRED-01 | Users can paste an auction listing URL to initiate a lookup | Must | All |
| FR-PRED-02 | System extracts item metadata from the listing (title, description, images, category, condition) | Must | All |
| FR-PRED-03 | System returns a **predicted sale price** with confidence interval (e.g., $800–$1,200 at 80% confidence) | Must | All |
| FR-PRED-04 | System displays a **price trend indicator** (trending up / stable / trending down) | Must | All |
| FR-PRED-05 | Free tier shows a simplified prediction (point estimate + range); Pro/Dealer sees full breakdown | Must | All |
| FR-PRED-06 | Users can upload a photo for item identification and valuation (photo-based lookup) | Must | Pro+ |
| FR-PRED-07 | System identifies the item from the photo (category, brand, model, estimated condition) | Must | Pro+ |
| FR-PRED-08 | System returns prediction results within **5 seconds** for link-based lookups | Must | All |
| FR-PRED-09 | System returns prediction results within **10 seconds** for photo-based lookups | Should | Pro+ |
| FR-PRED-10 | Users can manually correct or refine item details to improve prediction accuracy | Should | All |

---

### 3.3 Comparable Sales Engine

| ID | Requirement | Priority | Tier |
|----|-------------|----------|------|
| FR-COMP-01 | System displays 5–10 most similar completed auction results for every lookup | Must | All |
| FR-COMP-02 | Each comparable shows: item title, sale price, date, platform, condition, and thumbnail | Must | All |
| FR-COMP-03 | Users can filter comparables by: time period, condition/grade, platform, price range | Should | Pro+ |
| FR-COMP-04 | System displays a **price history chart** showing comparable sale prices over time | Must | Pro+ |
| FR-COMP-05 | Users can click through to the original listing for each comparable (if still available) | Should | All |
| FR-COMP-06 | Similarity scoring is based on semantic matching (not just keyword) using item attributes | Must | All |

---

### 3.4 Bidding Strategy

| ID | Requirement | Priority | Tier |
|----|-------------|----------|------|
| FR-STRAT-01 | System generates a **recommended maximum bid** based on predicted sale price and market data | Must | Pro+ |
| FR-STRAT-02 | System provides **bid timing advice** (e.g., "Bid in the final 30 seconds on eBay") | Must | Pro+ |
| FR-STRAT-03 | System calculates a **walk-away price** — the point above which the user should stop bidding | Must | Pro+ |
| FR-STRAT-04 | Strategy adapts to the specific platform's auction mechanics (sniping for eBay, proxy bidding for Heritage) | Must | Pro+ |
| FR-STRAT-05 | Free tier shows a generic tip; Pro/Dealer gets full personalized strategy | Must | All |
| FR-STRAT-06 | Reseller mode: strategy factors in platform fees, estimated shipping, and taxes to show **net profit margin** | Must | Dealer |
| FR-STRAT-07 | Reseller mode: system shows estimated **ROI percentage** and break-even price | Must | Dealer |

---

### 3.5 Watchlist & Alerts

| ID | Requirement | Priority | Tier |
|----|-------------|----------|------|
| FR-WATCH-01 | Users can save items to a personal watchlist | Must | Pro+ |
| FR-WATCH-02 | Watchlist displays current bid, predicted final price, time remaining, and strategy summary | Must | Pro+ |
| FR-WATCH-03 | Users receive **email/push alerts** when a watched item is approaching its end time | Must | Pro+ |
| FR-WATCH-04 | Users receive alerts when a **new listing** matching their interests appears below predicted market value | Should | Pro+ |
| FR-WATCH-05 | Users can configure alert preferences (email, push, frequency, quiet hours) | Should | Pro+ |
| FR-WATCH-06 | Watchlist supports items across all integrated platforms in a unified view | Must | Pro+ |

---

### 3.6 Portfolio Tracking

| ID | Requirement | Priority | Tier |
|----|-------------|----------|------|
| FR-PORT-01 | Users can add items they own to a personal portfolio (manually or from past lookups) | Must | Dealer |
| FR-PORT-02 | System displays estimated **current market value** for each portfolio item | Must | Dealer |
| FR-PORT-03 | System shows **total portfolio value** with historical chart | Must | Dealer |
| FR-PORT-04 | Users can record purchase price to track **unrealized gains/losses** | Should | Dealer |
| FR-PORT-05 | Portfolio items auto-update valuations based on latest market data | Should | Dealer |

---

### 3.7 Bulk Analysis (Dealer)

| ID | Requirement | Priority | Tier |
|----|-------------|----------|------|
| FR-BULK-01 | Dealer users can upload a CSV of items for batch valuation | Must | Dealer |
| FR-BULK-02 | System processes batch uploads asynchronously and notifies user on completion | Must | Dealer |
| FR-BULK-03 | Batch results are downloadable as CSV/PDF report | Must | Dealer |
| FR-BULK-04 | Dealer users have access to the BidSmart API for programmatic lookups | Should | Dealer |

---

### 3.8 Search & Discovery

| ID | Requirement | Priority | Tier |
|----|-------------|----------|------|
| FR-SEARCH-01 | Users can search the BidSmart database by keyword, category, or item attributes | Must | All |
| FR-SEARCH-02 | Search results show predicted price ranges and recent sale trends | Should | All |
| FR-SEARCH-03 | System offers **category browsing** (watches, comics, coins, art, electronics, etc.) | Should | All |
| FR-SEARCH-04 | Users can explore **trending categories** — what's heating up or cooling down in the market | Should | Pro+ |

---

### 3.9 Subscription & Billing

| ID | Requirement | Priority | Tier |
|----|-------------|----------|------|
| FR-BILL-01 | Users can subscribe to Pro or Dealer plans via credit card or PayPal | Must | All |
| FR-BILL-02 | System supports monthly and annual billing cycles (annual at a discount) | Should | All |
| FR-BILL-03 | Users can upgrade, downgrade, or cancel their subscription at any time | Must | All |
| FR-BILL-04 | System handles prorated billing for mid-cycle changes | Should | All |
| FR-BILL-05 | Users receive email receipts for all transactions | Must | All |
| FR-BILL-06 | Free trial: 7-day Pro trial for new users (no credit card required) | Should | Free |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-PERF-01 | Link-based lookup response time | < 5 seconds (p95) |
| NFR-PERF-02 | Photo-based lookup response time | < 10 seconds (p95) |
| NFR-PERF-03 | Page load time (initial) | < 2 seconds |
| NFR-PERF-04 | API response time (non-prediction endpoints) | < 500ms (p95) |
| NFR-PERF-05 | Concurrent users supported | 1,000+ simultaneous |
| NFR-PERF-06 | Batch processing throughput | 100 items within 5 minutes |

### 4.2 Scalability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-SCALE-01 | Horizontal scaling for API servers | Auto-scale based on load |
| NFR-SCALE-02 | Database handles growing auction data | 10M+ auction records without degradation |
| NFR-SCALE-03 | ML model serving | Scalable inference (containerized) |

### 4.3 Reliability & Availability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-REL-01 | Uptime SLA | 99.5% monthly |
| NFR-REL-02 | Data backup frequency | Daily automated backups |
| NFR-REL-03 | Disaster recovery RTO | < 4 hours |
| NFR-REL-04 | Graceful degradation | If ML service is down, show comps without predictions |

### 4.4 Maintainability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-MAINT-01 | Code test coverage | ≥ 80% for backend services |
| NFR-MAINT-02 | CI/CD pipeline | Automated build, test, deploy on merge to main |
| NFR-MAINT-03 | Logging and monitoring | Structured logs + alerting (errors, latency spikes) |
| NFR-MAINT-04 | Model retraining cadence | Weekly with new auction data |

---

## 5. User Stories

### Authentication

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| US-01 | As a visitor, I want to register for an account so I can start using BidSmart | Registration form validates inputs; confirmation email sent; user lands on dashboard |
| US-02 | As a user, I want to log in with Google so I can access my account quickly | OAuth flow completes; user profile auto-populated; redirected to dashboard |

### Price Prediction

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| US-03 | As a collector, I want to paste an eBay listing link so I can see what the item will likely sell for | Link is parsed; item metadata extracted; prediction displayed with confidence interval within 5s |
| US-04 | As a collector, I want to see confidence intervals so I understand the range of likely outcomes | Prediction shows low/mid/high estimates with percentage confidence |
| US-05 | As a user, I want to upload a photo of an item so I can get a valuation without a listing link | Photo is analyzed; item identified; prediction returned with category and condition estimate |
| US-06 | As a user, I want to see whether prices for this type of item are trending up or down | Trend indicator displayed (↑ up / → stable / ↓ down) with percentage change |

### Comparable Sales

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| US-07 | As a collector, I want to see similar items that recently sold so I can validate the prediction | 5–10 comparable sales shown with title, price, date, platform, thumbnail |
| US-08 | As a Pro user, I want to filter comparables by time period and condition | Filter controls available; results update dynamically; chart reflects filtered data |
| US-09 | As a user, I want to see a price history chart so I can understand market movement | Interactive chart displayed with data points for comparable sales over time |

### Bidding Strategy

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| US-10 | As a collector, I want a recommended max bid so I know my ceiling | Max bid amount displayed prominently alongside prediction |
| US-11 | As a collector, I want timing advice so I know when to place my bid | Platform-specific timing recommendation displayed (e.g., "Bid in final 30 seconds") |
| US-12 | As a reseller, I want to see profit margins so I know if flipping this item is worthwhile | Net profit, ROI %, and break-even price shown after platform fees and shipping |

### Watchlist & Alerts

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| US-13 | As a Pro user, I want to save items to a watchlist so I can track them across platforms | Item added to watchlist; appears in unified watchlist view with live status |
| US-14 | As a Pro user, I want to get alerted when a watched auction is ending soon | Email/push notification sent at configured time before auction end |
| US-15 | As a user, I want to be notified when a new listing appears below market value | Alert sent with listing details and predicted value vs. current price |

### Portfolio & Reseller

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| US-16 | As a dealer, I want to track my inventory's market value over time | Portfolio dashboard shows total value, per-item values, and historical chart |
| US-17 | As a dealer, I want to bulk-upload items for batch valuation | CSV upload accepted; processing completes asynchronously; downloadable report generated |
| US-18 | As a dealer, I want API access so I can integrate BidSmart into my existing tools | API key generated; REST endpoints available; rate limits enforced per plan |

### Subscription

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| US-19 | As a free user, I want to upgrade to Pro so I can unlock unlimited lookups | Upgrade flow via Stripe; immediate access to Pro features; receipt emailed |
| US-20 | As a Pro user, I want to cancel my subscription without losing my data | Subscription cancelled; access continues until end of billing period; data retained |

---

## 6. Data Models

### 6.1 Core Entities

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    User      │     │     Lookup       │     │   Prediction    │
├─────────────┤     ├──────────────────┤     ├─────────────────┤
│ id           │────▶│ id               │────▶│ id              │
│ email        │     │ user_id          │     │ lookup_id       │
│ name         │     │ input_type       │     │ predicted_low   │
│ avatar_url   │     │ listing_url      │     │ predicted_mid   │
│ tier         │     │ image_url        │     │ predicted_high  │
│ lookups_used │     │ platform         │     │ confidence      │
│ created_at   │     │ item_metadata    │     │ trend_direction │
│ updated_at   │     │ created_at       │     │ trend_pct       │
└─────────────┘     └──────────────────┘     │ model_version   │
                                              │ created_at      │
                                              └─────────────────┘
```

### 6.2 Auction Data

```
┌────────────────────┐     ┌──────────────────┐
│  AuctionRecord     │     │   Category       │
├────────────────────┤     ├──────────────────┤
│ id                 │     │ id               │
│ platform           │     │ name             │
│ platform_id        │     │ slug             │
│ title              │     │ parent_id        │
│ description        │     └──────────────────┘
│ category_id        │
│ condition          │
│ grade              │
│ images[]           │
│ sale_price         │
│ currency           │
│ sale_date          │
│ listing_url        │
│ seller_id          │
│ metadata (JSONB)   │
│ embedding (vector) │
│ created_at         │
└────────────────────┘
```

### 6.3 User Features

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  WatchlistItem  │     │  PortfolioItem   │     │     Alert        │
├─────────────────┤     ├──────────────────┤     ├──────────────────┤
│ id              │     │ id               │     │ id               │
│ user_id         │     │ user_id          │     │ user_id          │
│ listing_url     │     │ item_name        │     │ type             │
│ platform        │     │ category_id      │     │ watchlist_item_id│
│ item_metadata   │     │ purchase_price   │     │ trigger          │
│ predicted_price │     │ purchase_date    │     │ channel          │
│ current_bid     │     │ current_value    │     │ sent_at          │
│ end_time        │     │ condition        │     │ created_at       │
│ status          │     │ images[]         │     └──────────────────┘
│ created_at      │     │ notes            │
└─────────────────┘     │ created_at       │
                        └──────────────────┘

┌──────────────────┐
│  Subscription    │
├──────────────────┤
│ id               │
│ user_id          │
│ tier             │
│ stripe_sub_id    │
│ billing_cycle    │
│ status           │
│ current_period_start │
│ current_period_end   │
│ created_at       │
└──────────────────┘
```

---

## 7. API Requirements

### 7.1 Public API Endpoints

| Method | Endpoint | Description | Auth | Tier |
|--------|----------|-------------|------|------|
| POST | `/api/auth/register` | Register a new user | No | All |
| POST | `/api/auth/login` | Log in and receive JWT | No | All |
| POST | `/api/auth/oauth/{provider}` | OAuth login (Google, Apple) | No | All |
| POST | `/api/lookup/url` | Submit a listing URL for prediction | Yes | All |
| POST | `/api/lookup/image` | Upload an image for prediction | Yes | Pro+ |
| GET | `/api/lookup/{id}` | Retrieve a past lookup result | Yes | All |
| GET | `/api/lookup/{id}/comparables` | Get comparable sales for a lookup | Yes | All |
| GET | `/api/lookup/{id}/strategy` | Get bidding strategy for a lookup | Yes | Pro+ |
| GET | `/api/watchlist` | List all watchlist items | Yes | Pro+ |
| POST | `/api/watchlist` | Add an item to the watchlist | Yes | Pro+ |
| DELETE | `/api/watchlist/{id}` | Remove an item from watchlist | Yes | Pro+ |
| GET | `/api/portfolio` | List all portfolio items | Yes | Dealer |
| POST | `/api/portfolio` | Add an item to portfolio | Yes | Dealer |
| PUT | `/api/portfolio/{id}` | Update a portfolio item | Yes | Dealer |
| DELETE | `/api/portfolio/{id}` | Remove a portfolio item | Yes | Dealer |
| POST | `/api/bulk/upload` | Upload CSV for batch analysis | Yes | Dealer |
| GET | `/api/bulk/{job_id}` | Check batch job status | Yes | Dealer |
| GET | `/api/bulk/{job_id}/results` | Download batch results | Yes | Dealer |
| GET | `/api/search` | Search auction database | Yes | All |
| GET | `/api/categories` | List available categories | No | All |
| GET | `/api/trending` | Get trending categories | Yes | Pro+ |
| POST | `/api/subscription/checkout` | Create a subscription checkout session | Yes | All |
| POST | `/api/subscription/cancel` | Cancel current subscription | Yes | All |
| GET | `/api/subscription` | Get current subscription details | Yes | All |
| GET | `/api/user/profile` | Get user profile | Yes | All |
| PUT | `/api/user/profile` | Update user profile | Yes | All |
| GET | `/api/user/lookups/remaining` | Get remaining lookup count | Yes | Free |

### 7.2 Webhook Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhooks/stripe` | Handle Stripe subscription events |
| POST | `/api/webhooks/alerts` | Internal: trigger alert delivery |

### 7.3 API Standards

- **Format:** JSON request/response bodies
- **Auth:** Bearer token (JWT) in Authorization header
- **Versioning:** URL-based (`/api/v1/...`)
- **Rate Limits:** Free: 10 req/min, Pro: 60 req/min, Dealer: 200 req/min
- **Errors:** Standard HTTP status codes with `{ error: string, code: string, details?: object }` body
- **Pagination:** Cursor-based for list endpoints (`?cursor=xxx&limit=20`)

---

## 8. Third-Party Integrations

| Integration | Purpose | Phase |
|-------------|---------|-------|
| **eBay Browse API** | Fetch active listings & completed sales data | MVP |
| **eBay Finding API** | Search for items and retrieve metadata | MVP |
| **Heritage Auctions API** | Completed auction results for collectibles | Phase 2 |
| **LiveAuctioneers** | Scraping/API for antiques and art sales | Phase 2 |
| **Catawiki** | European auction data | Phase 3 |
| **Stripe** | Payment processing and subscription management | MVP |
| **Google Cloud Vision API** | Image recognition for photo-based lookups | MVP |
| **SendGrid / Resend** | Transactional email (alerts, receipts, onboarding) | MVP |
| **Firebase Cloud Messaging** | Push notifications for alerts | Phase 2 |
| **Elasticsearch** | Comparable sales search and similarity ranking | MVP |
| **Redis** | Caching predictions, rate limiting, session store | MVP |
| **Sentry** | Error tracking and monitoring | MVP |
| **Google Analytics / Mixpanel** | Usage analytics and conversion tracking | MVP |

---

## 9. UI/UX Requirements

### 9.1 Pages & Views

| Page | Description | Access |
|------|-------------|--------|
| **Landing Page** | Hero, value prop, sample prediction, pricing, CTA | Public |
| **Login / Register** | Auth forms with OAuth options | Public |
| **Dashboard** | Overview: recent lookups, watchlist summary, quick lookup input | Authenticated |
| **Lookup Result** | Prediction, comparables, strategy, save to watchlist | Authenticated |
| **Watchlist** | Unified view of tracked items across platforms | Pro+ |
| **Portfolio** | Collection value tracker with charts | Dealer |
| **Bulk Upload** | CSV upload interface with job status tracking | Dealer |
| **Search / Explore** | Search auction database, browse categories, trending | Authenticated |
| **Pricing** | Plan comparison and upgrade flow | Public |
| **Settings** | Profile, notifications, subscription management | Authenticated |

### 9.2 Design Principles

- **Dark mode first** with light mode toggle
- **Premium, modern aesthetic** — glassmorphism, smooth gradients, micro-animations
- **Mobile-responsive** — fully usable on phones for estate sale / on-the-go use
- **Data-rich but scannable** — charts, cards, and clear visual hierarchy
- **Instant feedback** — loading states, skeleton screens, optimistic UI updates

### 9.3 Key UI Components

| Component | Description |
|-----------|-------------|
| **Lookup Input** | URL paste field + photo upload dropzone, prominently placed |
| **Prediction Card** | Shows price range gauge, confidence %, trend arrow, strategy summary |
| **Comparable Sales Grid** | Card grid with thumbnails, prices, dates, and platform badges |
| **Price History Chart** | Interactive line/scatter chart with tooltips and time range selector |
| **Strategy Panel** | Max bid, timing advice, walk-away price, and reseller profit breakdown |
| **Watchlist Table** | Sortable table with status badges, time remaining, and quick actions |
| **Portfolio Dashboard** | Total value card, value-over-time chart, individual item cards |

---

## 10. Security & Compliance

### 10.1 Authentication & Authorization

| ID | Requirement |
|----|-------------|
| SEC-01 | Passwords hashed with bcrypt (min cost factor 12) |
| SEC-02 | JWT tokens expire after 24 hours; refresh tokens expire after 30 days |
| SEC-03 | Role-based access control (RBAC) enforced at API layer |
| SEC-04 | Rate limiting on auth endpoints to prevent brute-force attacks |
| SEC-05 | CSRF protection on all state-changing requests |

### 10.2 Data Protection

| ID | Requirement |
|----|-------------|
| SEC-06 | All traffic served over HTTPS (TLS 1.2+) |
| SEC-07 | PII encrypted at rest in the database |
| SEC-08 | Payment data never stored locally — handled entirely by Stripe |
| SEC-09 | API keys for dealer accounts can be rotated and revoked |
| SEC-10 | Database access restricted to application service accounts only |

### 10.3 Compliance

| ID | Requirement |
|----|-------------|
| SEC-11 | GDPR: Users can export and delete their data |
| SEC-12 | CCPA: Privacy policy with opt-out mechanisms |
| SEC-13 | Cookie consent banner for EU users |
| SEC-14 | Terms of Service and Privacy Policy pages |

---

## 11. Phased Delivery Plan

### Phase 1 — MVP (Weeks 1–8)

| Area | Scope |
|------|-------|
| **Platform** | eBay only |
| **Category** | Watches + Trading Cards |
| **Input** | Link-based lookup only |
| **Prediction** | Price range + confidence interval |
| **Comparables** | 5–10 similar completed auctions |
| **Strategy** | Basic max bid + timing tip (Pro only) |
| **Auth** | Email/password + Google OAuth |
| **Billing** | Stripe integration, Free + Pro tiers |
| **Frontend** | Landing page, dashboard, lookup result, pricing, settings |
| **Data** | eBay completed listings ingestion pipeline |

### Phase 2 — Growth (Weeks 9–16)

| Area | Scope |
|------|-------|
| **Platforms** | Add Heritage Auctions, LiveAuctioneers |
| **Input** | Photo-based lookup (Google Vision API) |
| **Features** | Watchlist, alerts (email), trending categories |
| **Strategy** | Platform-specific tactics, walk-away price |
| **Billing** | Dealer tier, annual billing |
| **Data** | Multi-platform ingestion, Elasticsearch for comps |

### Phase 3 — Scale (Weeks 17–24)

| Area | Scope |
|------|-------|
| **Platforms** | Add Catawiki |
| **Features** | Portfolio tracking, bulk analysis, API access |
| **Reseller** | Profit calculator, ROI projections, fee breakdowns |
| **Alerts** | Push notifications (FCM) |
| **Mobile** | PWA optimizations for mobile-first estate sale use |
| **ML** | Model v2 with feedback loop (actual vs. predicted tracking) |

### Phase 4 — Future (Post-launch)

| Area | Scope |
|------|-------|
| **Browser Extension** | Overlay predictions on auction listing pages |
| **Live Copilot** | Real-time bidding assistant during live auctions |
| **Native Mobile App** | iOS + Android with camera-based valuation |
| **Community** | Anonymized market insights and trend spotting |
| **AI Chat** | Natural language interface ("Should I buy this?") |
| **Sotheby's / Christie's** | High-end art and luxury goods |

---

## 12. Success Metrics & KPIs

### MVP Launch Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Prediction Accuracy** | ±15% of actual sale price | Compare predictions to actual results on holdout data |
| **Lookups in Month 1** | 1,000+ | Analytics dashboard |
| **Registered Users (Month 1)** | 500+ | User database count |
| **Free → Pro Conversion** | 5%+ | Stripe subscription events |
| **Lookup Response Time (p95)** | < 5 seconds | API monitoring (Sentry / Datadog) |
| **User Satisfaction** | 4+ stars (out of 5) | In-app feedback survey |

### Ongoing KPIs

| Metric | Target | Frequency |
|--------|--------|-----------|
| Monthly Active Users (MAU) | Growing 15% MoM | Monthly |
| Churn Rate | < 5% monthly | Monthly |
| Revenue (MRR) | Track toward $10K MRR by Month 6 | Monthly |
| Prediction Accuracy | Improving with each model version | Per retrain |
| API Uptime | ≥ 99.5% | Monthly |
| Support Ticket Volume | < 50/month at scale | Monthly |

---

*This document is a living reference. Update as requirements evolve through development and user feedback.*
