/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { registerPatient } from "@/services/auth/registerPatient";
import { useActionState, useEffect } from "react";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { toast } from "sonner";

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerPatient, null);

  const getFieldError = (fieldName: string) => {
    if (state && state.errors) {
      const error = state.errors.find((err: any) => err.field === fieldName);
      if (error) {
        return error.message;
      } else {
        return null;
      }
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
      className="space-y-8 rounded-4xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.18)] sm:p-8"
    >
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
          New patient registration
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Create your MediCare account
        </h2>
        <p className="text-sm text-slate-500">
          Register to book appointments, access your medical records, and
          connect with providers securely.
        </p>
      </div>

      <FieldGroup className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 shadow-sm transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
          {getFieldError("name") && (
            <FieldDescription className="text-sm text-red-600">
              {getFieldError("name")}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="address">Address</FieldLabel>
          <Input
            id="address"
            name="address"
            type="text"
            placeholder="123 Main St"
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 shadow-sm transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
          {getFieldError("address") && (
            <FieldDescription className="text-sm text-red-600">
              {getFieldError("address")}
            </FieldDescription>
          )}
        </Field>

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
            placeholder="Create a password"
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 shadow-sm transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
          {getFieldError("password") && (
            <FieldDescription className="text-sm text-red-600">
              {getFieldError("password")}
            </FieldDescription>
          )}
        </Field>

        <Field className="md:col-span-2">
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 shadow-sm transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
          {getFieldError("confirmPassword") && (
            <FieldDescription className="text-sm text-red-600">
              {getFieldError("confirmPassword")}
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
          {isPending ? "Creating account..." : "Create account"}
        </Button>

        <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-teal-700 hover:underline"
            >
              Sign in
            </a>
          </span>
          <span className="text-slate-500">
            By registering, you agree to our privacy policy.
          </span>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
