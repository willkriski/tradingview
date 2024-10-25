import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import { StockData } from '../types';

interface StockChartProps {
  data: StockData[];
}

export const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (chartContainerRef.current && data.length > 0) {
      chartContainerRef.current.innerHTML = '';
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 500,
        layout: {
          background: { type: ColorType.Solid, color: 'white' },
          textColor: 'black',
        },
        grid: {
          vertLines: { color: '#334155' },
          horzLines: { color: '#334155' },
        },
        rightPriceScale: {
          borderColor: '#334155',
        },
        timeScale: {
          borderColor: '#334155',
          timeVisible: true,
          secondsVisible: false,
          rightOffset: 30,
        },
      });
      const candlestickSeries = chartRef.current.addCandlestickSeries({
        upColor: 'white',
        downColor: 'black',
        borderVisible: true,
        borderColor: 'black',
        wickUpColor: 'black',
        wickDownColor: 'black',
      });
/*
      const candlestickSeries = chartRef.current.addCandlestickSeries({
        upColor: '#22C55E',
        downColor: '#EF4444',
        borderVisible: false,
        wickUpColor: '#22C55E',
        wickDownColor: '#EF4444',
      });
*/
      candlestickSeries.setData(data);

      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.applyOptions({ 
            width: chartContainerRef.current.clientWidth 
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
        }
      };
    }
  }, [data]);

  return (
    <div ref={chartContainerRef} className="bg-slate-800 p-4 rounded-lg shadow-lg w-full h-[500px]" />
  );
};
