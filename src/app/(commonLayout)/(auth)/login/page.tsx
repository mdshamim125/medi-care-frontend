import LoginForm from "@/components/login-form";
import { ShieldCheck, Sparkles, Stethoscope } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_40%),linear-gradient(135deg,#f8fffe,#f4f8fb)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-4xl border border-slate-200/70 bg-white/80 shadow-[0_25px_80px_-25px_rgba(15,23,42,0.35)] backdrop-blur md:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-linear-to-br from-teal-700 via-teal-600 to-cyan-600 p-8 text-white sm:p-10 lg:p-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
              <Stethoscope className="h-4 w-4" />
              MediCare Portal
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Welcome back to your care portal
              </h1>
              <p className="max-w-lg text-sm text-teal-50/90 sm:text-base">
                Access appointments, medication updates, and secure healthcare
                information in one polished experience.
              </p>
            </div>
            <div className="space-y-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="h-4 w-4" />
                Protected and private
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Fast, simple access to your care journey
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
