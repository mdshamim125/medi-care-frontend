"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { revalidate } from "@/lib/revalidate";
import { ArrowRight, Calendar, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PaymentSuccessContent = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const returnUrlRef = useRef("/dashboard/my-appointments");

  useEffect(() => {
    revalidate("my-appointments");

    const storedUrl =
      sessionStorage.getItem("paymentReturnUrl") ||
      "/dashboard/my-appointments";
    sessionStorage.removeItem("paymentReturnUrl");
    returnUrlRef.current = storedUrl;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const redirectTimer = setTimeout(() => {
      router.push(returnUrlRef.current);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  const handleManualRedirect = () => {
    router.push(returnUrlRef.current);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 dark:from-emerald-950/40 dark:via-background dark:to-teal-950/30">
      {/* Subtle background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-800/20" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-800/15" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-emerald-200/80 shadow-xl shadow-emerald-100/50 dark:border-emerald-800/60 dark:shadow-emerald-950/40">
        <CardContent className="px-8 pb-8 pt-10">
          <div className="flex flex-col items-center space-y-6 text-center">
            {/* Success Icon */}
            <div className="relative">
              <div className="absolute inset-0 scale-110 rounded-full bg-emerald-400/20 blur-2xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 ring-8 ring-emerald-50 dark:from-emerald-900/60 dark:to-teal-900/50 dark:ring-emerald-950/50">
                <CheckCircle2
                  className="h-10 w-10 text-emerald-600 dark:text-emerald-400"
                  strokeWidth={1.75}
                />
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50 sm:text-3xl">
                Payment successful
              </h1>
              <p className="text-sm leading-relaxed text-emerald-800/80 dark:text-emerald-200/80 sm:text-base">
                Your payment has been received and your appointment is confirmed.
              </p>
            </div>

            <div className="w-full rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-4 text-left dark:border-emerald-800/50 dark:bg-emerald-950/40">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/60">
                  <Calendar className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-100">
                    Appointment confirmed
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-emerald-800/80 dark:text-emerald-200/80">
                    View your appointment details and manage your booking from
                    My Appointments.
                  </p>
                </div>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-2 text-sm text-emerald-600/90 dark:text-emerald-400/90">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Returning to your appointments in{" "}
              <span className="font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
                {countdown}s
              </span>
            </div>

            {/* CTA */}
            <Button
              onClick={handleManualRedirect}
              size="lg"
              className="w-full gap-2 bg-emerald-600 text-white shadow-md shadow-emerald-200/60 transition hover:bg-emerald-700 dark:shadow-emerald-950/40"
            >
              View My Appointments
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessContent;