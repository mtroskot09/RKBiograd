@props(['title', 'matches', 'empty' => ''])
{{-- A season has 20+ matches, so only the first few are shown until "Prikaži sve" is pressed (keeps the page short on phones). --}}
@php($initial = 6)
<section x-data="{ showAll: false }">
    <h2 class="section-title mb-6">{{ $title }}</h2>
    @if (count($matches) === 0)
        <p class="text-muted-foreground">{{ $empty }}</p>
    @else
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @foreach ($matches as $match)
                <div @if ($loop->index >= $initial) x-show="showAll" x-cloak @endif>
                    <x-fixture-card :match="$match" />
                </div>
            @endforeach
        </div>
        @if (count($matches) > $initial)
            <div class="mt-6 text-center">
                <button type="button" class="btn btn-outline rounded-full px-6 border-primary/30 text-primary" @click="showAll = !showAll">
                    <span x-text="showAll ? 'Prikaži manje' : 'Prikaži sve ({{ count($matches) }})'">Prikaži sve ({{ count($matches) }})</span>
                    <x-icon name="chevron-down" class="h-4 w-4 transition-transform" x-bind:class="showAll && 'rotate-180'" />
                </button>
            </div>
        @endif
    @endif
</section>
