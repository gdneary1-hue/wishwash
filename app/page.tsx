import { existsSync } from "fs";
import path from "path";
import { Nav } from "@/components/Nav";
import type { VideoFiles } from "@/components/PromoVideo";
import { Benefits } from "@/components/sections/Benefits";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { VideoFeature } from "@/components/sections/VideoFeature";
import { WaitlistProvider } from "@/components/waitlist/WaitlistProvider";

// Checked when the site is built: drop files into /public/video and redeploy.
function findVideoFiles(): VideoFiles {
  const dir = path.join(process.cwd(), "public", "video");
  return {
    mp4: existsSync(path.join(dir, "promo.mp4")),
    webm: existsSync(path.join(dir, "promo.webm")),
    poster: existsSync(path.join(dir, "promo-poster.jpg")),
  };
}

export default function Home() {
  const video = findVideoFiles();
  return (
    <WaitlistProvider>
      <Nav />
      <main>
        <Hero video={video} />
        <HowItWorks />
        <Pricing />
        <Benefits />
        <VideoFeature video={video} />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </WaitlistProvider>
  );
}
