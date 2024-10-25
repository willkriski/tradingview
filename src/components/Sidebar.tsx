import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Stock } from '../types';

interface SidebarProps {
  watchlist: Stock[];
  selectedStock: string;
  onSelectStock: (symbol: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ watchlist, selectedStock, onSelectStock }) => {
  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Watchlist
        </h2>
      </div>
      <div className="overflow-y-auto flex-1">
        {watchlist.map(({ symbol, name }) => (
          <button
            key={symbol}
            onClick={() => onSelectStock(symbol)}
            className={`w-full text-left p-4 hover:bg-slate-700 transition-colors duration-200 ${
              selectedStock === symbol ? 'bg-slate-700' : ''
            }`}
          >
            <div className="font-semibold">{symbol}</div>
            <div className="text-sm text-gray-400">{name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};