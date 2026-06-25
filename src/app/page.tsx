import { About } from "../components/About";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { VideoGallery } from "../components/VideoGallery";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <VideoGallery />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
