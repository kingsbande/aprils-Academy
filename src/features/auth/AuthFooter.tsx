import { ShieldCheck, Users, GraduationCap } from 'lucide-react';

export function AuthFooter() {
  return (
    <div className="w-full max-w-4xl z-10 mt-8 md:mt-4 text-center md:text-left">
      <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 text-white/80 gap-4 text-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex items-center space-x-2">
            <ShieldCheck size={16} className="text-[#4ade80]" />
            <span>Secure Access</span>
          </div>
          <div className="hidden sm:block text-white/20">|</div>
          <div className="flex items-center space-x-2">
            <Users size={16} className="text-[#4ade80]" />
            <span>Trusted by Educators</span>
          </div>
          <div className="hidden sm:block text-white/20">|</div>
          <div className="flex items-center space-x-2">
            <GraduationCap size={16} className="text-[#4ade80]" />
            <span>Empowering Education</span>
          </div>
        </div>
        <p className="text-xs text-white/60">
          &copy; {new Date().getFullYear()} April's Academy. All rights reserved.
        </p>
      </div>
    </div>
  );
}