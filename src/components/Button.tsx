import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'outline';
}

export function Button({ 
  children, 
  loading, 
  variant = 'primary', 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyles = "w-full py-3 font-bold rounded-xl flex items-center justify-center space-x-2 transition-all duration-150 transform disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#2A4D22] hover:bg-[#1f3a19] text-white shadow-md hover:shadow-lg active:scale-[0.98]",
    outline: "border border-slate-200 hover:bg-slate-50 text-slate-700"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {children}
    </button>
  );
}