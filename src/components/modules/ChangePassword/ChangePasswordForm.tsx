"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  changeMyPassword,
  type ChangePasswordActionState,
} from "@/services/auth/auth.service";
import { Eye, EyeOff, KeyRound, LoaderCircle, ShieldCheck } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

const passwordFields = [
  {
    name: "currentPassword",
    label: "Current password",
    autoComplete: "current-password",
    description: "Confirm your identity with your current password.",
  },
  {
    name: "newPassword",
    label: "New password",
    autoComplete: "new-password",
    description: "Use at least 6 characters.",
  },
  {
    name: "confirmPassword",
    label: "Confirm new password",
    autoComplete: "new-password",
    description: "Enter the new password again to confirm it.",
  },
] as const;

const ChangePasswordForm = () => {
  const [state, formAction, isPending] = useActionState<
    ChangePasswordActionState | null,
    FormData
  >(changeMyPassword, null);
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message || "Your password has been updated.");
    }
  }, [state]);

  const getFieldError = (name: string) =>
    state?.errors?.find((error) => error.field === name)?.message;

  return (
    <Card className="overflow-hidden border-slate-200/80 shadow-sm">
      <CardHeader className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <KeyRound className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg">Update your password</CardTitle>
            <CardDescription className="max-w-xl leading-relaxed">
              Choose a password you haven’t used before to help keep your
              account secure.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-6 sm:px-7">
        {state?.success && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950/40 dark:text-green-200">
            <ShieldCheck />
            <AlertTitle>Password updated</AlertTitle>
            <AlertDescription>
              Your account password was changed successfully.
            </AlertDescription>
          </Alert>
        )}

        {state?.message && !state.success && !state.errors?.length && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Password could not be updated</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <form action={formAction} className="space-y-5">
          {passwordFields.map((field) => {
            const error = getFieldError(field.name);
            return (
              <Field key={field.name} data-invalid={Boolean(error)}>
                <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPasswords ? "text" : "password"}
                    autoComplete={field.autoComplete}
                    required
                    maxLength={100}
                    disabled={isPending}
                    aria-invalid={Boolean(error)}
                    aria-describedby={`${field.name}-description${error ? ` ${field.name}-error` : ""}`}
                    className="h-11 pr-12"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPasswords ? "Hide passwords" : "Show passwords"
                    }
                    aria-pressed={showPasswords}
                    onClick={() => setShowPasswords((visible) => !visible)}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {showPasswords ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {error ? (
                  <p
                    id={`${field.name}-error`}
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {error}
                  </p>
                ) : (
                  <FieldDescription id={`${field.name}-description`}>
                    {field.description}
                  </FieldDescription>
                )}
              </Field>
            );
          })}

          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Your current password is required to confirm this change.
            </p>
            <Button type="submit" disabled={isPending} className="sm:min-w-40">
              {isPending ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Update password"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;
