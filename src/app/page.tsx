import Hero from "@/components/hero/Hero";
import Navbar from "@/components/hero/Navbar";
import Services from "@/components/sections/Services";
import Works from "@/components/sections/Works";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { VantaBackground } from "@/components/VantaFog";

export default function Home() {
  return (
    <main className="relative">
      {/* Hero Section */}
      <section className="relative h-screen">
        <VantaBackground />
        <Navbar />
        <Hero />
      </section>

      {/* Content Sections with transparent blend at top */}
      <div className="relative">
          <Services />
          <Works />
          <About />
          <Contact />
          <Footer />
      </div>
    </main>
  );
}
