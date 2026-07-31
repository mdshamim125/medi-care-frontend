/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { loginUser } from "@/services/auth/loginUser";
import { ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(loginUser, null);

  const getFieldError = (fieldName: string) => {
    if (state && state.errors) {
      const error = state.errors.find((err: any) => err.field === fieldName);
      return error?.message ?? null;
    }

    return null;
  };

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Sign in
        </h2>
        <p className="text-sm text-slate-600">
          Use your email and password to continue securely.
        </p>
      </div>

      <FieldGroup>
        <div className="grid grid-cols-1 gap-4">
          <Field>
            <FieldLabel
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Email address
            </FieldLabel>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
              />
            </div>
            {getFieldError("email") && (
              <FieldDescription className="text-sm text-red-600">
                {getFieldError("email")}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </FieldLabel>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
              />
            </div>
            {getFieldError("password") && (
              <FieldDescription className="text-sm text-red-600">
                {getFieldError("password")}
              </FieldDescription>
            )}
          </Field>
        </div>

        <FieldGroup>
          <Field>
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700"
            >
              {isPending ? (
                "Signing in..."
              ) : (
                <span className="inline-flex items-center gap-2">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            <div className="flex flex-col gap-2 text-center text-sm text-slate-600 sm:flex-row sm:justify-between sm:text-left">
              <Link
                href="/register"
                className="font-medium text-teal-700 hover:text-teal-800 hover:underline"
              >
                Create an account
              </Link>
              <Link
                href="/forget-password"
                className="font-medium hover:text-slate-900 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;
