import Hero from "@/components/hero/Hero";
import Navbar from "@/components/hero/Navbar";
import Services from "@/components/sections/Services";
import Works from "@/components/sections/Works";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { VantaParallaxBackground } from "@/components/VantaFog";
import { getDictionary } from "@/lib/dictionaries";

export default async function Home({ params }: { params: Promise<{ lang: 'en' | 'da' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main className="relative min-h-screen">
      <VantaParallaxBackground />

      {/* Hero Section */}
      <section className="relative h-screen">
        <Navbar dict={dict.nav} />
        <Hero dict={dict.hero} />
      </section>

      <div className="relative">
        <Services dict={dict.services} />
        <Works dict={dict.works} />
        <About dict={dict.about} />
        <Contact dict={dict.contact} />
        <Footer footerDict={dict.footer} navDict={dict.nav} />
      </div>
    </main>
  );
}
