import { Quote, Star } from "lucide-react";

const reviews = [
  {
    id: "r1",
    quote:
      "I had been bounced between three clinics for six months. medi-care suggested a neurologist on the first try and explained exactly why. I finally have a diagnosis.",
    name: "Priya Nandakumar",
    detail: "Matched with a neurologist · Austin, TX",
    initials: "PN",
    rating: 5,
  },
  {
    id: "r2",
    quote:
      "The fit score sounded like marketing until I read the reasoning — my history, my insurance, my commute. Booked the same evening and was seen in two days.",
    name: "David Okonkwo",
    detail: "Matched with a cardiologist · Chicago, IL",
    initials: "DO",
    rating: 5,
  },
  {
    id: "r3",
    quote:
      "As a caregiver for my mother, this removed the hardest part: knowing which specialist to even call. The whole process took under five minutes.",
    name: "Elena Ferrara",
    detail: "Matched with an endocrinologist · Portland, OR",
    initials: "EF",
    rating: 4,
  },
];

const Testimonials = () => {
  return (
    <section id="reviews" className="w-full bg-white py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
            Patient reviews
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            18,000+ patients matched, and counting
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-700">
            Verified reviews from patients who booked their care through
            medi-care.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <li key={review.id} className="h-full">
              <figure className="flex h-full flex-col rounded-3xl border border-teal-100 bg-[#f7f5f0] p-6">
                <Quote className="h-6 w-6 text-teal-300" />
                <div
                  className="mt-4 flex items-center gap-0.5"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star < review.rating ? "fill-amber-400 text-amber-400" : "text-teal-200"}`}
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
                  “{review.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-teal-100 pt-5">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                    {review.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-slate-900">
                      {review.name}
                    </span>
                    <span className="block truncate text-xs text-slate-600">
                      {review.detail}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Testimonials;
