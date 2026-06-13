import { HomeHero } from "@/components/HomeHero";
import { MatchExplorer } from "@/components/MatchExplorer";

export default function Home() {
  return (
    <>
      <HomeHero />
      <div id="fixtures" className="scroll-mt-24 pt-4" />
      <MatchExplorer />
    </>
  );
}
