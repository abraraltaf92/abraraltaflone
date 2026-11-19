import { Hero } from "@/components/home/Hero";
import { Projects } from "@/components/home/Projects";
import { AboutTeaser, Experience } from "@/components/home/Experience";
import { Testimonials } from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Projects />
      <Experience />
      <AboutTeaser />
      <Testimonials />
    </>
  );
}
