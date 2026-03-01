import { FaWhatsapp } from "react-icons/fa6";
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
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-transform duration-300 ease-in-out hover:scale-110"
      >
        <FaWhatsapp className="w-10 h-10" />
      </a>
    </>
  );
}
