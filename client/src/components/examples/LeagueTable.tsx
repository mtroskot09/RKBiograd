import LeagueTable from '../LeagueTable';

export default function LeagueTableExample() {
  const mockTeams = [
    { position: 1, team: "RK Zagreb", played: 8, won: 7, draw: 1, lost: 0, goalsFor: 245, goalsAgainst: 198, goalDiff: 47, points: 22 },
    { position: 2, team: "RK Split", played: 8, won: 6, draw: 1, lost: 1, goalsFor: 228, goalsAgainst: 205, goalDiff: 23, points: 19 },
    { position: 3, team: "RK Biograd", played: 8, won: 5, draw: 2, lost: 1, goalsFor: 215, goalsAgainst: 198, goalDiff: 17, points: 17, isOurTeam: true },
    { position: 4, team: "RK Zadar", played: 8, won: 4, draw: 2, lost: 2, goalsFor: 210, goalsAgainst: 208, goalDiff: 2, points: 14 },
    { position: 5, team: "RK Dubrovnik", played: 8, won: 3, draw: 1, lost: 4, goalsFor: 198, goalsAgainst: 215, goalDiff: -17, points: 10 },
    { position: 6, team: "RK Šibenik", played: 8, won: 2, draw: 2, lost: 4, goalsFor: 190, goalsAgainst: 220, goalDiff: -30, points: 8 },
  ];

  return <LeagueTable teams={mockTeams} title="2. HRL Jug - Ljestvica" />;
}
