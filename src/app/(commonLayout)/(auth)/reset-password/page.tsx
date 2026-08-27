import ResetPasswordForm from "@/components/ResetPasswordForm";
import { KeyRound, ShieldCheck } from "lucide-react";

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) => {
  const params = (await searchParams) || {};
  const redirect = params.redirect;
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f5f0] px-4 py-10 sm:px-6">
      <div className="absolute left-0 top-0 h-56 w-56 rounded-br-[120px] bg-teal-100/60" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-tl-[150px] bg-sky-100/60" />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5">
        <div className="bg-teal-700 px-6 py-7 text-white sm:px-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
            <KeyRound className="h-5 w-5" />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight">
            Set your new password
          </h1>
          <p className="mt-2 text-sm leading-6 text-teal-50/80">
            Create a secure password to protect your MediCare account.
          </p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex items-start gap-3 rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
            <p className="text-xs leading-5 text-teal-900/75">
              Use at least 6 characters and make sure both entries match.
            </p>
          </div>
          <ResetPasswordForm redirect={redirect} />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
