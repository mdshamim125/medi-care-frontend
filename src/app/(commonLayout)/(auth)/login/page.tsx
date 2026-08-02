import LoginForm from "@/components/login-form";
import { ShieldCheck, Sparkles } from "lucide-react";

const LoginPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) => {
  const params = (await searchParams) || {};

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_40%),linear-gradient(135deg,#f8fffe,#f4f8fb)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/90 shadow-[0_25px_80px_-25px_rgba(15,23,42,0.35)] backdrop-blur lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between bg-linear-to-br from-teal-700 via-teal-600 to-cyan-600 p-8 text-white sm:p-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Secure access
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Welcome back to MediCare
              </h1>
              <p className="max-w-lg text-sm text-teal-50/90 sm:text-base">
                Sign in to continue managing appointments, health updates, and
                your care journey with confidence.
              </p>
            </div>
            <div className="space-y-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Fast and secure sign-in experience
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-6 space-y-2 text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
              Account access
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Sign in to your account
            </h2>
            <p className="text-sm text-slate-600">
              Enter your credentials to continue.
            </p>
          </div>
          <LoginForm redirect={params.redirect} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
