import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCategories from "./components/ProductCategories";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import WhyUs from "./components/WhyUs";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductCategories />
        {/* <Categories /> */}
        {/* <PromoBanner /> */}
        <FeaturedProducts />
        <WhyUs />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
