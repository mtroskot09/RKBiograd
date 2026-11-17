@props(['title', 'subtitle', 'image' => null, 'stats' => []])
@php
    $statItems = array_filter([
        ['icon' => 'calendar', 'label' => 'Sljedeća utakmica', 'value' => $stats['next_match'] ?? null],
        ['icon' => 'trophy', 'label' => 'Pozicija', 'value' => $stats['position'] ?? null],
        ['icon' => 'trending-up', 'label' => 'Forma', 'value' => $stats['form'] ?? null],
    ], fn ($s) => $s['value']);
@endphp
{{-- min-height instead of a fixed height, so the title is never cut off on small phones --}}
<section class="relative w-full overflow-hidden rounded-2xl bg-brand-gradient shadow-xl shadow-primary/20 min-h-[480px] lg:min-h-[600px] flex">
    @if ($image)
        <div class="absolute inset-0 bg-cover bg-center scale-105" style="background-image: url('{{ $image }}')" aria-hidden="true"></div>
    @endif
    <div class="absolute inset-0 bg-gradient-to-t from-night via-primary/85 to-[hsl(218_85%_32%/0.45)]"></div>
    <div class="absolute inset-x-0 bottom-0 h-1.5 bg-accent"></div>

    <div class="relative w-full flex flex-col justify-end gap-6 p-6 pt-16 md:p-12">
        <div>
            <p class="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent ring-1 ring-accent/40">
                RK Biograd · Rukometni klub
            </p>
            <h1 class="font-display text-5xl sm:text-6xl lg:text-8xl font-extrabold uppercase leading-[0.95] text-white drop-shadow-lg">{{ $title }}</h1>
            <p class="mt-4 text-base md:text-xl text-white/85 max-w-2xl">{{ $subtitle }}</p>
        </div>

        @if ($statItems)
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
                @foreach ($statItems as $stat)
                    <div class="rounded-xl bg-white/10 backdrop-blur-md p-4 ring-1 ring-white/20">
                        <div class="flex items-center gap-2 text-xs uppercase tracking-wider text-accent mb-1">
                            <x-icon :name="$stat['icon']" />
                            <span>{{ $stat['label'] }}</span>
                        </div>
                        <div class="text-white font-semibold">{{ $stat['value'] }}</div>
                    </div>
                @endforeach
            </div>
        @endif

        <div class="flex flex-col sm:flex-row gap-3">
            <a href="/first-team" class="btn btn-accent btn-lg rounded-full">Pogledaj momčad</a>
            <a href="/contact" class="btn btn-lg rounded-full bg-white/10 backdrop-blur-md border border-white/40 text-white hover:bg-white/20">Kontaktiraj nas</a>
        </div>
    </div>
</section>
