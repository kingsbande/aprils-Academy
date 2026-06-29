import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';

export function LoginCard() {
  return (
    <div className="w-full max-w-md my-auto bg-white backdrop-blur-md rounded-[29px] shadow-2xl border border-slate-100 p-6 sm:p-10 z-10 transition-all duration-300">
      <LoginHeader />
      <LoginForm />

      <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-600 font-medium">
        Don't have an account?{' '}
        <a
          href="#contact"
          className="font-bold text-[#2A4D22] hover:text-[#1f3a19] transition-colors duration-150"
        >
          Contact administrator
        </a>
      </div>
    </div>
  );
}
