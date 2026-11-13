import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/formatters";
import { IReview } from "@/types/review.interface";
import { ArrowRight, Quote, Star } from "lucide-react";
import Link from "next/link";

interface TestimonialsProps {
  reviews: IReview[];
  totalCount: number;
  loadFailed: boolean;
}

export default function Testimonials({
  reviews,
  totalCount,
  loadFailed,
}: TestimonialsProps) {
  const visibleReviews = reviews
    .filter((review) => review.comment?.trim() && review.rating > 0)
    .slice(0, 3);

  return (
    <section id="reviews" className="bg-muted/35 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Patient reviews
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Feedback from real visits
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              {totalCount > 0
                ? `Read ${totalCount} ${totalCount === 1 ? "patient review" : "patient reviews"} shared through Medi-Care.`
                : "Patient feedback will appear here as reviews are shared."}
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="w-fit rounded-xl border-border bg-card"
          >
            <Link href="/consultation">
              Find a doctor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {visibleReviews.length > 0 ? (
          <ul className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-3">
            {visibleReviews.map((review) => {
              const patientName = "Medi-Care patient";
              const rating = Math.min(5, Math.max(0, Math.round(review.rating)));

              return (
                <li key={review.id} className="h-full">
                  <figure className="flex h-full flex-col rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between">
                      <Quote className="h-5 w-5 text-primary/50" />
                      <div
                        role="img"
                        className="flex items-center gap-0.5"
                        aria-label={`${rating} out of 5 stars`}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            aria-hidden="true"
                            className={`h-4 w-4 ${
                              star <= rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <blockquote className="mt-4 flex-1 text-sm leading-6 text-foreground">
                      “{review.comment}”
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {getInitials(patientName)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-foreground">
                          {patientName}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          Patient review
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        ) : (
          <div
            className="mt-9 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center"
            role={loadFailed ? "alert" : undefined}
          >
            <Star className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-semibold text-foreground">
              {loadFailed
                ? "Patient reviews are temporarily unavailable."
                : "There are no patient reviews to display yet."}
            </p>
            {!loadFailed && (
              <p className="mt-1 text-sm text-muted-foreground">
                You can explore doctor profiles and available appointments in
                the meantime.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
