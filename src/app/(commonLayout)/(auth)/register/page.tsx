import RegisterForm from "@/components/register-form";
import { ShieldCheck, Sparkles, Stethoscope } from "lucide-react";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_40%),linear-gradient(135deg,#f8fffe,#f4f8fb)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 overflow-hidden rounded-4xl border border-slate-200/70 bg-white/80 p-4 shadow-[0_25px_80px_-25px_rgba(15,23,42,0.35)] backdrop-blur lg:grid-cols-[1.05fr_0.95fr] lg:p-6">
        <div className="flex flex-col justify-between rounded-3xl bg-linear-to-br from-teal-700 via-teal-600 to-cyan-600 p-8 text-white sm:p-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
              <Stethoscope className="h-4 w-4" />
              Join MediCare
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Create a secure account for your care journey
              </h1>
              <p className="max-w-lg text-sm text-teal-50/90 sm:text-base">
                Book appointments, review health updates, and stay connected
                with your care team from one trusted place.
              </p>
            </div>
            <div className="space-y-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="h-4 w-4" />
                Trusted patient privacy
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Simple onboarding and secure access
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 sm:p-8">
          <div className="mb-6 space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
              Start your profile
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Create your account
            </h2>
            <p className="text-sm text-slate-600">
              Enter your details below to get started with MediCare.
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
