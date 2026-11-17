import { useQuery } from "@tanstack/react-query";
import type { HrsTeamKey } from "@shared/hrs";
import type { StaffMember } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface TeamStaffProps {
  team: HrsTeamKey;
  /** "list": avatars with names (Prva ekipa); "compact": short highlighted box (youth teams) */
  variant?: "list" | "compact";
}

// Coaching staff of a team as set by an admin (Admin → Coaching staff).
// The server returns staff already sorted by role.
export default function TeamStaff({ team, variant = "list" }: TeamStaffProps) {
  const { data, isLoading } = useQuery<StaffMember[]>({
    queryKey: ["/api/staff"],
  });
  const staff = data?.filter((s) => s.team === team) ?? [];

  if (isLoading) {
    return <Skeleton className={variant === "list" ? "h-32 w-full" : "h-12 w-full mt-4"} />;
  }

  if (staff.length === 0) {
    const message = "Stručni stožer još nije objavljen.";
    return variant === "list" ? (
      <p className="text-muted-foreground">{message}</p>
    ) : (
      <div className="mt-4 p-4 rounded-xl bg-secondary/70 ring-1 ring-accent/20 text-sm text-muted-foreground">{message}</div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="mt-4 p-4 rounded-xl bg-secondary/70 ring-1 ring-accent/20 space-y-3" data-testid="team-staff">
        {staff.map((person) => (
          <div key={person.id} className="flex items-center gap-3">
            <CoachAvatar person={person} className="h-10 w-10 text-sm" />
            <div className="text-sm leading-tight">
              <div className="font-semibold text-primary">{person.role}</div>
              <div>
                {person.firstName} {person.lastName}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="team-staff">
      {staff.map((person) => (
        <div key={person.id} className="flex items-center gap-4">
          <CoachAvatar person={person} className="h-16 w-16 text-xl" />
          <div>
            <div className="font-semibold">
              {person.firstName} {person.lastName}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent-strong">{person.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Coach photo (uploaded in admin) or initials on the club gradient.
function CoachAvatar({ person, className }: { person: StaffMember; className?: string }) {
  if (person.photoUrl) {
    return (
      <img
        src={person.photoUrl}
        alt={`${person.firstName} ${person.lastName}`}
        loading="lazy"
        className={cn("rounded-full object-cover ring-2 ring-accent shrink-0", className)}
        data-testid={`img-coach-${person.hrsPersonId}`}
      />
    );
  }
  return (
    <div
      className={cn(
        "rounded-full bg-brand-gradient ring-2 ring-accent flex items-center justify-center text-white font-display font-bold shrink-0",
        className,
      )}
      aria-hidden="true"
    >
      {person.firstName.charAt(0)}
      {person.lastName.charAt(0)}
    </div>
  );
}
