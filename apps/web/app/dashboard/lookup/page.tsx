'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Search, Link2, ArrowRight, TrendingUp, TrendingDown, Minus, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Mock prediction result for UI demonstration
const MOCK_RESULT = {
  item: {
    title: 'Rolex Submariner Date 116610LN — Black Dial, Ceramic Bezel',
    platform: 'eBay',
    condition: 'Pre-Owned',
    imageUrl: '',
    url: 'https://www.ebay.com/itm/123456789',
  },
  prediction: {
    low: 8200,
    mid: 9450,
    high: 11100,
    confidence: 94,
    trend: 'up' as const,
    trendPercentage: 4.2,
  },
  strategy: {
    maxBid: 9800,
    walkAway: 11100,
    timing: 'Place your bid in the final 5 seconds (sniping strategy). Avoid early bidding to prevent driving up the price.',
    recommendation: 'BUY — Strong value at current price point. Market trending upward.',
  },
  comparables: [
    { title: 'Rolex Submariner 116610LN 2019', price: 9200, date: '2026-05-28', platform: 'eBay' },
    { title: 'Rolex Sub Date Black Ceramic 2020', price: 9650, date: '2026-06-01', platform: "Christie's" },
    { title: 'Submariner 116610 Black Dial Box Papers', price: 8950, date: '2026-05-15', platform: 'eBay' },
    { title: 'Rolex 116610LN Submariner Complete Set', price: 10200, date: '2026-06-05', platform: "Sotheby's" },
  ],
};

export default function LookupPage() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<typeof MOCK_RESULT | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast.error('Please paste an auction URL');
      return;
    }
    setIsAnalyzing(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 2500));
    setResult(MOCK_RESULT);
    setIsAnalyzing(false);
    toast.success('Analysis complete!');
  };

  const formatCurrency = (n: number) => `$${n.toLocaleString()}`;
  const TrendIcon = result?.prediction.trend === 'up' ? TrendingUp : result?.prediction.trend === 'down' ? TrendingDown : Minus;

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-medium text-ivory mb-2">
            Auction Lookup
          </h1>
          <p className="text-ivory/60">
            Paste an auction URL to get AI-powered price predictions, bidding strategy, and comparable sales.
          </p>
        </div>

        {/* URL Input */}
        <div className="bg-onyx-mid border border-white/10 rounded-sm p-6 sm:p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-mid/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Link2 size={20} className="text-emerald-bright" />
              <h2 className="text-lg font-medium">Paste auction URL</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" size={20} />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.ebay.com/itm/..."
                  className="w-full bg-onyx-light/50 border border-white/10 rounded-sm py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-mid focus:ring-1 focus:ring-emerald-mid transition-colors text-ivory placeholder:text-ivory/30"
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-emerald-mid text-ivory px-6 py-3 rounded-sm font-medium hover:bg-emerald-bright transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-ivory/40 mt-3">
              Supported: eBay, Christie&apos;s, Sotheby&apos;s, Heritage Auctions, Phillips
            </p>
          </div>
        </div>

        {/* Analysis Result */}
        {result && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Item Info */}
            <div className="bg-onyx-mid border border-white/10 rounded-sm p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-mid/20 text-emerald-bright font-medium">
                      {result.item.platform}
                    </span>
                    <span className="text-xs text-ivory/40">{result.item.condition}</span>
                  </div>
                  <h3 className="text-xl font-display font-medium text-ivory mb-1 truncate">
                    {result.item.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <TrendIcon size={18} className={result.prediction.trend === 'up' ? 'text-emerald-bright' : result.prediction.trend === 'down' ? 'text-burgundy-bright' : 'text-ivory/60'} />
                  <span className={`text-sm font-medium ${result.prediction.trend === 'up' ? 'text-emerald-bright' : result.prediction.trend === 'down' ? 'text-burgundy-bright' : 'text-ivory/60'}`}>
                    {result.prediction.trend === 'up' ? '+' : result.prediction.trend === 'down' ? '-' : ''}{result.prediction.trendPercentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Price Prediction + Confidence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-onyx-mid border border-white/10 rounded-sm p-6 text-center">
                <p className="text-xs uppercase tracking-wider text-ivory/40 mb-2">Conservative</p>
                <p className="text-2xl font-display font-medium text-ivory/80">{formatCurrency(result.prediction.low)}</p>
              </div>
              <div className="bg-emerald-deep/30 border border-emerald-mid/30 rounded-sm p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-mid/10 to-transparent" />
                <div className="relative">
                  <p className="text-xs uppercase tracking-wider text-emerald-bright/80 mb-2">Predicted Price</p>
                  <p className="text-3xl font-display font-bold text-emerald-bright">{formatCurrency(result.prediction.mid)}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Sparkles size={14} className="text-emerald-bright/60" />
                    <span className="text-sm text-emerald-bright/80">{result.prediction.confidence}% confidence</span>
                  </div>
                </div>
              </div>
              <div className="bg-onyx-mid border border-white/10 rounded-sm p-6 text-center">
                <p className="text-xs uppercase tracking-wider text-ivory/40 mb-2">Aggressive</p>
                <p className="text-2xl font-display font-medium text-ivory/80">{formatCurrency(result.prediction.high)}</p>
              </div>
            </div>

            {/* Bidding Strategy */}
            <div className="bg-onyx-mid border border-white/10 rounded-sm p-6">
              <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-bright" />
                Bidding Strategy
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-onyx-light/30 rounded-sm p-4">
                  <p className="text-xs uppercase tracking-wider text-ivory/40 mb-1">Max Bid</p>
                  <p className="text-xl font-display font-medium text-emerald-bright">{formatCurrency(result.strategy.maxBid)}</p>
                </div>
                <div className="bg-onyx-light/30 rounded-sm p-4">
                  <p className="text-xs uppercase tracking-wider text-ivory/40 mb-1 flex items-center gap-1">
                    <AlertTriangle size={12} /> Walk Away Above
                  </p>
                  <p className="text-xl font-display font-medium text-burgundy-bright">{formatCurrency(result.strategy.walkAway)}</p>
                </div>
              </div>
              <div className="bg-emerald-deep/20 border border-emerald-mid/20 rounded-sm p-4 mb-3">
                <p className="text-sm text-emerald-bright font-medium">{result.strategy.recommendation}</p>
              </div>
              <div className="bg-onyx-light/30 rounded-sm p-4">
                <p className="text-xs uppercase tracking-wider text-ivory/40 mb-2 flex items-center gap-1">
                  <Clock size={12} /> Timing Advice
                </p>
                <p className="text-sm text-ivory/80">{result.strategy.timing}</p>
              </div>
            </div>

            {/* Comparable Sales */}
            <div className="bg-onyx-mid border border-white/10 rounded-sm p-6">
              <h3 className="font-medium text-lg mb-4">Comparable Sales</h3>
              <div className="space-y-3">
                {result.comparables.map((comp, i) => (
                  <div key={i} className="flex items-center justify-between bg-onyx-light/20 rounded-sm p-4 hover:bg-onyx-light/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ivory truncate">{comp.title}</p>
                      <p className="text-xs text-ivory/40 mt-0.5">{comp.platform} · {new Date(comp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <p className="text-sm font-medium text-ivory ml-4">{formatCurrency(comp.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
