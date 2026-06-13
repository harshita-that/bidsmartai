'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Clock, TrendingUp, TrendingDown, Minus, ExternalLink, Search, Filter, ChevronDown } from 'lucide-react';

// Mock history data for UI demonstration
const MOCK_HISTORY = [
  {
    id: '1',
    title: 'Rolex Submariner Date 116610LN — Black Dial, Ceramic Bezel',
    platform: 'eBay',
    predictedPrice: 9450,
    confidence: 94,
    trend: 'up' as const,
    trendPercentage: 4.2,
    url: 'https://www.ebay.com/itm/123456789',
    createdAt: '2026-06-13T10:30:00Z',
    status: 'active' as const,
  },
  {
    id: '2',
    title: 'Patek Philippe Nautilus 5711/1A-010 — Blue Dial',
    platform: "Christie's",
    predictedPrice: 34200,
    confidence: 88,
    trend: 'down' as const,
    trendPercentage: 2.1,
    url: 'https://www.christies.com/lot/123',
    createdAt: '2026-06-12T15:45:00Z',
    status: 'ended' as const,
  },
  {
    id: '3',
    title: 'Omega Speedmaster Professional Moonwatch 310.30.42.50.01.002',
    platform: 'eBay',
    predictedPrice: 5800,
    confidence: 91,
    trend: 'up' as const,
    trendPercentage: 1.8,
    url: 'https://www.ebay.com/itm/987654321',
    createdAt: '2026-06-11T09:15:00Z',
    status: 'active' as const,
  },
  {
    id: '4',
    title: '1952 Topps Mickey Mantle #311 PSA 7 — Baseball Card',
    platform: 'Heritage Auctions',
    predictedPrice: 128500,
    confidence: 82,
    trend: 'stable' as const,
    trendPercentage: 0.3,
    url: 'https://www.ha.com/itm/123',
    createdAt: '2026-06-10T14:20:00Z',
    status: 'ended' as const,
  },
  {
    id: '5',
    title: 'Audemars Piguet Royal Oak 15500ST — Grey Dial',
    platform: "Sotheby's",
    predictedPrice: 28900,
    confidence: 89,
    trend: 'up' as const,
    trendPercentage: 5.7,
    url: 'https://www.sothebys.com/lot/456',
    createdAt: '2026-06-09T11:00:00Z',
    status: 'active' as const,
  },
  {
    id: '6',
    title: 'Charizard Base Set 1st Edition Holo PSA 9',
    platform: 'eBay',
    predictedPrice: 42000,
    confidence: 86,
    trend: 'down' as const,
    trendPercentage: 3.4,
    url: 'https://www.ebay.com/itm/111222333',
    createdAt: '2026-06-08T16:30:00Z',
    status: 'ended' as const,
  },
];

type FilterType = 'all' | 'active' | 'ended';

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filteredHistory = MOCK_HISTORY.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (n: number) => `$${n.toLocaleString()}`;
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);

    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const color = trend === 'up' ? 'text-emerald-bright' : trend === 'down' ? 'text-burgundy-bright' : 'text-ivory/60';
    return <Icon size={16} className={color} />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-medium text-ivory mb-2">
              Lookup History
            </h1>
            <p className="text-ivory/60">
              {MOCK_HISTORY.length} total lookups · {MOCK_HISTORY.filter(i => i.status === 'active').length} active auctions
            </p>
          </div>
          <Link
            href="/dashboard/lookup"
            className="bg-emerald-mid text-ivory px-5 py-2.5 rounded-sm font-medium hover:bg-emerald-bright transition-colors whitespace-nowrap text-sm inline-flex items-center gap-2 w-fit"
          >
            <Search size={16} /> New Lookup
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name or platform..."
              className="w-full bg-onyx-mid border border-white/10 rounded-sm py-2.5 pl-10 pr-4 focus:outline-none focus:border-emerald-mid transition-colors text-ivory text-sm placeholder:text-ivory/30"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 bg-onyx-mid border border-white/10 rounded-sm px-4 py-2.5 text-sm text-ivory/80 hover:text-ivory hover:border-white/20 transition-colors"
            >
              <Filter size={16} />
              {filter === 'all' ? 'All' : filter === 'active' ? 'Active' : 'Ended'}
              <ChevronDown size={14} />
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 top-full mt-1 bg-onyx-mid border border-white/10 rounded-sm shadow-xl z-50 overflow-hidden min-w-[120px]">
                {(['all', 'active', 'ended'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => { setFilter(f); setShowFilterMenu(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors capitalize ${filter === f ? 'text-emerald-bright bg-emerald-mid/10' : 'text-ivory/80'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div className="bg-onyx-mid border border-white/10 rounded-sm p-12 text-center">
            <Clock size={40} className="text-ivory/20 mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2 text-ivory/60">No lookups found</h3>
            <p className="text-sm text-ivory/40 mb-6">
              {searchQuery ? 'Try a different search term.' : 'Start by analyzing an auction listing.'}
            </p>
            <Link
              href="/dashboard/lookup"
              className="bg-emerald-mid text-ivory px-5 py-2.5 rounded-sm font-medium hover:bg-emerald-bright transition-colors text-sm inline-flex items-center gap-2"
            >
              <Search size={16} /> New Lookup
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="bg-onyx-mid border border-white/10 rounded-sm p-5 hover:border-white/20 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-mid/20 text-emerald-bright font-medium">
                        {item.platform}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.status === 'active'
                          ? 'bg-emerald-bright/10 text-emerald-bright'
                          : 'bg-white/5 text-ivory/40'
                      }`}>
                        {item.status === 'active' ? '● Live' : 'Ended'}
                      </span>
                      <span className="text-xs text-ivory/30 flex items-center gap-1">
                        <Clock size={12} /> {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-ivory group-hover:text-emerald-bright transition-colors truncate">
                      {item.title}
                    </h3>
                  </div>

                  {/* Right: Price + Trend */}
                  <div className="text-right shrink-0">
                    <p className="text-lg font-display font-medium text-ivory">{formatCurrency(item.predictedPrice)}</p>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <TrendIcon trend={item.trend} />
                      <span className={`text-xs font-medium ${
                        item.trend === 'up' ? 'text-emerald-bright' : item.trend === 'down' ? 'text-burgundy-bright' : 'text-ivory/60'
                      }`}>
                        {item.trend === 'up' ? '+' : item.trend === 'down' ? '-' : ''}{item.trendPercentage}%
                      </span>
                      <span className="text-xs text-ivory/30 ml-1">{item.confidence}% conf.</span>
                    </div>
                  </div>
                </div>

                {/* Action row */}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                  <Link
                    href={`/dashboard/lookup?id=${item.id}`}
                    className="text-xs text-emerald-bright hover:text-emerald-bright/80 font-medium transition-colors"
                  >
                    View Analysis →
                  </Link>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-ivory/40 hover:text-ivory/60 font-medium transition-colors flex items-center gap-1"
                  >
                    <ExternalLink size={12} /> Original Listing
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Lookups', value: MOCK_HISTORY.length.toString() },
            { label: 'Avg Confidence', value: `${Math.round(MOCK_HISTORY.reduce((a, i) => a + i.confidence, 0) / MOCK_HISTORY.length)}%` },
            { label: 'Active Auctions', value: MOCK_HISTORY.filter(i => i.status === 'active').length.toString() },
            { label: 'Total Value Tracked', value: formatCurrency(MOCK_HISTORY.reduce((a, i) => a + i.predictedPrice, 0)) },
          ].map((stat) => (
            <div key={stat.label} className="bg-onyx-mid border border-white/10 rounded-sm p-4 text-center">
              <p className="text-xs text-ivory/40 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-lg font-display font-medium text-ivory">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
