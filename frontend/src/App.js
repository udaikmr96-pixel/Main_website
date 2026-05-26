import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import LanguageMarquee from "@/components/sections/LanguageMarquee";
import Process from "@/components/sections/Process";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

function Landing() {
  return (
    <div className="App grain min-h-screen bg-[#050505] text-white">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <LanguageMarquee />
        <About />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <SmoothScroll>
      <BrowserRouter>
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#ffffff",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </SmoothScroll>
  );
}

export default App;
