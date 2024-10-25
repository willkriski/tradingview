import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sidebar } from './components/Sidebar';
import { StockChart } from './components/StockChart';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { StockData } from './types';
import { WATCHLIST } from './constants';
import './index.css';

const App: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState('NVDA');
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:5001/stock/${selectedStock}`);
        const data = response.data as any[]; // Type assertion to any[]

        // Assuming response.data is an array of objects
        const formattedData = data.map((entry: any) => ({
          time: new Date(entry.Date).toISOString().split('T')[0], // Convert to yyyy-mm-dd
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
    };

    fetchStockData();
  }, [selectedStock]);

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar
        watchlist={WATCHLIST}
        selectedStock={selectedStock}
        onSelectStock={setSelectedStock}
      />

      <div className="flex-1 p-6 overflow-hidden">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {WATCHLIST.find(stock => stock.symbol === selectedStock)?.name}
          </h1>
          <p className="text-gray-400">
            {selectedStock} • 1 Year Chart
          </p>
        </div>

        {isLoading && <LoadingState />}
        {error && <ErrorState message={error} />}
        {!isLoading && !error && <StockChart data={stockData} />}
      </div>
    </div>
  );
};

export default App;
