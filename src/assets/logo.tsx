
import React from 'react';

export const SmartPayLogo = ({ className = "" }: { className?: string }) => (
  <div className={`font-bold flex items-center ${className}`}>
    <span className="text-2xl mr-1">💸</span>
    <span className="text-primary">SmartPay</span>
  </div>
);

export default SmartPayLogo;
