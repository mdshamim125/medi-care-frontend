import Link from 'next/link';
import { Activity } from 'lucide-react';

function PublicFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Activity className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Medi-Care
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Your health is our priority. We deliver trusted medical services
              with compassion and excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-foreground">
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-foreground">
              Contact Us
            </h3>
            <address className="not-italic space-y-2 text-sm text-muted-foreground">
              <p>123 Medical Lane</p>
              <p>Health City, HC 12345</p>
              <p>
                <a
                  href="mailto:contact@medicare.com"
                  className="transition-colors hover:text-foreground"
                >
                  contact@medicare.com
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Medi-Care. All rights reserved.</p>
          <p className="text-xs">
            Built with care for better health outcomes.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;