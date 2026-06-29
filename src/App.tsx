import { LoginCard } from './features/auth/LoginCard';
import { AuthFooter } from './features/auth/AuthFooter';

export default function App() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center overflow-x-hidden p-4 sm:p-6 md:p-8 bg-slate-900">

      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 filter blur-[2px]"
        style={{ backgroundImage: `url('/assets/images/aprils-backgoround.png')` }}
      />

      <div className="hidden md:block h-4" />

      <LoginCard />

      <AuthFooter />
    </div>
  );
}
