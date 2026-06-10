import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Search } from 'lucide-react';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-medium text-ivory mb-2">
            Welcome to BidSmart
          </h1>
          <p className="text-ivory/60">
            You have 5 lookups remaining on your Free tier.
          </p>
        </div>

        {/* Quick Lookup Action */}
        <div className="bg-onyx-mid border border-white/10 rounded-sm p-6 sm:p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-mid/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-xl font-medium mb-4">Start a new lookup</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" size={20} />
                <input 
                  type="url" 
                  placeholder="Paste auction URL (e.g. Christie's, Sotheby's)..." 
                  className="w-full bg-onyx-light/50 border border-white/10 rounded-sm py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-mid transition-colors text-ivory placeholder:text-ivory/30"
                />
              </div>
              <button className="bg-emerald-mid text-ivory px-6 py-3 rounded-sm font-medium hover:bg-emerald-bright transition-colors whitespace-nowrap">
                Analyze Lot
              </button>
            </div>
            <p className="text-xs text-ivory/40 mt-3">
              Supported houses: Christie's, Sotheby's, Phillips
            </p>
          </div>
        </div>

        {/* Placeholder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-onyx-mid border border-white/10 rounded-sm p-6">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <span className="text-emerald-bright">📈</span>
            </div>
            <h3 className="font-medium text-lg mb-2">Market Insights</h3>
            <p className="text-sm text-ivory/60">
              No recent activity. Start analyzing lots to see market trends and insights here.
            </p>
          </div>
          
          <div className="bg-onyx-mid border border-white/10 rounded-sm p-6">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <span className="text-emerald-bright">⌚</span>
            </div>
            <h3 className="font-medium text-lg mb-2">Recent Lookups</h3>
            <p className="text-sm text-ivory/60">
              Your recent auction analyses will appear here.
            </p>
          </div>

          <div className="bg-onyx-mid border border-white/10 rounded-sm p-6">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <span className="text-emerald-bright">🏆</span>
            </div>
            <h3 className="font-medium text-lg mb-2">Win Rate</h3>
            <p className="text-sm text-ivory/60">
              Track the success rate of bids placed using BidSmart predictions.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
