import ContactInquiryForm from "@/components/shared/ContactInquiryForm";
import { Mail, MapPin, MessageCircle } from "lucide-react";

const ContactPage = () => (
  <div className="container mx-auto px-4 py-10 md:py-16">
    <header className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Contact Medi-Care
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        We&apos;re here to help.
      </h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        Have a question about using Medi-Care? Send us a message and our team
        will get back to you.
      </p>
    </header>

    <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:mt-14 lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="space-y-4">
        <div className="rounded-2xl border bg-primary p-6 text-primary-foreground shadow-sm sm:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <MessageCircle className="h-5 w-5" />
          </div>
          <h2 className="mt-6 text-xl font-bold">Let&apos;s talk</h2>
          <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
            For questions about the platform, appointments, or your account,
            send us a note using the form. We&apos;ll reply to the email address
            you provide.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide">
            Contact details
          </h2>
          <a
            href="mailto:contact@medicare.com"
            className="mt-5 flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail className="h-4 w-4" />
            </span>
            contact@medicare.com
          </a>
          <div className="mt-4 flex items-start gap-3 text-sm leading-6 text-muted-foreground">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="h-4 w-4" />
            </span>
            <span className="pt-1">
              123 Medical Lane
              <br />
              Health City, HC 12345
            </span>
          </div>
        </div>
      </aside>

      <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Send us a message</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fields marked required must be completed.
          </p>
        </div>
        <ContactInquiryForm />
      </section>
    </div>
  </div>
);

export default ContactPage;
