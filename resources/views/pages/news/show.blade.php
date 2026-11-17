<x-layouts.app :title="$post->title" :description="$post->excerpt">
    <article class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <a href="/news" class="btn btn-ghost mb-6">
            <x-icon name="arrow-left" class="h-4 w-4" />
            Sve vijesti
        </a>

        <div class="card overflow-hidden">
            @if ($post->image_src)
                <img src="{{ $post->image_src }}" alt="{{ $post->title }}" class="w-full object-cover aspect-[16/9] max-h-[30rem]">
            @endif
            <div class="p-5 sm:p-8 md:p-10">
                <div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span class="badge bg-accent text-accent-foreground">{{ $post->category }}</span>
                    <span class="flex items-center text-xs font-medium uppercase tracking-wider">
                        <x-icon name="calendar" class="h-4 w-4 mr-1 text-accent" />
                        {{ \App\Support\Croatian::date($post->published_at) }}
                    </span>
                </div>
                <h1 class="font-display text-4xl md:text-6xl font-extrabold uppercase leading-[0.95] text-primary mb-6">{{ $post->title }}</h1>
                <p class="text-lg md:text-xl font-medium text-foreground/80 border-l-4 border-accent pl-4 mb-8">{{ $post->excerpt }}</p>
                {{-- Plain text: keep the line breaks the author typed. --}}
                <div class="whitespace-pre-line text-base md:text-lg leading-relaxed">{{ $post->content }}</div>
            </div>
        </div>
    </article>
</x-layouts.app>
