// ── Prediction & Lookup Types ─────────────────────────────────────────────────

export enum Platform {
  EBAY = 'ebay',
  HERITAGE = 'heritage',
  LIVEAUCTIONEERS = 'liveauctioneers',
}

export enum ItemCondition {
  POOR = 'poor',
  FAIR = 'fair',
  GOOD = 'good',
  VERY_GOOD = 'very_good',
  EXCELLENT = 'excellent',
  NEAR_MINT = 'near_mint',
  MINT = 'mint',
}

export enum PriceTrend {
  UP = 'up',
  STABLE = 'stable',
  DOWN = 'down',
}

export enum LookupType {
  URL = 'url',
  IMAGE = 'image',
  MANUAL = 'manual',
}

export interface LookupUrlRequest {
  url: string;
}

export interface ItemMetadata {
  title: string;
  platform: Platform;
  platformItemId: string;
  condition?: ItemCondition;
  imageUrls: string[];
  currentBid?: number;
  buyItNow?: number;
  endTime?: string;
  seller?: string;
  description?: string;
  category?: string;
}

export interface PredictionResult {
  priceLow: number;
  priceMid: number;
  priceHigh: number;
  confidence: number;        // 0–1
  trend: PriceTrend;
  trendPercent: number;      // e.g. 12.5 for +12.5%
  currency: string;          // 'USD'
  modelVersion: string;
  sampleSize: number;        // comparable sales used
  predictionId: string;
}

export interface BiddingStrategy {
  maxBid: number;
  walkAwayPrice: number;
  timingAdvice: string;
  platformTactics: string;
  rationale: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface LookupResult {
  id: string;
  type: LookupType;
  url?: string;
  item: ItemMetadata;
  prediction: PredictionResult;
  strategy?: BiddingStrategy; // Pro+ only
  createdAt: string;
}

export interface ComparableSale {
  id: string;
  title: string;
  platform: Platform;
  salePrice: number;
  currency: string;
  condition?: ItemCondition;
  soldAt: string;
  imageUrl?: string;
  listingUrl?: string;
  similarityScore: number; // 0–1
}
