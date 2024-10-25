import React from 'react';

export const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center h-[500px] bg-slate-800 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p>Loading chart data...</p>
    </div>
  </div>
);