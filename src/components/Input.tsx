import React, { forwardRef } from 'react';
import { type LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  rightElement?: React.ReactNode;
}

// We pass the types directly into forwardRef<ElementType, PropsType>
export const Input = forwardRef<HTMLInputElement, InputProps>((
  { label, icon: Icon, rightElement, className = '', ...props }, 
  ref
) => {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
        {label}
      </label>
      <div className="relative group">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2A4D22] transition-colors duration-200">
          <Icon size={18} />
        </span>
        <input 
          ref={ref}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none text-slate-900 font-medium placeholder-slate-400 bg-white/90 transition-all duration-200 focus:border-[#2A4D22] focus:ring-2 focus:ring-[#2A4D22]/20 disabled:opacity-60 ${
            rightElement ? 'pr-10' : ''
          } ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';