import ChangePasswordForm from "@/components/modules/ChangePassword/ChangePasswordForm";
import { KeyRound, ShieldCheck } from "lucide-react";

const ChangePasswordPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Account security
        </p>
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Change password
            </h1>
            <p className="mt-1 text-sm leading-6 text-muted-foreground sm:text-base">
              Keep your Medi-Care account protected with a strong, unique
              password.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <ChangePasswordForm />

        <aside className="h-fit rounded-2xl border border-teal-100 bg-teal-50/70 p-5 dark:border-teal-900 dark:bg-teal-950/30">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100 dark:bg-teal-950 dark:text-teal-300 dark:ring-teal-900">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-semibold text-teal-950 dark:text-teal-100">
            Password security
          </h2>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-teal-900/75 dark:text-teal-200/80">
            <li>Use at least 6 characters.</li>
            <li>Avoid reusing passwords from other accounts.</li>
            <li>Never share your password with anyone.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
