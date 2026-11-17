import { useQuery } from "@tanstack/react-query";
import { DEFAULT_CLUB_INFO, type ClubInfo } from "@shared/schema";

/** Club contact details (edited in Admin → Contact Details). */
export function useClubInfo() {
  const query = useQuery<ClubInfo>({ queryKey: ["/api/club-info"] });
  return { ...query, info: query.data ?? DEFAULT_CLUB_INFO };
}

/** Value for a tel: link, e.g. "+385 23 123 456" → "+38523123456" */
export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** Text split into non-empty lines (address and office hours are stored one item per line). */
export const lines = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
