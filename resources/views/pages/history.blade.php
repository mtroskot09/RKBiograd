@php
    $statIcons = ['calendar', 'trophy', 'users', 'star'];
    // Written out in full so Tailwind generates these classes.
    $statColumns = [3 => 'lg:grid-cols-3', 4 => 'lg:grid-cols-4'][count($content->stats)] ?? '';
@endphp
<x-layouts.app title="Povijest">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" x-data="{ photo: null }" @keydown.escape.window="photo = null">
        <x-page-banner title="Povijest RK Biograd" eyebrow="Naš klub · od 1963." :subtitle="$content->intro" :image="$banner" />

        @if ($content->stats)
            <div class="grid grid-cols-1 sm:grid-cols-2 {{ $statColumns }} gap-4 md:gap-6 mb-14">
                @foreach ($content->stats as $i => $stat)
                    <div class="card card-hover p-6 text-center">
                        <x-icon :name="$statIcons[$i % 4]" class="h-14 w-14 p-3 rounded-full bg-secondary text-primary ring-2 ring-accent/40 mx-auto mb-4" />
                        <div class="font-display text-5xl font-extrabold text-primary leading-none mb-2">{{ $stat['value'] }}</div>
                        <div class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{{ $stat['label'] }}</div>
                    </div>
                @endforeach
            </div>
        @endif

        @if ($events->isNotEmpty())
            <section>
                <h2 class="section-title mb-8">Ključni događaji</h2>
                <ol class="space-y-6 sm:space-y-8">
                    @foreach ($events as $event)
                        <li class="relative pl-10 sm:pl-14">
                            {{-- Line from this dot's centre to the next dot's centre (same offset in the next item,
                                 one item height + the list gap further down), so it starts and ends at the dots. --}}
                            @unless ($loop->last)
                                <span class="absolute left-3 sm:left-4 w-1 bg-accent/40 top-[2.125rem] sm:top-[2.375rem] h-[calc(100%+1.5rem)] sm:h-[calc(100%+2rem)]" aria-hidden="true"></span>
                            @endunless
                            <span class="absolute left-0 top-5 h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-brand-gradient ring-4 ring-accent/30" aria-hidden="true"></span>
                            <div class="card card-hover overflow-hidden border-l-4 border-l-accent">
                                <div class="{{ $event->image_src ? 'grid md:grid-cols-[1fr_280px]' : '' }}">
                                    <div class="p-5 sm:p-6">
                                        <span class="inline-block rounded-full bg-primary px-3 py-1 font-display text-lg font-bold text-primary-foreground mb-3">{{ $event->year }}</span>
                                        <h3 class="font-display text-2xl font-bold uppercase text-primary mb-1">{{ $event->title }}</h3>
                                        @if ($event->description)
                                            <p class="text-muted-foreground whitespace-pre-line">{{ $event->description }}</p>
                                        @endif
                                    </div>
                                    @if ($event->image_src)
                                        <img src="{{ $event->image_src }}" alt="{{ $event->title }}" loading="lazy" class="h-56 md:h-full w-full object-cover">
                                    @endif
                                </div>
                            </div>
                        </li>
                    @endforeach
                </ol>
            </section>
        @endif

        @if ($photos->isNotEmpty())
            <section class="mt-14">
                <h2 class="section-title mb-8">Galerija</h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    @foreach ($photos as $photo)
                        <button type="button" class="group relative aspect-square overflow-hidden rounded-xl bg-muted shadow-sm"
                                @click="photo = @js(['src' => $photo->image_src, 'caption' => $photo->caption])">
                            <img src="{{ $photo->image_src }}" alt="{{ $photo->caption ?: 'Fotografija iz povijesti kluba' }}" loading="lazy"
                                 class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">
                            @if ($photo->caption)
                                <span class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/85 to-transparent p-2 pt-8 text-left text-xs sm:text-sm font-medium text-white line-clamp-2">{{ $photo->caption }}</span>
                            @endif
                        </button>
                    @endforeach
                </div>
            </section>
        @endif

        @if ($content->mission)
            <section class="mt-14">
                <div class="card p-6 sm:p-8 bg-secondary/60 border-accent/30">
                    <h2 class="card-title">Naša misija</h2>
                    <p class="text-muted-foreground whitespace-pre-line">{{ $content->mission }}</p>
                    <p class="mt-6 text-xl font-bold tracking-wide text-primary">{{ config('club.motto') }}</p>
                </div>
            </section>
        @endif

        {{-- Photo viewer --}}
        <div x-show="photo" x-cloak x-transition.opacity class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
             @click.self="photo = null" role="dialog" aria-modal="true">
            <figure class="relative w-full max-w-4xl overflow-hidden rounded-xl bg-night">
                <img :src="photo?.src" :alt="photo?.caption" class="max-h-[80vh] w-full object-contain">
                <figcaption x-show="photo?.caption" x-text="photo?.caption" class="p-4 text-center text-sm text-white/90"></figcaption>
                <button type="button" @click="photo = null" aria-label="Zatvori"
                        class="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70">
                    <x-icon name="x" class="h-5 w-5" />
                </button>
            </figure>
        </div>
    </div>
</x-layouts.app>
