import Link from 'next/link';
import { Activity, ArrowRight, Mail, MapPin } from 'lucide-react';

const footerLinkClass =
  'inline-flex items-center text-muted-foreground transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

function PublicFooter() {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-10 lg:py-[4.5rem]">
          <div className="max-w-sm">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-black/10 ring-1 ring-border/70 transition-transform group-hover:scale-[1.03]">
                <Activity className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <span className="flex flex-col">
                <span className="text-lg font-bold leading-tight tracking-tight">
                  Medi-Care
                </span>
                <span className="mt-1 text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-primary/75">
                  Care that connects
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">
              Your health is our priority. We deliver trusted medical services
              with compassion and excellence.
            </p>
            <Link
              href="/consultation"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Find a doctor
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <nav aria-label="Explore">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-foreground">
              Explore
            </h2>
            <ul className="mt-5 space-y-3.5 text-sm">
              <li>
                <Link href="/" className={footerLinkClass}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/consultation" className={footerLinkClass}>
                  Consultation
                </Link>
              </li>
              <li>
                <Link href="/about" className={footerLinkClass}>
                  About Us
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Support">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-foreground">
              Support
            </h2>
            <ul className="mt-5 space-y-3.5 text-sm">
              <li>
                <Link href="/contact" className={footerLinkClass}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className={footerLinkClass}>
                  FAQs
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-foreground">
              Get in touch
            </h2>
            <address className="mt-5 space-y-4 text-sm not-italic leading-6 text-muted-foreground">
              <p className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <span>
                  123 Medical Lane
                  <br />
                  Health City, HC 12345
                </span>
              </p>
              <a
                href="mailto:contact@medicare.com"
                className="group inline-flex items-center gap-3 transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                contact@medicare.com
              </a>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>
            &copy; {new Date().getFullYear()} Medi-Care. All rights reserved.
          </p>
          <p>
            Built with care for better health outcomes.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;