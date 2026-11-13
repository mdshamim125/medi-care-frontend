import FAQList from "@/components/shared/FAQList";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

const FAQPage = () => (
  <div className="container mx-auto px-4 py-10 md:py-16">
    <header className="mx-auto max-w-3xl text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MessageCircleQuestion className="h-6 w-6" />
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Help center
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        Frequently asked questions
      </h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        Find quick answers about appointments, payments, prescriptions, and
        your Medi-Care account.
      </p>
    </header>

    <section className="mx-auto mt-10 max-w-3xl md:mt-14">
      <FAQList />
    </section>

    <section className="mx-auto mt-12 flex max-w-3xl flex-col gap-4 rounded-2xl border bg-muted/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div>
        <h2 className="font-bold">Still have a question?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Send our team a message and we&apos;ll point you in the right direction.
        </p>
      </div>
      <Link
        href="/contact"
        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Contact us
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  </div>
);

export default FAQPage;
