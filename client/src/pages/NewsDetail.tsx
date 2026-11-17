import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post } from "@shared/schema";
import { formatDate } from "@/lib/hrsFormat";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, isError } = useQuery<Post>({
    // Shares the "/api/posts" prefix so admin edits invalidate it too.
    queryKey: ["/api/posts", id],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/news">
            <Button variant="ghost" className="mb-6" data-testid="button-back-news">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Sve vijesti
            </Button>
          </Link>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : isError || !post ? (
            <Card className="p-6">
              <p className="font-medium">Vijest nije pronađena.</p>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              {post.imageSrc && (
                <img src={post.imageSrc} alt={post.title} className="w-full object-cover aspect-[16/9] max-h-[30rem]" />
              )}
              <div className="p-5 sm:p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                  <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-foreground">
                    {post.category}
                  </span>
                  <span className="flex items-center text-xs font-medium uppercase tracking-wider">
                    <Calendar className="h-4 w-4 mr-1 text-accent" />
                    {formatDate(post.publishedAt)}
                  </span>
                </div>
                <h1
                  className="font-display text-4xl md:text-6xl font-extrabold uppercase leading-[0.95] text-primary mb-6"
                  data-testid="text-post-title"
                >
                  {post.title}
                </h1>
                <p className="text-lg md:text-xl font-medium text-foreground/80 border-l-4 border-accent pl-4 mb-8">
                  {post.excerpt}
                </p>
                {/* Plain text: keep the line breaks the author typed. */}
                <div className="whitespace-pre-line text-base md:text-lg leading-relaxed" data-testid="text-post-content">
                  {post.content}
                </div>
              </div>
            </Card>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
