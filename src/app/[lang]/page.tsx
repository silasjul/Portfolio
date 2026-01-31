import Hero from "@/components/hero/Hero";
import Navbar from "@/components/hero/Navbar";
import Services from "@/components/sections/Services";
import Works from "@/components/sections/Works";
import About from "@/components/sections/About";
import AskAI from "@/components/sections/AskAI";
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
      <section id="hero" className="relative h-screen">
        <Navbar dict={dict.nav} />
        <Hero dict={dict.hero} />
      </section>

      <div className="relative">
        <div id="services">
          <Services dict={dict.services} />
        </div>
        <div id="works">
          <Works dict={dict.works} />
        </div>
        <div id="about">
          <About dict={dict.about} />
        </div>
        <div id="ask-ai">
          <AskAI dict={dict.askAI} />
        </div>
        <div id="contact">
          <Contact dict={dict.contact} />
        </div>
        <div id="footer">
          <Footer footerDict={dict.footer} navDict={dict.nav} />
        </div>
      </div>
    </main>
  );
}
