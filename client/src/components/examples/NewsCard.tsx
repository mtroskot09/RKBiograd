import NewsCard from '../NewsCard';
import teamImage from '@assets/generated_images/Team_celebration_victory_shot_e3f6592a.png';

export default function NewsCardExample() {
  return (
    <div className="max-w-sm">
      <NewsCard
        id="1"
        title="Uvjerljiva pobjeda protiv rivala - 32:24"
        excerpt="U sjajnoj atmosferi dvorane, naši rukometaši upisali su uvjerljivu pobjedu i nastavili niz dobrih rezultata."
        date="5. listopada 2025."
        category="Prva ekipa"
        imageSrc={teamImage}
      />
    </div>
  );
}
