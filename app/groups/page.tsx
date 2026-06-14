import type { Metadata } from "next";
import { GroupsView } from "@/components/GroupsView";

export const metadata: Metadata = {
  title: "Groups & Standings · World Cup 2026",
  description:
    "Live FIFA World Cup 2026 group standings, the best third-placed teams, top scorers and tournament stats — updated from real results.",
};

export default function GroupsPage() {
  return <GroupsView />;
}
