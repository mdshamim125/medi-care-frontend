/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { loginUser } from "@/services/auth/loginUser";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

const LoginForm = ({ redirect }: { redirect?: string }) => {
  const [state, formAction, isPending] = useActionState(loginUser, null);

  const getFieldError = (fieldName: string) => {
    if (state && state.errors) {
      const error = state.errors.find((err: any) => err.field === fieldName);
      return error.message;
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="space-y-8 rounded-4xl border border-slate-200/75 bg-white/95 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.18)] sm:p-8"
    >
      {redirect && <input type="hidden" name="redirect" value={redirect} />}

      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
          Secure sign in
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
        <p className="text-sm text-slate-500">
          Sign in to manage appointments, prescriptions, and your care team in
          one place.
        </p>
      </div>

      <FieldGroup className="grid gap-4">
        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 shadow-sm transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
          {getFieldError("email") && (
            <FieldDescription className="text-sm text-red-600">
              {getFieldError("email")}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 shadow-sm transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
          {getFieldError("password") && (
            <FieldDescription className="text-sm text-red-600">
              {getFieldError("password")}
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <div className="space-y-4 pt-3">
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 w-full rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 focus-visible:ring-2 focus-visible:ring-teal-500/50"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </Button>

        <div className="grid gap-2 text-center text-sm text-slate-600">
          <p>
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-medium text-teal-700 hover:underline"
            >
              Create one
            </a>
          </p>
          <a
            href="/forget-password"
            className="font-medium text-slate-700 hover:text-teal-700 hover:underline"
          >
            Forgot password?
          </a>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
