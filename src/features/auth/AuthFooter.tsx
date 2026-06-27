import { ShieldCheck, Users, GraduationCap } from 'lucide-react';

export function AuthFooter() {
  return (
    <div className="w-full max-w-4xl z-10 mt-10 md:mt-6 px-2">
      <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 text-white/80 gap-y-5 md:gap-y-0 md:gap-x-4 text-sm">
        
        {/* Badges Container - Clean vertical stacking on small screens, row on desktop */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto justify-center md:justify-start">
          <div className="flex items-center space-x-2">
            <ShieldCheck size={16} className="text-[#4ade80]" />
            <span className="font-medium tracking-wide">Secure Access</span>
          </div>
          <div className="hidden sm:block text-white/20">|</div>
          
          <div className="flex items-center space-x-2">
            <Users size={16} className="text-[#4ade80]" />
            <span className="font-medium tracking-wide">Trusted by Educators</span>
          </div>
          <div className="hidden sm:block text-white/20">|</div>
          
          <div className="flex items-center space-x-2">
            <GraduationCap size={16} className="text-[#4ade80]" />
            <span className="font-medium tracking-wide">Empowering Education</span>
          </div>
        </div>
        
        {/* Copyright notice - Well spaced below or to the side */}
        <p className="text-xs text-white/60 tracking-wider font-normal mt-2 md:mt-0 whitespace-nowrap">
          &copy; {new Date().getFullYear()} April's Academy. All rights reserved.
        </p>

      </div>
    </div>
  );
}