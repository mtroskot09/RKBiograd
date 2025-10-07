import FixtureCard from '../FixtureCard';

export default function FixtureCardExample() {
  return (
    <div className="space-y-4 max-w-md">
      <FixtureCard
        homeTeam="RK Biograd"
        awayTeam="RK Split"
        homeScore={32}
        awayScore={24}
        date="5. listopada 2025."
        location="Sportska dvorana Biograd"
        status="finished"
      />
      <FixtureCard
        homeTeam="RK Zadar"
        awayTeam="RK Biograd"
        date="15. listopada 2025."
        time="18:00"
        location="Sportska dvorana Zadar"
        status="upcoming"
      />
    </div>
  );
}
