import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard, { NewsEmpty } from "@/components/NewsCard";
import PageBanner from "@/components/PageBanner";
import { Skeleton } from "@/components/ui/skeleton";
import heroImage from '@assets/generated_images/Handball_game_action_shot_0ef2ef52.png';
import type { Post } from "@shared/schema";
import { formatDate } from "@/lib/hrsFormat";
import { usePageBanner } from "@/lib/pageBanners";

export default function News() {
  const bannerImage = usePageBanner("news");
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageBanner title="Vijesti" eyebrow="RK Biograd" subtitle="Novosti, izvještaji s utakmica i sve iz života kluba." imageSrc={bannerImage} />
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          ) : !posts?.length ? (
            <NewsEmpty />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <NewsCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={formatDate(post.publishedAt)}
                  category={post.category}
                  imageSrc={post.imageSrc || heroImage}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
