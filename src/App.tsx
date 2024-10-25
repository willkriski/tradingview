import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Sidebar } from './components/Sidebar';
import { StockChart } from './components/StockChart';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { StockData, Stock } from './types';
import { WATCHLIST } from './constants';
import './index.css';

const App: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [watchlist, setWatchlist] = useState<Stock[]>(WATCHLIST);
  const [allStocks, setAllStocks] = useState<Stock[]>([]);

  useEffect(() => {
    const fetchAllStocks = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5001/api/stocks');
        if (Array.isArray(response.data) && response.data.length > 0) {
          setAllStocks(response.data);
          console.log('Fetched', response.data.length, 'stocks');
        } else {
          setError('Received empty or invalid data from API');
        }
      } catch (err) {
        setError('Failed to fetch stock list. Please try again later.');
        console.error('Failed to fetch stock list:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllStocks();
  }, []);

  const fetchStockData = useCallback(async (symbol: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5001/stock/${symbol}`);
      const data = response.data as any[];

      const formattedData = data.map((entry: any) => ({
        time: new Date(entry.Date).toISOString().split('T')[0],
        open: entry.Open,
        high: entry.High,
        low: entry.Low,
        close: entry.Close,
      }));

      setStockData(formattedData);
    } catch (err) {
      setError('Failed to fetch stock data. Please try again later.');
      console.error(err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchStockData(selectedStock);
  }, [selectedStock, fetchStockData]);

  const handleAddStock = (newStock: Stock) => {
    if (!watchlist.some(stock => stock.symbol === newStock.symbol)) {
      setWatchlist(prevWatchlist => [...prevWatchlist, newStock]);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar
        watchlist={watchlist}
        selectedStock={selectedStock}
        onSelectStock={setSelectedStock}
        onAddStock={handleAddStock}
        allStocks={allStocks}
      />

      <div className="flex-1 p-6 overflow-hidden">
        {isLoading && <LoadingState />}
        {error && <ErrorState message={error} />}
        {!isLoading && !error && (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">
                {watchlist.find(stock => stock.symbol === selectedStock)?.name}
              </h1>
              <p className="text-gray-400">
                {selectedStock} • 1 Year Chart
              </p>
            </div>
            <StockChart data={stockData} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
