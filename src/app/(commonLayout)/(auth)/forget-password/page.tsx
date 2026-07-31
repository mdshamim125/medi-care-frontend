const ForgetPasswordPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_40%),linear-gradient(135deg,_#f8fffe,_#f4f8fb)] px-4 py-8">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-[0_25px_80px_-25px_rgba(15,23,42,0.35)]">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
            Password reset
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Reset your password
          </h1>
          <p className="text-sm text-slate-600">
            This experience will be completed soon. Please use the sign-in page
            for now.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
