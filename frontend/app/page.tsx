import { getEvents, getStats } from "@/lib/data";
import { Hero } from "@/components/home/hero";
import { AboutSection } from "@/components/home/about-section";
import { WhyJoinSection } from "@/components/home/why-join-section";
import { UpcomingEventsSection } from "@/components/home/upcoming-events-section";
import { StatsSection } from "@/components/home/stats-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { BlogSection } from "@/components/home/blog-section";
import { FaqSection } from "@/components/home/faq-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { FinalCtaSection } from "@/components/home/final-cta-section";

export default async function HomePage() {
  const [{ items }, stats] = await Promise.all([
    getEvents({ sort: "date", limit: 6 }),
    getStats(),
  ]);

  return (
    <>
      <Hero events={items} />
      <AboutSection />
      <WhyJoinSection />
      <UpcomingEventsSection events={items.slice(0, 4)} />
      <StatsSection stats={stats} />
      <TestimonialsSection />
      <BlogSection />
      <FaqSection />
      <NewsletterSection />
      <FinalCtaSection />
    </>
  );
}
