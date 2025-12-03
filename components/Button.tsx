import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-brand-dark text-white hover:bg-opacity-90 focus:ring-brand-dark shadow-md",
    secondary: "bg-brand-light text-brand-dark hover:bg-opacity-80 focus:ring-brand-light shadow-sm",
    outline: "border-2 border-brand-dark text-brand-dark hover:bg-brand-bg focus:ring-brand-dark",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-brand-dark",
    danger: "bg-red-100 text-red-600 hover:bg-red-200",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${width} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};