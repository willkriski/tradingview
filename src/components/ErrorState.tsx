import React from 'react';

interface ErrorStateProps {
  message: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message }) => (
  <div className="flex items-center justify-center h-[500px] bg-slate-800 rounded-lg">
    <p className="text-red-500">{message}</p>
  </div>
);