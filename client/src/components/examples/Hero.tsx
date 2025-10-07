import Hero from '../Hero';
import heroImage from '@assets/generated_images/Handball_game_action_shot_0ef2ef52.png';

export default function HeroExample() {
  return (
    <Hero
      title="RK Biograd - Snaga i strast"
      subtitle="Pratite našu putanju kroz sezonu. Pobjede, timski duh i nevjerojatna podrška navijača."
      imageSrc={heroImage}
      stats={{
        nextMatch: "15.10. vs RK Split",
        leaguePosition: "3. mjesto",
        recentForm: "P-P-N-P-P"
      }}
    />
  );
}
