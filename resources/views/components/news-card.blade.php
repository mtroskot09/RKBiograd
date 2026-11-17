@props(['post'])
<a href="/news/{{ $post->id }}" class="card card-hover group h-full overflow-hidden flex flex-col">
    <div class="relative aspect-[16/10] overflow-hidden bg-brand-gradient">
        <img src="{{ $post->image_src ?: '/images/hero-match.png' }}" alt="{{ $post->title }}" loading="lazy"
             class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent"></div>
        <span class="badge absolute top-3 left-3 bg-accent text-accent-foreground">{{ $post->category }}</span>
    </div>
    <div class="p-5 flex-1 flex flex-col">
        <div class="flex items-center text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            <x-icon name="calendar" class="h-4 w-4 mr-2 text-accent" />
            {{ \App\Support\Croatian::date($post->published_at) }}
        </div>
        <h3 class="font-display text-2xl font-bold leading-tight text-primary mb-2 line-clamp-2">{{ $post->title }}</h3>
        <p class="text-muted-foreground line-clamp-3 flex-1">{{ $post->excerpt }}</p>
        <span class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Pročitaj više
            <x-icon name="arrow-right" class="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
    </div>
</a>
