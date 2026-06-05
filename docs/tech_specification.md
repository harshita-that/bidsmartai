# BidSmart — Technical Specification

> Derived from [idea.md](file:///c:/projects/bidsmart/idea.md) and [requirements.md](file:///c:/projects/bidsmart/requirements.md)

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Technology Stack](#2-technology-stack)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Database Design](#5-database-design)
6. [ML Pipeline & Prediction Engine](#6-ml-pipeline--prediction-engine)
7. [Data Ingestion Pipeline](#7-data-ingestion-pipeline)
8. [API Specification](#8-api-specification)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [Search & Similarity Engine](#10-search--similarity-engine)
11. [Notification System](#11-notification-system)
12. [Payment & Subscription System](#12-payment--subscription-system)
13. [Caching Strategy](#13-caching-strategy)
14. [Infrastructure & Deployment](#14-infrastructure--deployment)
15. [Monitoring & Observability](#15-monitoring--observability)
16. [Security Implementation](#16-security-implementation)
17. [Testing Strategy](#17-testing-strategy)
18. [Error Handling & Resilience](#18-error-handling--resilience)
19. [Performance Budgets](#19-performance-budgets)
20. [Migration & Data Seeding](#20-migration--data-seeding)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        WEB["Next.js Web App"]
        PWA["PWA (Mobile)"]
        EXT["Browser Extension<br/>(Phase 4)"]
    end

    subgraph CDN["Edge / CDN"]
        VERCEL["Vercel Edge Network"]
    end

    subgraph API["API Layer"]
        NEXT_API["Next.js API Routes<br/>(BFF Layer)"]
        EXPRESS["Express.js<br/>Microservices"]
    end

    subgraph Services["Service Layer"]
        AUTH_SVC["Auth Service"]
        LOOKUP_SVC["Lookup Service"]
        STRATEGY_SVC["Strategy Service"]
        WATCHLIST_SVC["Watchlist Service"]
        PORTFOLIO_SVC["Portfolio Service"]
        SEARCH_SVC["Search Service"]
        BILLING_SVC["Billing Service"]
        ALERT_SVC["Alert Service"]
        INGESTION_SVC["Ingestion Service"]
    end

    subgraph ML["ML Layer"]
        PREDICTION["Prediction API<br/>(FastAPI / Python)"]
        VISION["Image Recognition<br/>(Google Vision API)"]
        EMBEDDINGS["Embedding Service"]
    end

    subgraph Data["Data Layer"]
        PG[(PostgreSQL)]
        REDIS[(Redis)]
        ES[(Elasticsearch)]
        S3["Object Storage<br/>(S3 / GCS)"]
    end

    subgraph External["External APIs"]
        EBAY["eBay API"]
        HERITAGE["Heritage Auctions"]
        LIVE["LiveAuctioneers"]
        STRIPE["Stripe"]
        SENDGRID["SendGrid"]
    end

    WEB --> VERCEL
    PWA --> VERCEL
    VERCEL --> NEXT_API
    NEXT_API --> EXPRESS
    EXPRESS --> Services
    Services --> Data
    LOOKUP_SVC --> ML
    INGESTION_SVC --> External
    BILLING_SVC --> STRIPE
    ALERT_SVC --> SENDGRID
```

### 1.2 Architecture Principles

| Principle | Implementation |
|-----------|---------------|
| **Separation of concerns** | Frontend (Next.js) → BFF (API Routes) → Microservices → Data Layer |
| **API-first design** | All functionality exposed via versioned REST endpoints |
| **Async by default** | Heavy operations (predictions, ingestion, bulk) run via job queues |
| **Graceful degradation** | If ML service is down, serve comps without predictions |
| **Horizontal scalability** | Stateless services, connection pooling, Redis-backed sessions |
| **Event-driven** | Webhook-based communication for billing, alerts, ingestion events |

### 1.3 Communication Patterns

```mermaid
graph LR
    subgraph Synchronous
        A["Client"] -->|"REST/JSON"| B["API Gateway"]
        B -->|"Internal HTTP"| C["Services"]
    end

    subgraph Asynchronous
        D["Ingestion Worker"] -->|"Bull Queue"| E["Redis"]
        E -->|"Job Processing"| F["Data Pipeline"]
        G["Alert Worker"] -->|"Bull Queue"| E
    end

    subgraph Events
        H["Stripe Webhook"] -->|"POST"| I["Billing Service"]
        I -->|"DB Event"| J["Subscription Updated"]
    end
```

| Pattern | Used For | Technology |
|---------|----------|-----------|
| **Request-Response** | Client ↔ API, API ↔ Services | HTTP/REST (JSON) |
| **Job Queue** | Ingestion, bulk analysis, alert delivery | Bull (Redis-backed) |
| **Webhook** | Stripe events, platform callbacks | HTTP POST |
| **Pub/Sub** | Internal event broadcasting (cache invalidation) | Redis Pub/Sub |

---

## 2. Technology Stack

### 2.1 Complete Stack Matrix

| Layer | Technology | Version | Justification |
|-------|-----------|---------|---------------|
| **Frontend Framework** | Next.js | 14.x (App Router) | SSR, RSC, API routes, Vercel-native |
| **UI Library** | React | 18.x | Component model, ecosystem, RSC support |
| **Styling** | Vanilla CSS | — | Maximum control, no framework overhead, custom design system |
| **Charts** | Recharts | 2.x | React-native, composable, lightweight |
| **State Management** | Zustand | 4.x | Lightweight, no boilerplate, TypeScript-native |
| **Form Handling** | React Hook Form + Zod | — | Performant forms with schema validation |
| **Backend Runtime** | Node.js | 20.x LTS | Unified JS stack, async I/O, mature ecosystem |
| **API Framework** | Express.js | 4.x | Lightweight, middleware ecosystem, battle-tested |
| **ML API** | FastAPI (Python) | 0.110+ | Async Python, auto-docs, pydantic validation |
| **Primary Database** | PostgreSQL | 16.x | JSONB, pgvector, full-text search, reliability |
| **Vector Extension** | pgvector | 0.7+ | Embedding similarity search within PostgreSQL |
| **Cache / Queue** | Redis | 7.x | Sub-ms caching, Bull job queues, rate limiting |
| **Search Engine** | Elasticsearch | 8.x | Full-text search, aggregations, similarity scoring |
| **Object Storage** | AWS S3 / GCS | — | Image storage, bulk upload files, reports |
| **ML Framework** | scikit-learn + XGBoost | — | Tabular data, fast inference, well-understood |
| **Embeddings** | Sentence-Transformers | — | Semantic similarity for comparable sales matching |
| **Image Recognition** | Google Cloud Vision API | — | Item identification from photos |
| **Payments** | Stripe | — | Subscriptions, checkout, webhooks |
| **Email** | Resend | — | Modern API, React email templates |
| **Error Tracking** | Sentry | — | Error capture, performance monitoring, source maps |
| **Analytics** | Mixpanel | — | Event tracking, funnels, user segmentation |
| **Hosting** | Vercel (frontend) + Railway/Render (backend) | — | Serverless frontend, managed backend containers |
| **CI/CD** | GitHub Actions | — | Automated testing, build, deploy pipelines |
| **Language** | TypeScript | 5.x | End-to-end type safety (frontend + backend) |

### 2.2 Monorepo Structure

```
bidsmart/
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── app/                # App Router pages & layouts
│   │   │   ├── (auth)/         # Auth route group
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/    # Authenticated route group
│   │   │   │   ├── dashboard/
│   │   │   │   ├── lookup/
│   │   │   │   │   └── [id]/
│   │   │   │   ├── watchlist/
│   │   │   │   ├── portfolio/
│   │   │   │   ├── bulk/
│   │   │   │   ├── search/
│   │   │   │   └── settings/
│   │   │   ├── pricing/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # Landing page
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/             # Design system primitives
│   │   │   ├── layout/         # Header, Sidebar, Footer
│   │   │   ├── lookup/         # Prediction cards, input forms
│   │   │   ├── charts/         # Price history, portfolio value
│   │   │   ├── watchlist/      # Watchlist table, item cards
│   │   │   └── portfolio/      # Portfolio dashboard components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities, API client, constants
│   │   ├── stores/             # Zustand state stores
│   │   └── styles/             # CSS modules & design tokens
│   │
│   ├── api/                    # Express.js backend API
│   │   ├── src/
│   │   │   ├── controllers/    # Route handlers
│   │   │   ├── services/       # Business logic layer
│   │   │   ├── models/         # Database models (Prisma)
│   │   │   ├── middleware/     # Auth, rate limiting, validation
│   │   │   ├── jobs/           # Bull queue job processors
│   │   │   ├── integrations/   # eBay, Heritage, etc. API clients
│   │   │   ├── utils/          # Helpers, error classes, logger
│   │   │   ├── routes/         # Express route definitions
│   │   │   ├── validators/     # Zod request schemas
│   │   │   └── index.ts        # Server entry point
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── migrations/     # SQL migrations
│   │   └── tests/
│   │
│   └── ml/                     # Python ML service
│       ├── api/                # FastAPI endpoints
│       │   ├── main.py
│       │   ├── routes/
│       │   └── schemas/
│       ├── models/             # Trained model files
│       ├── training/           # Training scripts & notebooks
│       │   ├── train_price_model.py
│       │   ├── train_embeddings.py
│       │   └── evaluate.py
│       ├── features/           # Feature engineering
│       ├── data/               # Sample/test data
│       ├── requirements.txt
│       └── Dockerfile
│
├── packages/
│   ├── shared/                 # Shared TypeScript types & utilities
│   │   ├── types/              # API types, entity interfaces
│   │   ├── constants/          # Shared constants (tiers, categories)
│   │   └── validators/         # Shared Zod schemas
│   └── config/                 # Shared ESLint, TSConfig, Prettier
│
├── infrastructure/
│   ├── docker/
│   │   ├── docker-compose.yml  # Local development stack
│   │   ├── docker-compose.test.yml
│   │   └── Dockerfile.*       # Per-service Dockerfiles
│   ├── scripts/
│   │   ├── seed.ts             # Database seeding script
│   │   ├── ingest.ts           # Manual ingestion trigger
│   │   └── migrate.ts          # Migration runner
│   └── k8s/                    # Kubernetes manifests (future)
│
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint, test, build
│       ├── deploy-web.yml      # Deploy frontend to Vercel
│       ├── deploy-api.yml      # Deploy backend to Railway
│       └── deploy-ml.yml       # Deploy ML service
│
├── package.json                # Workspace root
├── turbo.json                  # Turborepo configuration
├── tsconfig.base.json
└── README.md
```

### 2.3 Package Manager & Build

| Tool | Purpose |
|------|---------|
| **pnpm** | Package management with workspace support |
| **Turborepo** | Monorepo build orchestration, task caching |
| **TypeScript** | Type checking across all TS packages |
| **ESLint + Prettier** | Code linting and formatting |

---

## 3. Frontend Architecture

### 3.1 Next.js App Router Structure

```mermaid
graph TD
    ROOT["Root Layout<br/>(globals.css, fonts, providers)"]
    ROOT --> LANDING["/ (Landing Page)<br/>Public"]
    ROOT --> PRICING["/pricing<br/>Public"]
    ROOT --> AUTH_GROUP["(auth) Route Group"]
    ROOT --> DASH_GROUP["(dashboard) Route Group"]

    AUTH_GROUP --> LOGIN["/login"]
    AUTH_GROUP --> REGISTER["/register"]
    AUTH_GROUP --> RESET["/reset-password"]

    DASH_GROUP --> DASH_LAYOUT["Dashboard Layout<br/>(Sidebar, Header, Auth Guard)"]
    DASH_LAYOUT --> DASHBOARD["/dashboard"]
    DASH_LAYOUT --> LOOKUP["/lookup/[id]"]
    DASH_LAYOUT --> WATCHLIST["/watchlist"]
    DASH_LAYOUT --> PORTFOLIO["/portfolio"]
    DASH_LAYOUT --> BULK["/bulk"]
    DASH_LAYOUT --> SEARCH["/search"]
    DASH_LAYOUT --> SETTINGS["/settings"]
```

### 3.2 Component Architecture

```
components/
├── ui/                         # Design system primitives
│   ├── Button.tsx              # Primary, secondary, ghost, danger variants
│   ├── Input.tsx               # Text, password, search, URL inputs
│   ├── Card.tsx                # Base card with glass effect
│   ├── Badge.tsx               # Status, platform, tier badges
│   ├── Modal.tsx               # Dialog overlay
│   ├── Toast.tsx               # Notification toasts
│   ├── Skeleton.tsx            # Loading skeleton placeholders
│   ├── Tooltip.tsx             # Hover tooltips
│   ├── DropZone.tsx            # File/image upload area
│   ├── Tabs.tsx                # Tab navigation
│   ├── Table.tsx               # Sortable data table
│   ├── ProgressBar.tsx         # Confidence gauge / progress
│   ├── Avatar.tsx              # User avatar
│   └── ThemeToggle.tsx         # Dark/light mode switch
│
├── layout/
│   ├── Header.tsx              # Top bar: logo, search, user menu, theme toggle
│   ├── Sidebar.tsx             # Nav: Dashboard, Watchlist, Portfolio, Search, Settings
│   ├── Footer.tsx              # Links, legal, social
│   └── MobileNav.tsx           # Bottom nav for mobile
│
├── lookup/
│   ├── LookupInput.tsx         # URL paste + photo upload combined input
│   ├── PredictionCard.tsx      # Price range gauge, confidence %, trend
│   ├── StrategyPanel.tsx       # Max bid, timing, walk-away, profit calc
│   ├── ComparableGrid.tsx      # Grid of comparable sale cards
│   ├── ComparableCard.tsx      # Individual comparable sale
│   ├── PriceHistoryChart.tsx   # Interactive price history (Recharts)
│   ├── TrendBadge.tsx          # ↑ up / → stable / ↓ down indicator
│   └── ItemMetadata.tsx        # Extracted item details display
│
├── watchlist/
│   ├── WatchlistTable.tsx      # Sortable table with actions
│   ├── WatchlistRow.tsx        # Individual row with status
│   └── AddToWatchlist.tsx      # Quick-add button/modal
│
├── portfolio/
│   ├── PortfolioDashboard.tsx  # Total value, chart, summary stats
│   ├── PortfolioItemCard.tsx   # Individual item with gain/loss
│   ├── ValueChart.tsx          # Portfolio value over time
│   └── AddPortfolioItem.tsx    # Add item form/modal
│
├── charts/
│   ├── PriceScatterChart.tsx   # Comparable sales scatter plot
│   ├── TrendLineChart.tsx      # Category trend over time
│   └── ConfidenceGauge.tsx     # Visual confidence level indicator
│
├── search/
│   ├── SearchBar.tsx           # Global search with suggestions
│   ├── SearchFilters.tsx       # Category, platform, price range filters
│   ├── SearchResults.tsx       # Results grid with predicted prices
│   └── TrendingCategories.tsx  # Trending market categories
│
└── billing/
    ├── PricingTable.tsx        # Plan comparison table
    ├── UpgradeModal.tsx        # Stripe checkout trigger
    └── SubscriptionCard.tsx    # Current plan display in settings
```

### 3.3 State Management

```typescript
// stores/authStore.ts — Zustand
interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// stores/lookupStore.ts
interface LookupState {
  currentLookup: LookupResult | null;
  lookupHistory: LookupSummary[];
  isAnalyzing: boolean;
  submitUrl: (url: string) => Promise<LookupResult>;
  submitImage: (file: File) => Promise<LookupResult>;
  fetchHistory: () => Promise<void>;
}

// stores/watchlistStore.ts
interface WatchlistState {
  items: WatchlistItem[];
  isLoading: boolean;
  addItem: (listingUrl: string, platform: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  fetchItems: () => Promise<void>;
}
```

### 3.4 API Client Layer

```typescript
// lib/api.ts
class BidSmartAPI {
  private baseUrl: string;
  private token: string | null;

  // Auth
  async register(input: RegisterInput): Promise<AuthResponse>;
  async login(input: LoginInput): Promise<AuthResponse>;
  async oauthLogin(provider: string, code: string): Promise<AuthResponse>;

  // Lookups
  async lookupByUrl(url: string): Promise<LookupResult>;
  async lookupByImage(file: File): Promise<LookupResult>;
  async getLookup(id: string): Promise<LookupResult>;
  async getComparables(lookupId: string, filters?: CompFilter): Promise<Comparable[]>;
  async getStrategy(lookupId: string): Promise<BiddingStrategy>;

  // Watchlist
  async getWatchlist(cursor?: string): Promise<PaginatedResponse<WatchlistItem>>;
  async addToWatchlist(input: AddWatchlistInput): Promise<WatchlistItem>;
  async removeFromWatchlist(id: string): Promise<void>;

  // Portfolio
  async getPortfolio(): Promise<PortfolioSummary>;
  async addPortfolioItem(input: AddPortfolioInput): Promise<PortfolioItem>;
  async updatePortfolioItem(id: string, input: UpdatePortfolioInput): Promise<PortfolioItem>;
  async deletePortfolioItem(id: string): Promise<void>;

  // Search
  async search(query: string, filters?: SearchFilters): Promise<PaginatedResponse<SearchResult>>;
  async getTrending(): Promise<TrendingCategory[]>;
  async getCategories(): Promise<Category[]>;

  // Billing
  async createCheckout(tier: SubscriptionTier): Promise<{ url: string }>;
  async cancelSubscription(): Promise<void>;
  async getSubscription(): Promise<SubscriptionDetails>;

  // User
  async getProfile(): Promise<UserProfile>;
  async updateProfile(input: UpdateProfileInput): Promise<UserProfile>;
  async getLookupsRemaining(): Promise<{ used: number; limit: number }>;
}
```

### 3.5 Design System — CSS Custom Properties

```css
/* styles/tokens.css */

:root {
  /* === Color Palette === */
  --color-bg-primary: #0a0a0f;
  --color-bg-secondary: #12121a;
  --color-bg-elevated: #1a1a28;
  --color-bg-glass: rgba(255, 255, 255, 0.04);
  --color-bg-glass-hover: rgba(255, 255, 255, 0.08);

  --color-text-primary: #f0f0f5;
  --color-text-secondary: #8a8aa3;
  --color-text-muted: #5a5a72;

  --color-accent-primary: #6c5ce7;       /* Purple — main brand */
  --color-accent-secondary: #00cec9;     /* Teal — success / positive */
  --color-accent-warning: #fdcb6e;       /* Amber — caution */
  --color-accent-danger: #e17055;        /* Coral — danger / loss */
  --color-accent-gradient: linear-gradient(135deg, #6c5ce7, #a29bfe);

  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-hover: rgba(255, 255, 255, 0.15);

  /* === Typography === */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;

  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* === Spacing === */
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */

  /* === Radius === */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* === Shadows === */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 24px rgba(108, 92, 231, 0.3);

  /* === Glassmorphism === */
  --glass-bg: rgba(255, 255, 255, 0.04);
  --glass-border: 1px solid rgba(255, 255, 255, 0.08);
  --glass-blur: blur(20px);

  /* === Transitions === */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
  --transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* === Z-Index Scale === */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 300;
  --z-modal: 400;
  --z-toast: 500;

  /* === Layout === */
  --sidebar-width: 260px;
  --header-height: 64px;
  --max-content-width: 1200px;
}

/* Light mode overrides */
[data-theme="light"] {
  --color-bg-primary: #f5f5fa;
  --color-bg-secondary: #ffffff;
  --color-bg-elevated: #ffffff;
  --color-bg-glass: rgba(0, 0, 0, 0.02);
  --color-bg-glass-hover: rgba(0, 0, 0, 0.04);
  --color-text-primary: #1a1a2e;
  --color-text-secondary: #5a5a72;
  --color-text-muted: #8a8aa3;
  --color-border: rgba(0, 0, 0, 0.08);
  --color-border-hover: rgba(0, 0, 0, 0.15);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);
}
```

### 3.6 Responsive Breakpoints

```css
/* styles/breakpoints.css */

/* Mobile-first approach */
/* sm:  ≥ 640px  — large phones, landscape */
/* md:  ≥ 768px  — tablets */
/* lg:  ≥ 1024px — small desktops, landscape tablets */
/* xl:  ≥ 1280px — standard desktops */
/* 2xl: ≥ 1536px — large screens */

@media (max-width: 767px) {
  /* Mobile: hide sidebar, show bottom nav, stack layouts vertically */
}

@media (min-width: 768px) and (max-width: 1023px) {
  /* Tablet: collapsible sidebar, 2-column grids */
}

@media (min-width: 1024px) {
  /* Desktop: full sidebar, 3-column grids, expanded charts */
}
```

---

## 4. Backend Architecture

### 4.1 Service Layer Design

```mermaid
graph TD
    subgraph "Express.js API Server"
        ROUTER["Routes Layer"]
        MIDDLEWARE["Middleware Stack"]
        CONTROLLERS["Controllers"]
        SERVICES["Service Layer"]
        REPOS["Repository Layer"]
    end

    ROUTER --> MIDDLEWARE
    MIDDLEWARE --> CONTROLLERS
    CONTROLLERS --> SERVICES
    SERVICES --> REPOS
    REPOS --> DB[(PostgreSQL)]
    REPOS --> CACHE[(Redis)]
    SERVICES --> QUEUE["Job Queue (Bull)"]
    SERVICES --> EXTERNAL["External APIs"]
```

### 4.2 Middleware Stack

Middleware executes in order for every request:

```typescript
// Middleware execution order
app.use(cors(corsOptions));                    // 1. CORS
app.use(helmet());                             // 2. Security headers
app.use(express.json({ limit: '10mb' }));      // 3. Body parsing
app.use(requestId());                          // 4. Request ID generation
app.use(logger());                             // 5. Structured logging
app.use(rateLimiter());                        // 6. Rate limiting (Redis-backed)
app.use('/api/v1', authenticate());            // 7. JWT verification (optional)
app.use(tierGuard());                          // 8. Subscription tier enforcement
app.use(lookupLimiter());                      // 9. Lookup count enforcement
```

### 4.3 Service Interfaces

```typescript
// services/LookupService.ts
interface ILookupService {
  createFromUrl(userId: string, url: string): Promise<LookupResult>;
  createFromImage(userId: string, file: Buffer, mimeType: string): Promise<LookupResult>;
  getById(id: string, userId: string): Promise<LookupResult>;
  getHistory(userId: string, cursor?: string, limit?: number): Promise<Paginated<LookupSummary>>;
  getComparables(lookupId: string, filters?: CompFilters): Promise<Comparable[]>;
  getStrategy(lookupId: string, userId: string): Promise<BiddingStrategy>;
}

// services/PredictionService.ts
interface IPredictionService {
  predict(itemFeatures: ItemFeatures): Promise<PricePrediction>;
  getConfidenceInterval(prediction: number, features: ItemFeatures): ConfidenceInterval;
  getTrend(categoryId: string, timeRange: string): Promise<TrendData>;
}

// services/StrategyService.ts
interface IStrategyService {
  generateStrategy(prediction: PricePrediction, platform: Platform, userTier: Tier): BiddingStrategy;
  calculateResellerMetrics(prediction: PricePrediction, platform: Platform): ResellerMetrics;
  getTimingAdvice(platform: Platform, endTime: Date): TimingAdvice;
}

// services/IngestionService.ts
interface IIngestionService {
  ingestEbayCompletedListings(category: string, dateRange: DateRange): Promise<IngestionReport>;
  ingestHeritage(category: string): Promise<IngestionReport>;
  processAndStore(rawListings: RawListing[]): Promise<number>;
  generateEmbeddings(auctionIds: string[]): Promise<void>;
}

// services/SearchService.ts
interface ISearchService {
  search(query: string, filters: SearchFilters): Promise<Paginated<SearchResult>>;
  findSimilar(embedding: number[], topK: number, filters?: CompFilters): Promise<Comparable[]>;
  getTrending(limit: number): Promise<TrendingCategory[]>;
}
```

### 4.4 Job Queue Architecture

```typescript
// jobs/queue.ts — Bull queue definitions
const queues = {
  ingestion: new Bull('ingestion', redisConfig),     // Auction data ingestion
  prediction: new Bull('prediction', redisConfig),   // Async predictions (batch)
  embedding: new Bull('embedding', redisConfig),     // Generate embeddings for new records
  alerts: new Bull('alerts', redisConfig),           // Alert delivery (email, push)
  bulk: new Bull('bulk-analysis', redisConfig),      // Bulk CSV analysis
  portfolio: new Bull('portfolio-update', redisConfig), // Portfolio revaluation
};
```

| Queue | Concurrency | Schedule | Description |
|-------|-------------|----------|-------------|
| `ingestion` | 3 workers | Cron: every 6 hours | Fetch new completed listings from eBay API |
| `prediction` | 5 workers | On-demand | Batch prediction jobs (bulk analysis) |
| `embedding` | 2 workers | After ingestion | Generate vector embeddings for new auction records |
| `alerts` | 5 workers | Cron: every 1 minute | Check watchlist end times, send alerts |
| `bulk` | 2 workers | On-demand | Process dealer CSV uploads |
| `portfolio` | 1 worker | Cron: daily at 2 AM | Revalue all portfolio items with latest market data |

---

## 5. Database Design

### 5.1 PostgreSQL Schema

```sql
-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";        -- pgvector for embeddings

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_tier AS ENUM ('free', 'pro', 'dealer', 'admin');
CREATE TYPE platform_type AS ENUM ('ebay', 'heritage', 'liveauctioneers', 'catawiki');
CREATE TYPE lookup_input_type AS ENUM ('url', 'image');
CREATE TYPE trend_direction AS ENUM ('up', 'stable', 'down');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'trialing');
CREATE TYPE billing_cycle AS ENUM ('monthly', 'annual');
CREATE TYPE alert_type AS ENUM ('ending_soon', 'price_drop', 'new_listing');
CREATE TYPE alert_channel AS ENUM ('email', 'push');
CREATE TYPE watchlist_status AS ENUM ('active', 'ended', 'won', 'lost');
CREATE TYPE bulk_job_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255),                 -- null for OAuth-only users
    name            VARCHAR(255) NOT NULL,
    avatar_url      TEXT,
    tier            user_tier NOT NULL DEFAULT 'free',
    oauth_provider  VARCHAR(50),                  -- 'google', 'apple', null
    oauth_id        VARCHAR(255),
    lookups_used    INTEGER NOT NULL DEFAULT 0,
    lookups_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notification_prefs JSONB NOT NULL DEFAULT '{"email": true, "push": false, "quiet_start": null, "quiet_end": null}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_oauth ON users(oauth_provider, oauth_id);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE subscriptions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id  VARCHAR(255) NOT NULL,
    stripe_sub_id       VARCHAR(255) UNIQUE,
    tier                user_tier NOT NULL,
    status              subscription_status NOT NULL DEFAULT 'active',
    billing_cycle       billing_cycle NOT NULL DEFAULT 'monthly',
    current_period_start TIMESTAMPTZ,
    current_period_end   TIMESTAMPTZ,
    canceled_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_sub_id);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) UNIQUE NOT NULL,
    parent_id   UUID REFERENCES categories(id),
    icon        VARCHAR(50),                      -- emoji or icon name
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- ============================================================
-- AUCTION RECORDS (core data — millions of rows)
-- ============================================================
CREATE TABLE auction_records (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform        platform_type NOT NULL,
    platform_id     VARCHAR(255) NOT NULL,        -- eBay item ID, Heritage lot #, etc.
    title           TEXT NOT NULL,
    description     TEXT,
    category_id     UUID REFERENCES categories(id),
    condition       VARCHAR(100),                 -- 'New', 'Used - Like New', etc.
    grade           VARCHAR(50),                  -- 'CGC 9.4', 'PCGS MS-65', etc.
    images          TEXT[] NOT NULL DEFAULT '{}',  -- array of image URLs
    sale_price      DECIMAL(12,2) NOT NULL,
    currency        VARCHAR(3) NOT NULL DEFAULT 'USD',
    sale_date       TIMESTAMPTZ NOT NULL,
    listing_url     TEXT,
    seller_id       VARCHAR(255),
    bid_count       INTEGER,
    watchers        INTEGER,
    metadata        JSONB NOT NULL DEFAULT '{}',  -- platform-specific extra fields
    embedding       vector(384),                  -- sentence-transformer embedding
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Composite unique constraint to prevent duplicates
CREATE UNIQUE INDEX idx_auction_platform_id ON auction_records(platform, platform_id);

-- Performance indexes for queries
CREATE INDEX idx_auction_category ON auction_records(category_id);
CREATE INDEX idx_auction_sale_date ON auction_records(sale_date DESC);
CREATE INDEX idx_auction_platform ON auction_records(platform);
CREATE INDEX idx_auction_price ON auction_records(sale_price);
CREATE INDEX idx_auction_title_trgm ON auction_records USING gin(title gin_trgm_ops);

-- Vector similarity index (IVFFlat for pgvector)
CREATE INDEX idx_auction_embedding ON auction_records
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Partitioning by sale_date for performance at scale (10M+ records)
-- Implementation: range partition by year/quarter

-- ============================================================
-- LOOKUPS
-- ============================================================
CREATE TABLE lookups (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    input_type      lookup_input_type NOT NULL,
    listing_url     TEXT,
    uploaded_image  TEXT,                          -- S3/GCS URL of uploaded image
    platform        platform_type,
    item_title      TEXT,
    item_description TEXT,
    item_category_id UUID REFERENCES categories(id),
    item_condition   VARCHAR(100),
    item_images     TEXT[] DEFAULT '{}',
    item_metadata   JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lookups_user ON lookups(user_id, created_at DESC);

-- ============================================================
-- PREDICTIONS
-- ============================================================
CREATE TABLE predictions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lookup_id       UUID NOT NULL REFERENCES lookups(id) ON DELETE CASCADE,
    predicted_low   DECIMAL(12,2) NOT NULL,
    predicted_mid   DECIMAL(12,2) NOT NULL,
    predicted_high  DECIMAL(12,2) NOT NULL,
    confidence      DECIMAL(5,4) NOT NULL,        -- e.g., 0.8200 = 82%
    trend_direction trend_direction NOT NULL,
    trend_pct       DECIMAL(6,2),                 -- e.g., 15.50 = +15.5%
    model_version   VARCHAR(50) NOT NULL,
    features_used   JSONB,                        -- snapshot of input features for auditing
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_predictions_lookup ON predictions(lookup_id);

-- ============================================================
-- BIDDING STRATEGIES
-- ============================================================
CREATE TABLE bidding_strategies (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lookup_id           UUID NOT NULL REFERENCES lookups(id) ON DELETE CASCADE,
    max_bid             DECIMAL(12,2) NOT NULL,
    walk_away_price     DECIMAL(12,2) NOT NULL,
    timing_advice       TEXT NOT NULL,
    platform_tactic     TEXT NOT NULL,
    -- Reseller fields (Dealer tier)
    estimated_fees      DECIMAL(10,2),
    estimated_shipping  DECIMAL(10,2),
    estimated_tax       DECIMAL(10,2),
    net_profit          DECIMAL(10,2),
    roi_pct             DECIMAL(6,2),
    break_even_price    DECIMAL(12,2),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_strategies_lookup ON bidding_strategies(lookup_id);

-- ============================================================
-- WATCHLIST
-- ============================================================
CREATE TABLE watchlist_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lookup_id       UUID REFERENCES lookups(id),
    listing_url     TEXT NOT NULL,
    platform        platform_type NOT NULL,
    item_title      TEXT NOT NULL,
    item_thumbnail  TEXT,
    predicted_price DECIMAL(12,2),
    current_bid     DECIMAL(12,2),
    end_time        TIMESTAMPTZ,
    status          watchlist_status NOT NULL DEFAULT 'active',
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_watchlist_user ON watchlist_items(user_id, status);
CREATE INDEX idx_watchlist_end_time ON watchlist_items(end_time) WHERE status = 'active';

-- ============================================================
-- PORTFOLIO
-- ============================================================
CREATE TABLE portfolio_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_name       TEXT NOT NULL,
    category_id     UUID REFERENCES categories(id),
    purchase_price  DECIMAL(12,2),
    purchase_date   DATE,
    current_value   DECIMAL(12,2),
    last_valued_at  TIMESTAMPTZ,
    condition       VARCHAR(100),
    grade           VARCHAR(50),
    images          TEXT[] DEFAULT '{}',
    notes           TEXT,
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_portfolio_user ON portfolio_items(user_id);

-- ============================================================
-- PORTFOLIO VALUE HISTORY (for charts)
-- ============================================================
CREATE TABLE portfolio_value_history (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_value DECIMAL(14,2) NOT NULL,
    item_count  INTEGER NOT NULL,
    recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE(user_id, recorded_at)
);

CREATE INDEX idx_portfolio_history_user ON portfolio_value_history(user_id, recorded_at DESC);

-- ============================================================
-- ALERTS
-- ============================================================
CREATE TABLE alerts (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    watchlist_item_id   UUID REFERENCES watchlist_items(id) ON DELETE SET NULL,
    type                alert_type NOT NULL,
    channel             alert_channel NOT NULL,
    title               TEXT NOT NULL,
    body                TEXT NOT NULL,
    metadata            JSONB NOT NULL DEFAULT '{}',
    sent_at             TIMESTAMPTZ,
    read_at             TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_user ON alerts(user_id, created_at DESC);
CREATE INDEX idx_alerts_unsent ON alerts(sent_at) WHERE sent_at IS NULL;

-- ============================================================
-- BULK JOBS
-- ============================================================
CREATE TABLE bulk_jobs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          bulk_job_status NOT NULL DEFAULT 'pending',
    input_file_url  TEXT NOT NULL,                 -- S3/GCS URL of uploaded CSV
    result_file_url TEXT,                          -- S3/GCS URL of result CSV/PDF
    total_items     INTEGER NOT NULL DEFAULT 0,
    processed_items INTEGER NOT NULL DEFAULT 0,
    error_message   TEXT,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bulk_jobs_user ON bulk_jobs(user_id, created_at DESC);

-- ============================================================
-- REFRESH TOKENS
-- ============================================================
CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(255) NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);

-- ============================================================
-- API KEYS (Dealer tier)
-- ============================================================
CREATE TABLE api_keys (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_hash    VARCHAR(255) NOT NULL,
    name        VARCHAR(255) NOT NULL,             -- user-given name for the key
    last_used_at TIMESTAMPTZ,
    revoked_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_keys_hash ON api_keys(key_hash) WHERE revoked_at IS NULL;

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_watchlist_updated_at
    BEFORE UPDATE ON watchlist_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_portfolio_updated_at
    BEFORE UPDATE ON portfolio_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Reset monthly lookup counts (called by cron job)
CREATE OR REPLACE FUNCTION reset_monthly_lookups()
RETURNS void AS $$
BEGIN
    UPDATE users
    SET lookups_used = 0,
        lookups_reset_at = NOW()
    WHERE tier = 'free'
      AND lookups_reset_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
```

### 5.2 Prisma Schema (ORM Layer)

```prisma
// prisma/schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [uuid_ossp(map: "uuid-ossp"), pgcrypto, vector]
}

model User {
  id               String   @id @default(uuid()) @db.Uuid
  email            String   @unique @db.VarChar(255)
  passwordHash     String?  @map("password_hash") @db.VarChar(255)
  name             String   @db.VarChar(255)
  avatarUrl        String?  @map("avatar_url")
  tier             UserTier @default(free)
  oauthProvider    String?  @map("oauth_provider") @db.VarChar(50)
  oauthId          String?  @map("oauth_id") @db.VarChar(255)
  lookupsUsed      Int      @default(0) @map("lookups_used")
  lookupsResetAt   DateTime @default(now()) @map("lookups_reset_at") @db.Timestamptz
  notificationPrefs Json    @default("{}") @map("notification_prefs")
  createdAt        DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt        DateTime @updatedAt @map("updated_at") @db.Timestamptz

  lookups       Lookup[]
  watchlist     WatchlistItem[]
  portfolio     PortfolioItem[]
  alerts        Alert[]
  subscription  Subscription?
  bulkJobs      BulkJob[]
  apiKeys       ApiKey[]
  refreshTokens RefreshToken[]

  @@map("users")
}

enum UserTier {
  free
  pro
  dealer
  admin

  @@map("user_tier")
}
// ... (remaining models follow the SQL schema above)
```

### 5.3 Elasticsearch Index Mappings

```json
{
  "auction_records": {
    "mappings": {
      "properties": {
        "id":            { "type": "keyword" },
        "platform":      { "type": "keyword" },
        "platform_id":   { "type": "keyword" },
        "title":         { "type": "text", "analyzer": "standard", "fields": { "keyword": { "type": "keyword" } } },
        "description":   { "type": "text", "analyzer": "standard" },
        "category_slug": { "type": "keyword" },
        "category_name": { "type": "text" },
        "condition":     { "type": "keyword" },
        "grade":         { "type": "keyword" },
        "sale_price":    { "type": "float" },
        "currency":      { "type": "keyword" },
        "sale_date":     { "type": "date" },
        "bid_count":     { "type": "integer" },
        "watchers":      { "type": "integer" },
        "images":        { "type": "keyword" },
        "listing_url":   { "type": "keyword" },
        "metadata":      { "type": "object", "enabled": false },
        "embedding":     { "type": "dense_vector", "dims": 384, "index": true, "similarity": "cosine" },
        "suggest":       { "type": "completion" }
      }
    },
    "settings": {
      "number_of_shards": 3,
      "number_of_replicas": 1,
      "analysis": {
        "analyzer": {
          "autocomplete": {
            "type": "custom",
            "tokenizer": "standard",
            "filter": ["lowercase", "edge_ngram_filter"]
          }
        },
        "filter": {
          "edge_ngram_filter": {
            "type": "edge_ngram",
            "min_gram": 2,
            "max_gram": 20
          }
        }
      }
    }
  }
}
```

---

## 6. ML Pipeline & Prediction Engine

### 6.1 Model Architecture

```mermaid
graph TD
    subgraph "Feature Engineering"
        RAW["Raw Item Data"] --> TEXT_FEAT["Text Features<br/>(TF-IDF / embeddings)"]
        RAW --> CAT_FEAT["Categorical Features<br/>(category, platform, condition)"]
        RAW --> NUM_FEAT["Numerical Features<br/>(bid count, watchers, season)"]
        RAW --> TEMPORAL["Temporal Features<br/>(day of week, month, recency)"]
    end

    subgraph "Model Ensemble"
        TEXT_FEAT --> CONCAT["Feature Vector"]
        CAT_FEAT --> CONCAT
        NUM_FEAT --> CONCAT
        TEMPORAL --> CONCAT
        CONCAT --> XGB["XGBoost<br/>Price Regressor"]
        CONCAT --> QR["Quantile Regression<br/>(Confidence Intervals)"]
    end

    subgraph "Post-Processing"
        XGB --> PRED["Point Estimate"]
        QR --> CI["Confidence Interval<br/>(10th / 50th / 90th percentile)"]
        PRED --> TREND["Trend Calculator"]
        CI --> STRATEGY["Strategy Generator"]
        TREND --> OUTPUT["Final Prediction"]
        STRATEGY --> OUTPUT
    end
```

### 6.2 Feature Engineering

| Feature Group | Features | Encoding |
|---------------|----------|----------|
| **Text** | Title, description (TF-IDF + embedding) | 384-dim sentence-transformer vector + top 500 TF-IDF features |
| **Category** | Category hierarchy (level 1, 2, 3) | One-hot encoding |
| **Platform** | Source platform | One-hot encoding |
| **Condition** | Condition label, grade | Ordinal encoding (New=5, Like New=4, ...) |
| **Listing** | Has images, image count, description length | Numerical |
| **Temporal** | Day of week, month, quarter, is_holiday | Cyclical encoding (sin/cos) |
| **Historical** | Avg price in category (30d, 90d, 365d), price volatility | Numerical |
| **Seller** | Seller rating, feedback count, is_power_seller | Numerical + Boolean |

### 6.3 Training Pipeline

```python
# training/train_price_model.py (simplified)

class PriceModelTrainer:
    """
    Training pipeline for the BidSmart price prediction model.
    Runs weekly as a scheduled job.
    """

    def __init__(self, config: TrainingConfig):
        self.config = config
        self.feature_engineer = FeatureEngineer()
        self.model = None

    def train(self):
        # 1. Load data from PostgreSQL
        df = self.load_training_data(
            min_date=datetime.now() - timedelta(days=730),  # 2 years
            min_sales=10  # categories with ≥10 sales
        )

        # 2. Feature engineering
        X, y = self.feature_engineer.transform(df)

        # 3. Train/validation/test split (time-based)
        X_train, X_val, X_test = self.temporal_split(X, y,
            val_cutoff=datetime.now() - timedelta(days=60),
            test_cutoff=datetime.now() - timedelta(days=30)
        )

        # 4. Train XGBoost regressor
        self.model = xgb.XGBRegressor(
            n_estimators=500,
            max_depth=8,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            reg_alpha=0.1,
            reg_lambda=1.0,
            objective='reg:squarederror',
            eval_metric='mape'
        )
        self.model.fit(X_train, y_train,
            eval_set=[(X_val, y_val)],
            early_stopping_rounds=50
        )

        # 5. Train quantile regressors for confidence intervals
        self.q10_model = self.train_quantile(X_train, y_train, quantile=0.10)
        self.q90_model = self.train_quantile(X_train, y_train, quantile=0.90)

        # 6. Evaluate on test set
        metrics = self.evaluate(X_test, y_test)
        # Target: MAPE < 15%, R² > 0.75

        # 7. Save model artifacts
        self.save_model(version=f"v{datetime.now():%Y%m%d}")

        return metrics
```

### 6.4 Prediction API (FastAPI)

```python
# api/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="BidSmart Prediction API", version="1.0")

class PredictionRequest(BaseModel):
    title: str
    description: str | None = None
    category_slug: str
    condition: str | None = None
    grade: str | None = None
    platform: str
    images: list[str] = []
    metadata: dict = {}

class PredictionResponse(BaseModel):
    predicted_low: float       # 10th percentile
    predicted_mid: float       # 50th percentile (median)
    predicted_high: float      # 90th percentile
    confidence: float          # 0.0–1.0
    trend_direction: str       # 'up', 'stable', 'down'
    trend_pct: float           # percentage change over 90 days
    model_version: str
    comparable_ids: list[str]  # IDs of nearest comparable sales

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    features = feature_engineer.transform_single(request)
    prediction = model.predict(features)
    low = q10_model.predict(features)
    high = q90_model.predict(features)
    confidence = calculate_confidence(features, prediction, low, high)
    trend = trend_calculator.get_trend(request.category_slug)
    comparables = similarity_search.find_nearest(features.embedding, k=10)

    return PredictionResponse(
        predicted_low=round(low, 2),
        predicted_mid=round(prediction, 2),
        predicted_high=round(high, 2),
        confidence=round(confidence, 4),
        trend_direction=trend.direction,
        trend_pct=round(trend.pct_change, 2),
        model_version=model.version,
        comparable_ids=[c.id for c in comparables]
    )

class ImageIdentifyRequest(BaseModel):
    image_url: str

class ImageIdentifyResponse(BaseModel):
    identified_item: str
    category_slug: str
    estimated_condition: str | None
    confidence: float
    metadata: dict

@app.post("/identify-image", response_model=ImageIdentifyResponse)
async def identify_image(request: ImageIdentifyRequest):
    """Use Google Cloud Vision + custom classifier to identify item from photo."""
    vision_result = await vision_client.annotate(request.image_url)
    classification = item_classifier.classify(vision_result)
    return ImageIdentifyResponse(**classification)
```

### 6.5 Model Performance Monitoring

| Metric | Threshold | Action if Breached |
|--------|-----------|-------------------|
| MAPE (Mean Absolute % Error) | ≤ 15% | Alert + trigger retraining |
| R² Score | ≥ 0.75 | Alert + investigate data drift |
| Prediction Latency (p95) | ≤ 200ms | Scale inference service |
| Coverage (predictions served / requests) | ≥ 99% | Check model loading / dependencies |

---

## 7. Data Ingestion Pipeline

### 7.1 Pipeline Architecture

```mermaid
graph LR
    subgraph Sources
        EBAY_API["eBay<br/>Browse API"]
        HERITAGE_API["Heritage<br/>Auctions API"]
        LIVE_SCRAPER["LiveAuctioneers<br/>Scraper"]
    end

    subgraph "Ingestion Workers"
        FETCH["Fetcher<br/>(Rate-limited)"]
        NORMALIZE["Normalizer<br/>(Schema mapping)"]
        ENRICH["Enricher<br/>(Category mapping, condition parsing)"]
        EMBED["Embedding Generator<br/>(sentence-transformers)"]
    end

    subgraph "Storage"
        PG[(PostgreSQL<br/>auction_records)]
        ES[(Elasticsearch<br/>auction index)]
        S3["S3<br/>Raw JSON archive"]
    end

    Sources --> FETCH
    FETCH --> S3
    FETCH --> NORMALIZE
    NORMALIZE --> ENRICH
    ENRICH --> PG
    PG --> EMBED
    EMBED --> PG
    ENRICH --> ES
```

### 7.2 eBay Integration

```typescript
// integrations/ebay/EbayClient.ts

class EbayClient {
  private appId: string;
  private certId: string;
  private oauthToken: string;

  /**
   * Fetch completed listings from eBay Browse API.
   * Rate limit: 5,000 calls/day (production keyset).
   */
  async getCompletedItems(params: {
    categoryId: string;
    dateRange: { from: Date; to: Date };
    limit: number;
    offset: number;
  }): Promise<EbaySearchResult> {
    // Uses eBay Browse API: /buy/browse/v1/item_summary/search
    // filter=buyingOptions:{AUCTION},conditions:{...}
    // Completed items via sold=true filter
  }

  /**
   * Fetch a single item's full details.
   */
  async getItemDetails(itemId: string): Promise<EbayItemDetail> {
    // Uses eBay Browse API: /buy/browse/v1/item/{itemId}
  }

  /**
   * Normalize eBay response to BidSmart AuctionRecord format.
   */
  normalizeToRecord(item: EbayItemDetail): Partial<AuctionRecord> {
    return {
      platform: 'ebay',
      platform_id: item.itemId,
      title: item.title,
      description: item.shortDescription,
      condition: this.mapCondition(item.condition),
      images: item.image ? [item.image.imageUrl, ...item.additionalImages?.map(i => i.imageUrl) ?? []] : [],
      sale_price: parseFloat(item.price.value),
      currency: item.price.currency,
      sale_date: new Date(item.itemEndDate),
      listing_url: item.itemWebUrl,
      seller_id: item.seller?.username,
      bid_count: item.bidCount,
      metadata: {
        categoryPath: item.categoryPath,
        topRatedBuyingExperience: item.topRatedBuyingExperience,
        estimatedAvailabilities: item.estimatedAvailabilities,
      },
    };
  }
}
```

### 7.3 Ingestion Schedule

| Platform | Method | Frequency | Records/Run | Rate Limit |
|----------|--------|-----------|-------------|-----------|
| eBay | Browse API | Every 6 hours | ~2,000 | 5,000 calls/day |
| Heritage | REST API | Every 12 hours | ~500 | Negotiated |
| LiveAuctioneers | Web scraping | Daily at 3 AM | ~1,000 | Polite: 1 req/2s |
| Catawiki | REST API (Phase 3) | Every 12 hours | ~500 | TBD |

### 7.4 Deduplication Strategy

```typescript
// Before inserting, check for existing record
const existing = await prisma.auctionRecord.findUnique({
  where: {
    platform_platformId: {
      platform: record.platform,
      platform_id: record.platformId,
    }
  }
});

if (existing) {
  // Update if sale price changed (e.g., auction ended since last fetch)
  if (existing.salePrice !== record.salePrice) {
    await prisma.auctionRecord.update({ ... });
  }
  return; // skip duplicate
}
```

---

## 8. API Specification

### 8.1 Core Lookup Flow — Sequence Diagram

```mermaid
sequenceDiagram
    participant C as Client
    participant API as API Server
    participant REDIS as Redis Cache
    participant EBAY as eBay API
    participant ML as ML Service
    participant PG as PostgreSQL
    participant ES as Elasticsearch

    C->>API: POST /api/v1/lookup/url { url }
    API->>API: Validate URL, check tier limits
    API->>REDIS: Check cache (url hash)
    alt Cache hit
        REDIS-->>API: Cached result
        API-->>C: 200 LookupResult
    else Cache miss
        API->>EBAY: Fetch item details
        EBAY-->>API: Item metadata
        API->>ML: POST /predict { features }
        ML-->>API: PredictionResponse
        API->>ES: kNN search (embedding, k=10)
        ES-->>API: Comparable records
        API->>PG: Store lookup + prediction + strategy
        API->>REDIS: Cache result (TTL: 1 hour)
        API-->>C: 200 LookupResult
    end

    Note over API: Decrement user's lookup count
```

### 8.2 Detailed Endpoint Specifications

#### POST `/api/v1/lookup/url`

**Purpose:** Submit an auction listing URL for price prediction and strategy generation.

**Request:**
```json
{
  "url": "https://www.ebay.com/itm/123456789"
}
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "inputType": "url",
  "listingUrl": "https://www.ebay.com/itm/123456789",
  "platform": "ebay",
  "item": {
    "title": "Omega Seamaster 300M Co-Axial 42mm - Blue Dial - 2024",
    "description": "Excellent condition, includes box and papers...",
    "category": { "id": "...", "name": "Watches", "slug": "watches" },
    "condition": "Used - Excellent",
    "images": [
      "https://i.ebayimg.com/images/g/abc/s-l1600.jpg"
    ],
    "metadata": {
      "currentBid": 750.00,
      "bidCount": 23,
      "endTime": "2026-06-10T18:30:00Z",
      "watchers": 45
    }
  },
  "prediction": {
    "predictedLow": 820.00,
    "predictedMid": 1050.00,
    "predictedHigh": 1240.00,
    "confidence": 0.82,
    "trendDirection": "up",
    "trendPct": 8.5,
    "modelVersion": "v20260601"
  },
  "strategy": {
    "maxBid": 870.00,
    "walkAwayPrice": 1100.00,
    "timingAdvice": "Place your bid in the final 30 seconds. eBay sniping is most effective with a single decisive bid.",
    "platformTactic": "Use a sniping strategy. Do not bid early — it drives up the price. Set your maximum and let the system autobid.",
    "resellerMetrics": null
  },
  "comparables": [
    {
      "id": "...",
      "title": "Omega Seamaster 300M Blue 210.30.42.20.03.001",
      "salePrice": 1025.00,
      "saleDate": "2026-05-20T14:22:00Z",
      "platform": "ebay",
      "condition": "Used - Excellent",
      "thumbnail": "https://...",
      "listingUrl": "https://www.ebay.com/itm/...",
      "similarityScore": 0.94
    }
    // ... 4–9 more
  ],
  "lookupsRemaining": 4,
  "createdAt": "2026-06-05T13:10:00Z"
}
```

**Error Responses:**

| Status | Code | Description |
|--------|------|-------------|
| 400 | `INVALID_URL` | URL format is invalid or unsupported platform |
| 401 | `UNAUTHORIZED` | Missing or invalid JWT |
| 403 | `TIER_LIMIT_EXCEEDED` | Free tier lookup limit reached |
| 404 | `LISTING_NOT_FOUND` | Listing URL returned 404 from platform |
| 422 | `UNSUPPORTED_PLATFORM` | Platform not yet supported |
| 429 | `RATE_LIMITED` | Too many requests |
| 503 | `PREDICTION_UNAVAILABLE` | ML service temporarily unavailable (comps still returned) |

#### POST `/api/v1/lookup/image`

**Request:** `multipart/form-data`
- `image` — File (JPEG, PNG, WebP; max 10MB)

**Response:** Same shape as URL lookup, with `inputType: "image"` and additional `identification` field:

```json
{
  "identification": {
    "identifiedItem": "Omega Seamaster 300M",
    "categorySlug": "watches",
    "estimatedCondition": "Good",
    "identificationConfidence": 0.88
  }
  // ... rest same as URL lookup
}
```

### 8.3 Error Response Format

All error responses follow a consistent shape:

```json
{
  "error": {
    "code": "TIER_LIMIT_EXCEEDED",
    "message": "You have used all 5 free lookups this month. Upgrade to Pro for unlimited lookups.",
    "details": {
      "lookupsUsed": 5,
      "lookupsLimit": 5,
      "resetsAt": "2026-07-01T00:00:00Z",
      "upgradeUrl": "/pricing"
    }
  }
}
```

### 8.4 Rate Limiting

| Tier | General API | Lookup Endpoints | Burst |
|------|-------------|-----------------|-------|
| Free | 10 req/min | 5/month | 3 req/sec |
| Pro | 60 req/min | Unlimited | 10 req/sec |
| Dealer | 200 req/min | Unlimited | 30 req/sec |
| API Key (Dealer) | 200 req/min | Unlimited | 30 req/sec |

Implementation: Redis sliding window counter (`MULTI` + `EXPIRE`).

---

## 9. Authentication & Authorization

### 9.1 Auth Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant API as API Server
    participant PG as PostgreSQL
    participant REDIS as Redis
    participant GOOGLE as Google OAuth

    rect rgb(40, 40, 60)
    Note over C,GOOGLE: Email/Password Registration
    C->>API: POST /auth/register { email, password, name }
    API->>API: Validate input (Zod)
    API->>API: Hash password (bcrypt, cost=12)
    API->>PG: Insert user
    API->>API: Generate JWT (24h) + Refresh Token (30d)
    API->>PG: Store refresh token hash
    API-->>C: { accessToken, refreshToken, user }
    end

    rect rgb(40, 60, 40)
    Note over C,GOOGLE: Google OAuth
    C->>GOOGLE: Redirect to Google consent
    GOOGLE-->>C: Authorization code
    C->>API: POST /auth/oauth/google { code }
    API->>GOOGLE: Exchange code for tokens
    GOOGLE-->>API: { id_token, access_token }
    API->>API: Verify ID token, extract profile
    API->>PG: Upsert user (create if new, link if existing email)
    API->>API: Generate JWT + Refresh Token
    API-->>C: { accessToken, refreshToken, user }
    end

    rect rgb(60, 40, 40)
    Note over C,REDIS: Token Refresh
    C->>API: POST /auth/refresh { refreshToken }
    API->>PG: Verify refresh token hash
    API->>API: Generate new JWT + rotate refresh token
    API->>PG: Revoke old, store new refresh token
    API-->>C: { accessToken, refreshToken }
    end
```

### 9.2 JWT Payload

```typescript
interface JWTPayload {
  sub: string;          // user ID (UUID)
  email: string;
  tier: UserTier;       // 'free' | 'pro' | 'dealer' | 'admin'
  iat: number;          // issued at
  exp: number;          // expires at (24h from iat)
}
```

### 9.3 RBAC Middleware

```typescript
// middleware/tierGuard.ts
function requireTier(...allowedTiers: UserTier[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: { code: 'UNAUTHORIZED' } });
    if (!allowedTiers.includes(req.user.tier)) {
      return res.status(403).json({
        error: {
          code: 'INSUFFICIENT_TIER',
          message: `This feature requires ${allowedTiers.join(' or ')} plan.`,
          details: { currentTier: req.user.tier, requiredTier: allowedTiers }
        }
      });
    }
    next();
  };
}

// Usage in routes
router.post('/lookup/image', authenticate, requireTier('pro', 'dealer', 'admin'), lookupController.createFromImage);
router.get('/watchlist', authenticate, requireTier('pro', 'dealer', 'admin'), watchlistController.list);
router.get('/portfolio', authenticate, requireTier('dealer', 'admin'), portfolioController.list);
```

---

## 10. Search & Similarity Engine

### 10.1 Dual Search Strategy

| Use Case | Engine | Method |
|----------|--------|--------|
| **Full-text search** (user keyword queries) | Elasticsearch | BM25 + boosting on title |
| **Comparable sales** (similarity matching) | PostgreSQL pgvector + Elasticsearch kNN | Hybrid: vector cosine similarity + attribute filtering |
| **Autocomplete** | Elasticsearch | Completion suggester |
| **Trending categories** | PostgreSQL | Aggregation query on recent auction_records |

### 10.2 Comparable Sales Algorithm

```python
def find_comparables(item: ItemFeatures, top_k: int = 10) -> list[Comparable]:
    """
    Hybrid search combining vector similarity with structured filters.
    """
    # Step 1: Generate embedding for input item
    embedding = sentence_model.encode(f"{item.title} {item.condition} {item.category}")

    # Step 2: Candidate retrieval via pgvector (fast approximate)
    candidates = db.execute("""
        SELECT id, title, sale_price, sale_date, condition, platform,
               1 - (embedding <=> %(embedding)s) AS similarity
        FROM auction_records
        WHERE category_id = %(category_id)s
          AND sale_date > NOW() - INTERVAL '365 days'
          AND embedding IS NOT NULL
        ORDER BY embedding <=> %(embedding)s
        LIMIT 50
    """, {"embedding": embedding, "category_id": item.category_id})

    # Step 3: Re-rank with attribute matching boost
    scored = []
    for c in candidates:
        score = c.similarity * 0.6  # base: vector similarity
        if c.condition == item.condition:
            score += 0.15            # condition match boost
        if c.platform == item.platform:
            score += 0.10            # same platform boost
        recency_days = (datetime.now() - c.sale_date).days
        score += max(0, 0.15 * (1 - recency_days / 365))  # recency boost
        scored.append((c, score))

    # Step 4: Sort by final score, return top K
    scored.sort(key=lambda x: x[1], reverse=True)
    return [c for c, _ in scored[:top_k]]
```

### 10.3 Elasticsearch Query (Full-Text Search)

```json
{
  "query": {
    "bool": {
      "must": {
        "multi_match": {
          "query": "omega seamaster blue dial",
          "fields": ["title^3", "description"],
          "type": "best_fields",
          "fuzziness": "AUTO"
        }
      },
      "filter": [
        { "term": { "category_slug": "watches" } },
        { "range": { "sale_date": { "gte": "now-1y" } } },
        { "range": { "sale_price": { "gte": 500, "lte": 2000 } } }
      ]
    }
  },
  "sort": [
    { "_score": "desc" },
    { "sale_date": "desc" }
  ],
  "size": 20,
  "from": 0,
  "aggs": {
    "avg_price": { "avg": { "field": "sale_price" } },
    "price_histogram": {
      "histogram": { "field": "sale_price", "interval": 100 }
    },
    "by_condition": {
      "terms": { "field": "condition" }
    }
  }
}
```

---

## 11. Notification System

### 11.1 Alert Pipeline

```mermaid
graph LR
    subgraph Triggers
        CRON["Cron Job<br/>(every 1 min)"]
        INGESTION["New Listing<br/>Ingested"]
    end

    subgraph Processing
        CHECK["Alert Checker<br/>(Bull Worker)"]
        MATCH["Matching Engine"]
        TEMPLATE["Template Renderer"]
    end

    subgraph Delivery
        EMAIL["Email<br/>(Resend API)"]
        PUSH["Push Notification<br/>(FCM — Phase 2)"]
    end

    CRON --> CHECK
    INGESTION --> MATCH
    CHECK --> |"Watchlist ending<br/>within 1 hour"| TEMPLATE
    MATCH --> |"New listing below<br/>predicted value"| TEMPLATE
    TEMPLATE --> EMAIL
    TEMPLATE --> PUSH
```

### 11.2 Alert Types

| Type | Trigger | Data | Channel |
|------|---------|------|---------|
| `ending_soon` | Watchlist item end_time within 1 hour | Item title, current bid, predicted price, time remaining | Email, Push |
| `price_drop` | Current bid on watched item drops below threshold | Item title, old bid, new bid, predicted final price | Email |
| `new_listing` | New ingested listing matches user's saved search / category preferences and is below predicted value | Item title, listing URL, predicted value, current price | Email, Push |

### 11.3 Email Templates

Built with [React Email](https://react.email/) for maintainable HTML email templates:

```
apps/api/src/emails/
├── templates/
│   ├── WelcomeEmail.tsx
│   ├── EndingSoonAlert.tsx
│   ├── NewListingAlert.tsx
│   ├── PriceDropAlert.tsx
│   ├── SubscriptionConfirmation.tsx
│   ├── PasswordReset.tsx
│   └── BulkJobComplete.tsx
└── send.ts  # Resend API wrapper
```

---

## 12. Payment & Subscription System

### 12.1 Stripe Integration Architecture

```mermaid
sequenceDiagram
    participant C as Client
    participant API as API Server
    participant STRIPE as Stripe
    participant PG as PostgreSQL

    rect rgb(40, 40, 60)
    Note over C,PG: Checkout Flow
    C->>API: POST /subscription/checkout { tier: "pro", cycle: "monthly" }
    API->>STRIPE: Create Checkout Session
    STRIPE-->>API: { session_id, url }
    API-->>C: { checkoutUrl }
    C->>STRIPE: Redirect to Stripe Checkout
    Note over STRIPE: User enters payment info
    STRIPE-->>C: Redirect to success URL
    end

    rect rgb(40, 60, 40)
    Note over C,PG: Webhook Processing
    STRIPE->>API: POST /webhooks/stripe (checkout.session.completed)
    API->>API: Verify webhook signature
    API->>PG: Create/update subscription record
    API->>PG: Update user tier to 'pro'
    API-->>STRIPE: 200 OK
    end
```

### 12.2 Stripe Products & Prices

| Product | Price ID Pattern | Amount | Interval |
|---------|-----------------|--------|----------|
| BidSmart Pro (Monthly) | `price_pro_monthly` | $19.00 | Monthly |
| BidSmart Pro (Annual) | `price_pro_annual` | $190.00 | Yearly (~$15.83/mo) |
| BidSmart Dealer (Monthly) | `price_dealer_monthly` | $49.00 | Monthly |
| BidSmart Dealer (Annual) | `price_dealer_annual` | $490.00 | Yearly (~$40.83/mo) |

### 12.3 Webhook Events Handled

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create subscription, upgrade user tier |
| `invoice.paid` | Extend subscription period |
| `invoice.payment_failed` | Mark subscription as `past_due`, send email |
| `customer.subscription.updated` | Sync tier changes (upgrade/downgrade) |
| `customer.subscription.deleted` | Downgrade user to free tier |

---

## 13. Caching Strategy

### 13.1 Cache Layers

```mermaid
graph TD
    CLIENT["Browser Cache<br/>(static assets: 1 year)"]
    CDN["Vercel CDN<br/>(ISR pages: 60s)"]
    API_CACHE["Redis L1<br/>(API response cache)"]
    DB_CACHE["Redis L2<br/>(query result cache)"]
    DB[(PostgreSQL)]

    CLIENT --> CDN
    CDN --> API_CACHE
    API_CACHE --> DB_CACHE
    DB_CACHE --> DB
```

### 13.2 Cache Policies

| Key Pattern | TTL | Invalidation | Description |
|-------------|-----|-------------|-------------|
| `lookup:{url_hash}` | 1 hour | On new prediction | Full lookup result for a URL |
| `comps:{item_hash}:{filters_hash}` | 30 min | On new ingestion | Comparable sales results |
| `user:{id}:profile` | 15 min | On profile update | User profile + tier info |
| `user:{id}:lookups_remaining` | 5 min | On new lookup | Remaining lookup count |
| `categories:all` | 24 hours | On category update | Category tree |
| `trending:all` | 1 hour | Cron refresh | Trending categories |
| `rate:{user_id}:{window}` | Window duration | Auto-expire | Rate limiting counters |
| `session:{token}` | 24 hours | On logout/refresh | Session data |

### 13.3 Cache-Aside Pattern

```typescript
async function getCachedOrFetch<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const result = await fetcher();
  await redis.setex(key, ttlSeconds, JSON.stringify(result));
  return result;
}
```

---

## 14. Infrastructure & Deployment

### 14.1 Environment Architecture

```mermaid
graph TB
    subgraph Production
        VERCEL_PROD["Vercel<br/>(Next.js frontend)"]
        RAILWAY_API["Railway<br/>(Express API)"]
        RAILWAY_ML["Railway<br/>(FastAPI ML)"]
        RAILWAY_WORKER["Railway<br/>(Bull Workers)"]
        SUPABASE_PG["Supabase<br/>(PostgreSQL 16)"]
        UPSTASH_REDIS["Upstash<br/>(Redis)"]
        ELASTIC_CLOUD["Elastic Cloud<br/>(Elasticsearch 8)"]
        S3_PROD["AWS S3<br/>(Images & Files)"]
    end

    subgraph Staging
        VERCEL_STG["Vercel Preview"]
        RAILWAY_STG["Railway Staging"]
        SUPABASE_STG["Supabase Staging"]
    end

    subgraph Development
        DOCKER["Docker Compose<br/>(All services local)"]
    end
```

### 14.2 Docker Compose (Local Development)

```yaml
# infrastructure/docker/docker-compose.yml
version: '3.9'

services:
  postgres:
    image: pgvector/pgvector:pg16
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: bidsmart
      POSTGRES_PASSWORD: bidsmart_dev
      POSTGRES_DB: bidsmart_dev
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  elasticsearch:
    image: elasticsearch:8.13.0
    ports: ["9200:9200"]
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
    volumes:
      - esdata:/usr/share/elasticsearch/data

  mailhog:
    image: mailhog/mailhog
    ports:
      - "1025:1025"   # SMTP
      - "8025:8025"   # Web UI

volumes:
  pgdata:
  esdata:
```

### 14.3 Environment Variables

```bash
# .env.example

# === Database ===
DATABASE_URL=postgresql://bidsmart:bidsmart_dev@localhost:5432/bidsmart_dev
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_URL=http://localhost:9200

# === Auth ===
JWT_SECRET=your-jwt-secret-256bit
JWT_EXPIRY=24h
REFRESH_TOKEN_EXPIRY=30d
BCRYPT_ROUNDS=12

# === OAuth ===
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/callback/google

# === eBay API ===
EBAY_APP_ID=
EBAY_CERT_ID=
EBAY_DEV_ID=
EBAY_OAUTH_TOKEN=
EBAY_ENVIRONMENT=sandbox  # sandbox | production

# === Stripe ===
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...
STRIPE_DEALER_MONTHLY_PRICE_ID=price_...
STRIPE_DEALER_ANNUAL_PRICE_ID=price_...

# === Google Cloud ===
GOOGLE_CLOUD_PROJECT_ID=
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json

# === Email ===
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@bidsmart.app

# === Storage ===
S3_BUCKET=bidsmart-uploads
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# === ML Service ===
ML_SERVICE_URL=http://localhost:8000
ML_MODEL_VERSION=v20260601

# === Monitoring ===
SENTRY_DSN=
MIXPANEL_TOKEN=

# === App ===
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:4000
```

### 14.4 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo lint typecheck

  test-api:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: pgvector/pgvector:pg16
        env: { POSTGRES_PASSWORD: test }
        ports: ['5432:5432']
      redis:
        image: redis:7-alpine
        ports: ['6379:6379']
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo test --filter=api
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/test
          REDIS_URL: redis://localhost:6379

  test-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo test --filter=web

  test-ml:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install -r apps/ml/requirements.txt
      - run: pytest apps/ml/tests/

  build:
    needs: [lint-and-typecheck, test-api, test-web, test-ml]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo build
```

---

## 15. Monitoring & Observability

### 15.1 Monitoring Stack

| Tool | Purpose | Data |
|------|---------|------|
| **Sentry** | Error tracking, performance monitoring | Exceptions, slow transactions, source maps |
| **Mixpanel** | Product analytics | User events, funnels, retention |
| **Uptime Robot** | Uptime monitoring | Endpoint health checks (every 5 min) |
| **Grafana + Prometheus** (Phase 2) | Infrastructure metrics | CPU, memory, request rates, queue depth |
| **Custom Dashboard** (Admin) | Model performance | Prediction accuracy, drift detection |

### 15.2 Structured Logging

```typescript
// utils/logger.ts
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: ['req.headers.authorization', 'password', 'passwordHash'],
});

// Log structure
// {
//   "level": "info",
//   "time": "2026-06-05T13:10:00.000Z",
//   "requestId": "abc-123",
//   "userId": "user-456",
//   "method": "POST",
//   "path": "/api/v1/lookup/url",
//   "statusCode": 200,
//   "responseTime": 2340,
//   "msg": "Lookup completed"
// }
```

### 15.3 Key Alerts

| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| API Error Rate Spike | > 5% 5xx responses in 5 min | Critical | Page on-call |
| Prediction Latency | p95 > 5 seconds | Warning | Scale ML service |
| Queue Backlog | > 1,000 pending jobs | Warning | Scale workers |
| Disk Usage | > 80% on any volume | Warning | Investigate / expand |
| SSL Certificate Expiry | < 14 days | Warning | Auto-renew check |
| Model Accuracy Drift | MAPE > 20% on recent predictions | Critical | Trigger retraining |

---

## 16. Security Implementation

### 16.1 Security Checklist

| # | Measure | Implementation |
|---|---------|---------------|
| 1 | **Input Validation** | Zod schemas on all request bodies and query params |
| 2 | **SQL Injection** | Prisma ORM (parameterized queries), no raw SQL with user input |
| 3 | **XSS** | React auto-escaping, CSP headers via Helmet |
| 4 | **CSRF** | SameSite cookies + CSRF token for state-changing requests |
| 5 | **Rate Limiting** | Redis sliding window on all endpoints |
| 6 | **Password Security** | bcrypt (cost=12), minimum 8 characters, breach check |
| 7 | **Secrets Management** | Environment variables, never in code; .env in .gitignore |
| 8 | **HTTPS** | Enforced via Vercel/Railway; HSTS header |
| 9 | **CORS** | Whitelist: frontend domain only |
| 10 | **Dependency Scanning** | `pnpm audit` in CI, Dependabot PRs |
| 11 | **Content Security Policy** | Strict CSP via next.config.js headers |
| 12 | **File Upload Validation** | MIME type check, file size limit (10MB), virus scan (ClamAV in Phase 2) |

### 16.2 Stripe Webhook Verification

```typescript
// middleware/stripeWebhook.ts
function verifyStripeWebhook(req: Request, res: Response, next: NextFunction) {
  const sig = req.headers['stripe-signature'];
  const rawBody = req.rawBody; // raw buffer, not parsed JSON

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    req.stripeEvent = event;
    next();
  } catch (err) {
    logger.warn({ err }, 'Invalid Stripe webhook signature');
    res.status(400).json({ error: 'Invalid signature' });
  }
}
```

---

## 17. Testing Strategy

### 17.1 Test Pyramid

```
            ┌──────────┐
            │   E2E    │  ← 10 critical paths (Playwright)
           ┌┴──────────┴┐
           │ Integration │  ← API + DB + Cache (Vitest + Supertest)
          ┌┴────────────┴┐
          │    Unit       │  ← Services, utils, components (Vitest)
         ┌┴──────────────┴┐
         │   Static       │  ← TypeScript + ESLint
         └────────────────┘
```

### 17.2 Test Configuration

| Layer | Tool | Location | Coverage Target |
|-------|------|----------|----------------|
| **Unit (Backend)** | Vitest | `apps/api/tests/unit/` | ≥ 80% |
| **Unit (Frontend)** | Vitest + React Testing Library | `apps/web/tests/` | ≥ 70% |
| **Integration** | Vitest + Supertest | `apps/api/tests/integration/` | All API endpoints |
| **ML Unit** | pytest | `apps/ml/tests/` | ≥ 75% |
| **E2E** | Playwright | `tests/e2e/` | 10 critical user flows |

### 17.3 Critical E2E Test Scenarios

| # | Scenario | Steps |
|---|----------|-------|
| 1 | **Registration → First Lookup** | Register → paste eBay URL → see prediction + comps |
| 2 | **Login → Lookup → Save to Watchlist** | Login → lookup → add to watchlist → verify in list |
| 3 | **Free Tier Limit Enforcement** | Do 5 lookups → verify 6th is rejected → see upgrade prompt |
| 4 | **Pro Upgrade Flow** | Click upgrade → Stripe checkout (test mode) → verify Pro access |
| 5 | **Photo Upload Lookup** | Upload image → see identification → see prediction |
| 6 | **Search & Filter** | Search keyword → apply filters → view result details |
| 7 | **Portfolio Add & Track** | Add item to portfolio → set purchase price → see valuation |
| 8 | **Bulk CSV Upload** | Upload CSV → wait for processing → download results |
| 9 | **Settings Update** | Change name, notification prefs → verify persisted |
| 10 | **Subscription Cancel** | Cancel Pro → verify access until period end → downgrade to free |

---

## 18. Error Handling & Resilience

### 18.1 Error Hierarchy

```typescript
// utils/errors.ts
class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
  }
}

class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(401, 'UNAUTHORIZED', message);
  }
}

class ForbiddenError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(403, 'FORBIDDEN', message, details);
  }
}

class TierLimitError extends AppError {
  constructor(used: number, limit: number, resetsAt: Date) {
    super(403, 'TIER_LIMIT_EXCEEDED',
      `You have used all ${limit} free lookups this month.`,
      { lookupsUsed: used, lookupsLimit: limit, resetsAt, upgradeUrl: '/pricing' }
    );
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(404, 'NOT_FOUND', `${resource} not found`, { resource, id });
  }
}

class ExternalServiceError extends AppError {
  constructor(service: string, originalError?: Error) {
    super(503, 'SERVICE_UNAVAILABLE',
      `${service} is temporarily unavailable`,
      { service, originalError: originalError?.message }
    );
  }
}
```

### 18.2 Resilience Patterns

| Pattern | Implementation | Where |
|---------|---------------|-------|
| **Circuit Breaker** | `opossum` library | ML service, eBay API, Stripe calls |
| **Retry with Backoff** | Exponential backoff (3 retries, 1s/2s/4s) | External API calls |
| **Timeout** | 10s for external calls, 30s for ML predictions | HTTP client config |
| **Graceful Degradation** | If ML is down, return comps without prediction | Lookup endpoint |
| **Bulkhead** | Separate thread pools for critical vs. non-critical | Job queue workers |
| **Idempotency** | Idempotency keys on POST endpoints | Stripe checkout, watchlist add |

### 18.3 Graceful Degradation Matrix

| Component Down | Impact | Degraded Behavior |
|----------------|--------|-------------------|
| ML Service | No price predictions | Return comparables + "Prediction temporarily unavailable" |
| Elasticsearch | No search / reduced comp quality | Fallback to PostgreSQL full-text search |
| Redis | No caching, slower responses | Bypass cache, direct DB queries (auto-reconnect) |
| eBay API | Cannot fetch new listings | Serve from cached/stored data, show staleness notice |
| Stripe | Cannot process payments | Show "Billing temporarily unavailable", don't block existing access |

---

## 19. Performance Budgets

### 19.1 Frontend Performance

| Metric | Budget | Tool |
|--------|--------|------|
| First Contentful Paint (FCP) | ≤ 1.2s | Lighthouse |
| Largest Contentful Paint (LCP) | ≤ 2.0s | Lighthouse |
| Cumulative Layout Shift (CLS) | ≤ 0.1 | Lighthouse |
| Total Blocking Time (TBT) | ≤ 200ms | Lighthouse |
| JavaScript Bundle (initial) | ≤ 150 KB gzipped | Webpack analyzer |
| CSS Bundle (initial) | ≤ 30 KB gzipped | Build output |
| Lighthouse Performance Score | ≥ 90 | CI check |

### 19.2 Backend Performance

| Metric | Budget | Measurement |
|--------|--------|-------------|
| API Response (non-prediction, p95) | ≤ 500ms | Sentry Performance |
| Lookup Response (link, p95) | ≤ 5,000ms | Sentry Performance |
| Lookup Response (image, p95) | ≤ 10,000ms | Sentry Performance |
| ML Inference (p95) | ≤ 200ms | FastAPI metrics |
| Database Query (p95) | ≤ 50ms | Prisma query logging |
| Elasticsearch Query (p95) | ≤ 100ms | ES slow log |

---

## 20. Migration & Data Seeding

### 20.1 Migration Strategy

```bash
# Run migrations
pnpm --filter api prisma migrate deploy

# Generate client after schema changes
pnpm --filter api prisma generate

# Create a new migration
pnpm --filter api prisma migrate dev --name add_new_field
```

### 20.2 Seed Data

```typescript
// infrastructure/scripts/seed.ts

async function seed() {
  // 1. Create categories
  const categories = await seedCategories([
    { name: 'Watches', slug: 'watches', icon: '⌚' },
    { name: 'Trading Cards', slug: 'trading-cards', icon: '🃏' },
    { name: 'Comics', slug: 'comics', icon: '📚' },
    { name: 'Coins', slug: 'coins', icon: '🪙' },
    { name: 'Art', slug: 'art', icon: '🎨' },
    { name: 'Vintage Electronics', slug: 'vintage-electronics', icon: '📻' },
    { name: 'Jewelry', slug: 'jewelry', icon: '💎' },
    { name: 'Antiques', slug: 'antiques', icon: '🏺' },
    { name: 'Memorabilia', slug: 'memorabilia', icon: '🏆' },
    { name: 'Furniture', slug: 'furniture', icon: '🪑' },
  ]);

  // 2. Create test users (dev/staging only)
  if (process.env.NODE_ENV !== 'production') {
    await seedTestUsers();  // free, pro, dealer, admin accounts
  }

  // 3. Ingest initial auction data (eBay sandbox in dev)
  await seedAuctionRecords(1000);

  // 4. Generate embeddings for seeded records
  await generateEmbeddings();

  // 5. Index in Elasticsearch
  await indexInElasticsearch();
}
```

### 20.3 Data Volume Projections

| Timeline | Auction Records | Users | Lookups/Day | Database Size |
|----------|----------------|-------|-------------|---------------|
| MVP Launch | 50,000 | 100 | 50 | ~500 MB |
| Month 3 | 500,000 | 1,000 | 300 | ~5 GB |
| Month 6 | 2,000,000 | 5,000 | 1,000 | ~20 GB |
| Year 1 | 10,000,000 | 20,000 | 3,000 | ~100 GB |

Partitioning `auction_records` by `sale_date` (quarterly) recommended when exceeding 5M rows.

---

*This technical specification provides the engineering blueprint for building BidSmart. It should be updated as implementation decisions are refined and new requirements emerge.*
