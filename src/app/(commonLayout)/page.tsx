import Head from "next/head";
import { Hero } from "@/components/modules/Home/Hero";
import Specialities from "@/components/modules/Home/Specialties";
import Testimonials from "@/components/modules/Home/Testimonials";
import TopRatedDoctors from "@/components/modules/Home/TopRatedDoctors";

export default function Home() {
  return (
    <>
      <Head>
        <title>medi-care | AI-powered healthcare</title>
        <meta
          name="description"
          content="Discover top-rated doctors tailored to your needs with our AI-powered healthcare platform. Get personalized recommendations and book appointments effortlessly."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <PublicNavbar /> */}
      <main>
        <Hero />
        <Specialities />
        <TopRatedDoctors />
        <Testimonials />
      </main>
      {/* <PublicFooter /> */}
    </>
  );
}
