import type { Metadata } from "next";
import { getDoctors } from "@/services/admin/doctorManagement";
import { getSpecialities } from "@/services/admin/specialitiesManagement";
import { getReviews } from "@/services/patient/reviews.services";
import { IDoctor } from "@/types/doctor.interface";
import { IReview } from "@/types/review.interface";
import { ISpecialty } from "@/types/specialities.interface";
import { Hero } from "@/components/modules/Home/Hero";
import Specialities from "@/components/modules/Home/Specialties";
import Testimonials from "@/components/modules/Home/Testimonials";
import TopRatedDoctors from "@/components/modules/Home/TopRatedDoctors";

export const metadata: Metadata = {
  title: "Medi-Care | Find the right doctor for you",
  description:
    "Explore doctor profiles and specialties, compare experience, and book appointments with Medi-Care.",
};

export default async function Home() {
  const [doctorResponse, specialtyResponse, reviewResponse] = await Promise.all([
    getDoctors("?page=1&limit=6", "no-store"),
    getSpecialities("?page=1&limit=8"),
    getReviews("page=1&limit=3"),
  ]);

  const doctors: IDoctor[] =
    doctorResponse?.success && Array.isArray(doctorResponse.data)
      ? doctorResponse.data
      : [];
  const specialties: ISpecialty[] =
    specialtyResponse?.success && Array.isArray(specialtyResponse.data)
      ? specialtyResponse.data
      : [];
  const reviews: IReview[] =
    reviewResponse?.success && Array.isArray(reviewResponse.data)
      ? reviewResponse.data
      : [];

  const doctorTotal = Number(doctorResponse?.meta?.total);
  const specialtyTotal = Number(specialtyResponse?.meta?.total);
  const reviewTotal = Number(reviewResponse?.meta?.total);
  const doctorCount =
    Number.isFinite(doctorTotal) && doctorTotal >= 0
      ? doctorTotal
      : doctors.length;
  const specialtyCount =
    Number.isFinite(specialtyTotal) && specialtyTotal >= 0
      ? specialtyTotal
      : specialties.length;
  const reviewCount =
    Number.isFinite(reviewTotal) && reviewTotal >= 0
      ? reviewTotal
      : reviews.length;
  const loadErrors = [
    !doctorResponse?.success && "doctor profiles",
    !specialtyResponse?.success && "specialties",
    !reviewResponse?.success && "patient reviews",
  ].filter((item): item is string => Boolean(item));

  return (
    <>
      {loadErrors.length > 0 && (
        <div
          role="alert"
          className="border-b border-destructive/20 bg-destructive/5 px-5 py-3 text-center text-sm text-destructive"
        >
          Some homepage content could not be loaded: {loadErrors.join(", ")}.
          Please refresh to try again.
        </div>
      )}
      <Hero
        doctors={doctors}
        doctorCount={doctorCount}
        specialtyCount={specialtyCount}
      />
      <Specialities specialties={specialties} totalCount={specialtyCount} />
      <TopRatedDoctors
        doctors={doctors}
        totalCount={doctorCount}
        loadFailed={!doctorResponse?.success}
      />
      <Testimonials
        reviews={reviews}
        totalCount={reviewCount}
        loadFailed={!reviewResponse?.success}
      />
    </>
  );
}
