import { GraduationCap } from 'lucide-react';

export function AuthFooter() {
  return (
    <div className="w-full max-w-4xl z-10 mt-10 md:mt-6 px-2">
      <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 text-white/80 gap-y-3 md:gap-y-0 md:gap-x-4 text-sm">
        <div className="flex items-center justify-center md:justify-start gap-2 text-center md:text-left">
          <GraduationCap size={16} className="text-[#4ade80] shrink-0" />
          <span className="font-medium tracking-wide">Empowering Education</span>
        </div>

        <p className="text-xs text-white/60 tracking-wider font-normal whitespace-nowrap">
          &copy; {new Date().getFullYear()} April's Academy. All rights reserved.
        </p>
      </div>
    </div>
  );
}