import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className={`w-full mb-4 ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-brand-dark focus:border-brand-dark block p-3 shadow-sm placeholder-gray-400 transition-colors ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
    </div>
  );
};