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
    </>
  );
}
