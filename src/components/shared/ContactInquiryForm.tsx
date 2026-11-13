"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ContactFormState,
  submitContactInquiry,
} from "@/services/contact/contact.service";

const initialState: ContactFormState = {
  success: false,
  message: "",
};

const ContactInquiryForm = () => {
  const [state, formAction, isPending] = useActionState(
    submitContactInquiry,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <div
          role={state.success ? "status" : "alert"}
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
              : "border-destructive/20 bg-destructive/5 text-destructive"
          }`}
        >
          {state.success ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{state.message}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="text-sm font-semibold">
            Your name
          </label>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            placeholder="Jane Smith"
            maxLength={100}
            aria-invalid={Boolean(state.errors?.name)}
            aria-describedby={state.errors?.name ? "contact-name-error" : undefined}
            required
          />
          {state.errors?.name && (
            <p id="contact-name-error" className="text-xs text-destructive">
              {state.errors.name}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-sm font-semibold">
            Email address
          </label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            maxLength={254}
            aria-invalid={Boolean(state.errors?.email)}
            aria-describedby={state.errors?.email ? "contact-email-error" : undefined}
            required
          />
          {state.errors?.email && (
            <p id="contact-email-error" className="text-xs text-destructive">
              {state.errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-subject" className="text-sm font-semibold">
          Subject
        </label>
        <Input
          id="contact-subject"
          name="subject"
          placeholder="How can we help?"
          maxLength={120}
          aria-invalid={Boolean(state.errors?.subject)}
          aria-describedby={
            state.errors?.subject ? "contact-subject-error" : undefined
          }
          required
        />
        {state.errors?.subject && (
          <p id="contact-subject-error" className="text-xs text-destructive">
            {state.errors.subject}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-sm font-semibold">
          Message
        </label>
        <Textarea
          id="contact-message"
          name="message"
          placeholder="Tell us a little more about your question..."
          className="min-h-36 resize-y"
          maxLength={5000}
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={
            state.errors?.message ? "contact-message-error" : undefined
          }
          required
        />
        {state.errors?.message && (
          <p id="contact-message-error" className="text-xs text-destructive">
            {state.errors.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="h-11 w-full gap-2 rounded-xl font-semibold sm:w-auto sm:px-7"
      >
        {isPending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Sending message...
          </>
        ) : (
          <>
            Send message
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-xs leading-5 text-muted-foreground">
        Please don&apos;t include urgent medical information. This form is not
        monitored for emergencies.
      </p>
    </form>
  );
};

export default ContactInquiryForm;
