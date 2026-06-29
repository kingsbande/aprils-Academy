export function LoginHeader() {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="w-24 h-24 mb-4 rounded-full border-4 border-white bg-white shadow-md overflow-hidden relative flex items-center justify-center">
        <img
          src="/assets/images/aprils.png"
          alt="April's Academy logo"
          className="w-full h-full object-contain"
        />
      </div>
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2A4D22] text-center uppercase">
        Welcome
      </h1>
      <p className="text-sm text-slate-600 mt-1 text-center font-medium">
        Sign in to your account to continue
      </p>
    </div>
  );
}
