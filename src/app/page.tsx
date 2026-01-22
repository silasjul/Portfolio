import Hero from "@/components/hero/Hero";
import Navbar from "@/components/hero/Navbar";
import { VantaBackground } from "@/components/VantaFog";

export default function Home() {
  return (
    <main>
      <VantaBackground />
      <Navbar />
      <Hero />
    </main>
  );
}
