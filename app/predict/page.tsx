import type { Metadata } from "next";
import { Predictor } from "@/components/Predictor";

export const metadata: Metadata = {
  title: "Predict the Bracket · World Cup 2026",
  description:
    "Build your own FIFA World Cup 2026 prediction — pick group winners, wildcard third-place teams, and every knockout result up to the champion.",
};

export default function PredictPage() {
  return <Predictor />;
}
