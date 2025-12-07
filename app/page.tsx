import { CategoryMenu, Hero, Incentives, IntroducingSection, Newsletter, ProductsSection, PromoMarquee, SearchMessage } from "@/components";

export default function Home() {
  return (
    <>
    <PromoMarquee />
    <SearchMessage />
    <CategoryMenu />
    <Hero />
    <ProductsSection />
    <IntroducingSection />
    {/* WhatsApp floating chat button */}
    <a
      href="https://wa.me/64225710609"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1aa359] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform duration-150 ease-in-out hover:scale-105"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M20.52 3.48A11.79 11.79 0 0 0 12 0C5.37 0 .01 5.36.01 12c0 2.11.55 4.17 1.6 5.98L0 24l6.34-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.36 12-12 0-3.2-1.25-6.2-3.48-8.52z" fill="#fff" opacity=".05"/>
        <path d="M20.52 3.48A11.79 11.79 0 0 0 12 0C5.37 0 .01 5.36.01 12c0 2.11.55 4.17 1.6 5.98L0 24l6.34-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.36 12-12 0-3.2-1.25-6.2-3.48-8.52z" fill="none"/>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.672.15-.198.297-.768.966-.942 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.074-.149-.672-1.62-.922-2.219-.242-.583-.487-.504-.672-.513l-.572-.01c-.198 0-.52.074-.793.372s-1.04 1.016-1.04 2.479 1.064 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487  .709.306 1.26.489 1.69.626.71.226 1.36.194 1.873.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.123-.272-.198-.569-.347z" fill="#fff"/>
      </svg>
    </a>
    </>
  );
}
