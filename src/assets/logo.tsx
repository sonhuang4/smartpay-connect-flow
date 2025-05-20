
import React from 'react';

export const SmartPayLogo = ({ className = "" }: { className?: string }) => (
  <div className={`font-bold flex items-center justify-center ${className}`}>
    <span className="text-4xl mr-2 animate-pulse">💸</span>
    <span className="text-3xl bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent font-semibold tracking-tight">SmartPay</span>
  </div>
);

export default SmartPayLogo;
