import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Search } from 'lucide-react';
import { Stock } from '../types';
import Fuse from 'fuse.js';

interface SidebarProps {
  watchlist: Stock[];
  selectedStock: string;
  onSelectStock: (symbol: string) => void;
  onAddStock: (stock: Stock) => void;
  allStocks: Stock[];
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  watchlist, 
  selectedStock, 
  onSelectStock, 
  onAddStock,
  allStocks
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);

  const fuse = useMemo(() => new Fuse(allStocks, {
    keys: ['symbol', 'name'],
    threshold: 0.3,
  }), [allStocks]);

  useEffect(() => {
    if (searchTerm) {
      const results = fuse.search(searchTerm).slice(0, 10).map(result => result.item);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, fuse]);

  const handleSelectStock = (stock: Stock) => {
    onAddStock(stock);
    onSelectStock(stock.symbol);
    setSearchTerm('');
  };

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" />
          Watchlist
        </h2>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stocks..."
            className="w-full bg-slate-700 text-white px-3 py-2 rounded-md focus:outline-none"
          />
          <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          {searchTerm && (
            <div className="absolute z-10 w-full mt-1 bg-slate-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {searchResults.length > 0 ? (
                searchResults.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => handleSelectStock(stock)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-600 transition-colors duration-200"
                  >
                    <div className="font-semibold">{stock.symbol}</div>
                    <div className="text-sm text-gray-400">{stock.name}</div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-400">No results found</div>
              )}
            </div>
          )}
        </div>
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
