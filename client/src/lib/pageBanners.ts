import { useQuery } from "@tanstack/react-query";
import type { PageBannerKey } from "@shared/schema";
import heroImage from "@assets/generated_images/Handball_game_action_shot_0ef2ef52.png";
import teamImage from "@assets/generated_images/Team_celebration_victory_shot_e3f6592a.png";
import youthImage from "@assets/generated_images/Youth_team_training_session_fbe701c2.png";

// Pages with a changeable top image (Admin → Naslovne slike). `defaultImage: null` means the
// page shows the dark-blue banner with the crest until an image is set.
export const PAGE_BANNERS: { key: PageBannerKey; label: string; path: string; defaultImage: string | null }[] = [
  { key: "home", label: "Početna", path: "/", defaultImage: heroImage },
  { key: "first-team", label: "Prva ekipa", path: "/first-team", defaultImage: teamImage },
  { key: "u15", label: "U15", path: "/u15", defaultImage: youthImage },
  { key: "u13", label: "U13", path: "/u13", defaultImage: youthImage },
  { key: "news", label: "Vijesti", path: "/news", defaultImage: null },
  { key: "history", label: "Povijest", path: "/history", defaultImage: null },
  { key: "contact", label: "Kontakt", path: "/contact", defaultImage: null },
];

export function usePageBanners() {
  return useQuery<Record<string, string>>({ queryKey: ["/api/page-banners"] });
}

/** Top image of a page: the admin's custom image, otherwise the page's default (or none). */
export function usePageBanner(key: PageBannerKey): string | undefined {
  const { data } = usePageBanners();
  const fallback = PAGE_BANNERS.find((p) => p.key === key)?.defaultImage ?? undefined;
  return data?.[key] ?? fallback;
}
