import { ArrowRight, CalendarClock, MapPin, Star } from "lucide-react";

const doctors = [
  {
    id: "d1",
    name: "Dr. Anaya Raghunathan",
    specialty: "Cardiologist",
    hospital: "Northline Heart Institute",
    rating: 4.9,
    reviews: 412,
    nextAvailable: "Tomorrow, 9:30 AM",
    match: 96,
    tags: ["Chest pain", "Hypertension"],
    photo:
      "https://cdn.magicpatterns.com/patterns/generated-images/27d14396-48e5-42e0-882d-bc23f9e894cc.jpg",
  },
  {
    id: "d2",
    name: "Dr. Marcus Ellison",
    specialty: "Neurologist",
    hospital: "St. Bridget Medical Center",
    rating: 4.8,
    reviews: 328,
    nextAvailable: "Today, 4:15 PM",
    match: 92,
    tags: ["Migraine", "Epilepsy"],
    photo:
      "https://cdn.magicpatterns.com/patterns/generated-images/2b14a7db-ed46-408b-878a-a519d487392c.jpg",
  },
  {
    id: "d3",
    name: "Dr. Mei-Lin Chow",
    specialty: "Endocrinologist",
    hospital: "Riverbend Clinic",
    rating: 4.9,
    reviews: 276,
    nextAvailable: "Fri, 11:00 AM",
    match: 90,
    tags: ["Diabetes", "Thyroid"],
    photo:
      "https://cdn.magicpatterns.com/patterns/generated-images/f895679c-2f9c-4a35-b58b-8f102b98e9ab.jpg",
  },
  {
    id: "d4",
    name: "Dr. Julian Vance",
    specialty: "Orthopedic Surgeon",
    hospital: "Cedar Park Ortho",
    rating: 4.7,
    reviews: 519,
    nextAvailable: "Mon, 8:00 AM",
    match: 88,
    tags: ["Knee & hip", "Sports injury"],
    photo:
      "https://cdn.magicpatterns.com/patterns/generated-images/0ce2e8e6-a9c7-4937-aa1d-780ff655f33e.jpg",
  },
];

const TopRatedDoctors = () => {
  return (
    <section id="doctors" className="w-full bg-[#f7f5f0] py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
              Top doctors
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Highest-rated specialists on medi-care this month
            </h2>
          </div>
          <a
            href="#doctors"
            className="group inline-flex flex-none items-center gap-2 text-sm font-semibold text-teal-700 transition-colors hover:text-teal-800"
          >
            Browse all 1,200 specialists
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doctor) => (
            <li key={doctor.id}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-[0_1px_2px_rgba(11,43,51,0.04),0_12px_32px_-12px_rgba(11,43,51,0.16)] transition-shadow duration-300 hover:shadow-[0_2px_4px_rgba(11,43,51,0.05),0_24px_48px_-16px_rgba(11,43,51,0.22)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-teal-50">
                  <img
                    src={doctor.photo}
                    alt={`Portrait of ${doctor.name}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-bold text-teal-700 backdrop-blur-sm">
                    {doctor.match}% fit
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold leading-snug text-slate-900">
                    {doctor.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-teal-700">
                    {doctor.specialty}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 flex-none" />
                      <span className="truncate">{doctor.hospital}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <CalendarClock className="h-3.5 w-3.5 flex-none" />
                      {doctor.nextAvailable}
                    </p>
                  </div>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {doctor.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full bg-[#f7f5f0] px-2.5 py-1 text-[11px] font-medium text-slate-700"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-teal-50 pt-4">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {doctor.rating}
                      <span className="font-normal text-slate-600">
                        ({doctor.reviews})
                      </span>
                    </p>
                    <button
                      type="button"
                      className="rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-700"
                    >
                      Book visit
                    </button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TopRatedDoctors;
