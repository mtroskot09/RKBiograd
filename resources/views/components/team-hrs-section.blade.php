@props(['matches', 'standings', 'players'])
{{-- Matches, standings and player stats of one team, all live from HRS. null = HRS unavailable. --}}
<div x-data="{ tab: 'matches' }">
    <div class="mb-8 grid w-full grid-cols-3 sm:inline-flex sm:w-auto rounded-lg bg-muted p-1" role="tablist">
        @foreach (['matches' => 'Utakmice', 'table' => 'Ljestvica', 'players' => 'Igrači'] as $key => $label)
            <button type="button" role="tab" @click="tab = '{{ $key }}'" :aria-selected="tab === '{{ $key }}'"
                    class="rounded-md px-5 py-2 text-sm font-semibold uppercase tracking-wide transition-colors"
                    :class="tab === '{{ $key }}' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'">
                {{ $label }}
            </button>
        @endforeach
    </div>

    <div x-show="tab === 'matches'" class="space-y-12">
        @if ($matches === null)
            <x-hrs-unavailable what="Utakmice" />
        @else
            <x-match-list title="Sljedeće utakmice" :matches="$matches['upcoming']" empty="Nema predstojećih utakmica." />
            <x-match-list title="Rezultati" :matches="$matches['results']" empty="Još nema odigranih utakmica." />
            @if ($matches['postponed'])
                <x-match-list title="Odgođene utakmice" :matches="$matches['postponed']" />
            @endif
        @endif
    </div>

    <div x-show="tab === 'table'" x-cloak class="space-y-8">
        @forelse ($standings ?? [] as $table)
            <x-league-table :rows="$table['rows']" :title="$table['competition']['name']" :source-url="$table['competition']['hrs_url']" />
        @empty
            <x-hrs-unavailable what="Ljestvica i rezultati" />
        @endforelse
    </div>

    <div x-show="tab === 'players'" x-cloak>
        @if ($players === null)
            <x-hrs-unavailable what="Statistika igrača" />
        @elseif ($players)
            <x-player-stats-table :players="$players" />
        @else
            <p class="text-muted-foreground">Statistika igrača još nije dostupna.</p>
        @endif
    </div>
</div>
