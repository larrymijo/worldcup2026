import type { Metadata } from "next";
import { EcuadorView } from "@/components/EcuadorView";

export const metadata: Metadata = {
  title: "Ecuador · World Cup 2026",
  description:
    "Ecuador's full FIFA World Cup 2026 schedule (Group E) with a live countdown to the next match — all in your local time.",
};

export default function EcuadorPage() {
  return <EcuadorView />;
}
