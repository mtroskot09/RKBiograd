import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageSrc?: string;
}

export default function NewsCard({ id, title, excerpt, date, category, imageSrc }: NewsCardProps) {
  return (
    <Link href={`/news/${id}`}>
      <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer h-full flex flex-col" data-testid={`news-card-${id}`}>
        {imageSrc && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={imageSrc} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              {category}
            </Badge>
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Calendar className="h-4 w-4 mr-2" />
            {date}
          </div>
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h3>
          <p className="text-muted-foreground line-clamp-3 flex-1">{excerpt}</p>
        </div>
      </Card>
    </Link>
  );
}
