/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { registerPatient } from "@/services/auth/registerPatient";
import { ArrowRight, Lock, Mail, MapPin, UserRound } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerPatient, null);

  const getFieldError = (fieldName: string) => {
    if (state && state.errors) {
      const error = state.errors.find((err: any) => err.field === fieldName);
      return error?.message ?? null;
    }

    return null;
  };

  return (
    <form action={formAction} className="space-y-5">
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel
              htmlFor="name"
              className="text-sm font-medium text-slate-700"
            >
              Full name
            </FieldLabel>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
              />
            </div>
            {getFieldError("name") && (
              <FieldDescription className="text-sm text-red-600">
                {getFieldError("name")}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel
              htmlFor="address"
              className="text-sm font-medium text-slate-700"
            >
              Address
            </FieldLabel>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="123 Main St"
                className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
              />
            </div>
            {getFieldError("address") && (
              <FieldDescription className="text-sm text-red-600">
                {getFieldError("address")}
              </FieldDescription>
            )}
          </Field>

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
                placeholder="Create a strong password"
                className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
              />
            </div>
            {getFieldError("password") && (
              <FieldDescription className="text-sm text-red-600">
                {getFieldError("password")}
              </FieldDescription>
            )}
          </Field>

          <Field className="md:col-span-2">
            <FieldLabel
              htmlFor="confirmPassword"
              className="text-sm font-medium text-slate-700"
            >
              Confirm password
            </FieldLabel>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
              />
            </div>
            {getFieldError("confirmPassword") && (
              <FieldDescription className="text-sm text-red-600">
                {getFieldError("confirmPassword")}
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
                "Creating account..."
              ) : (
                <span className="inline-flex items-center gap-2">
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            <FieldDescription className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-teal-700 hover:text-teal-800 hover:underline"
              >
                Sign in
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;
