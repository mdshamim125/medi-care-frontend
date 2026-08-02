/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { loginUser } from "@/services/auth/loginUser";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

const LoginForm = ({ redirect }: { redirect?: string }) => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginUser, null);

  useEffect(() => {
    if (state?.success && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [router, state]);

  const getFieldError = (fieldName: string) => {
    if (state && state.errors) {
      const error = state.errors.find((err: any) => err.field === fieldName);
      return error.message;
    } else {
      return null;
    }
  };

  return (
    <form action={formAction} className="space-y-5">
      {redirect && <input type="hidden" name="redirect" value={redirect} />}
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4">
          <Field>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              className="h-11 rounded-xl border-slate-200 bg-slate-50 px-4 shadow-sm focus:border-teal-500 focus:ring-teal-500"
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
              className="h-11 rounded-xl border-slate-200 bg-slate-50 px-4 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
            {getFieldError("password") && (
              <FieldDescription className="text-sm text-red-600">
                {getFieldError("password")}
              </FieldDescription>
            )}
          </Field>
        </div>

        <div className="space-y-3 pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="h-11 w-full rounded-xl bg-teal-600 text-white shadow-sm transition hover:bg-teal-700"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>

          <div className="flex flex-col items-center gap-1 text-sm text-slate-600">
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
      </FieldGroup>
    </form>
  );
};

export default LoginForm;
