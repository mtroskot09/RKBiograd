@props(['match'])
@use('App\Support\Croatian')
@php
    $status = [
        'live' => ['Uživo', 'bg-accent text-accent-foreground animate-pulse'],
        'finished' => ['Završeno', 'bg-secondary text-secondary-foreground'],
        'postponed' => ['Odgođeno', 'border border-border text-muted-foreground'],
        'upcoming' => ['Predstoji', 'bg-primary text-primary-foreground'],
    ][$match['status']];
    $time = Croatian::matchTime($match['starts_at']);
    $location = implode(', ', array_filter([$match['venue'], $match['city']]));
    $hasDetails = in_array($match['status'], ['finished', 'live'], true);
    $hasScore = $match['home_score'] !== null && $match['away_score'] !== null;

    // The winning side is shown in dark blue, the losing side greyed out.
    $scoreClass = function (bool $home) use ($match, $hasScore) {
        if (! $hasScore || $match['home_score'] === $match['away_score']) {
            return 'text-foreground';
        }
        $won = $home ? $match['home_score'] > $match['away_score'] : $match['away_score'] > $match['home_score'];

        return $won ? 'text-primary' : 'text-muted-foreground';
    };
    $tag = $hasDetails ? 'a' : 'div';
@endphp
<{{ $tag }} @if ($hasDetails) href="/utakmica/{{ $match['id'] }}" @endif
    class="card block h-full overflow-hidden {{ $hasDetails ? 'card-hover' : '' }}">
    <div class="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b bg-muted/50">
        <div class="min-w-0">
            <div class="text-xs font-semibold uppercase tracking-wider text-primary truncate">{{ $match['competition'] }}</div>
            @if ($match['round'] !== null && ! $match['is_cup'])
                <div class="text-xs text-muted-foreground">{{ $match['round'] }}. kolo</div>
            @endif
        </div>
        <span class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider {{ $status[1] }}">{{ $status[0] }}</span>
    </div>

    <div class="px-4 sm:px-5 py-5">
        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
            @foreach ([true, false] as $home)
                @if (! $home)
                    <div class="text-center px-1">
                        @if ($hasScore)
                            <div class="font-display text-4xl sm:text-5xl font-extrabold tabular-nums leading-none">
                                <span class="{{ $scoreClass(true) }}">{{ $match['home_score'] }}</span><span class="mx-1 text-muted-foreground">:</span><span class="{{ $scoreClass(false) }}">{{ $match['away_score'] }}</span>
                            </div>
                            @if ($match['home_half_time'] !== null && $match['away_half_time'] !== null)
                                <div class="mt-1 text-xs text-muted-foreground">({{ $match['home_half_time'] }}:{{ $match['away_half_time'] }})</div>
                            @endif
                        @else
                            <div class="font-display text-2xl font-bold text-accent-strong">VS</div>
                        @endif
                    </div>
                @endif
                @php
                    $name = $home ? $match['home_team'] : $match['away_team'];
                    $isOurs = $home === $match['is_home'];
                @endphp
                <div class="flex flex-col items-center gap-2 text-center min-w-0">
                    <x-team-logo :src="$home ? $match['home_logo_url'] : $match['away_logo_url']" :name="$name" class="h-12 w-12 sm:h-14 sm:w-14" />
                    <div class="text-sm sm:text-base font-semibold leading-tight break-words {{ $isOurs ? 'text-primary' : '' }}">{{ $name }}</div>
                </div>
            @endforeach
        </div>

        <div class="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground">
            <span class="inline-flex items-center gap-1">
                <x-icon name="calendar" class="h-4 w-4 text-accent" />
                {{ Croatian::matchDate($match['starts_at']) }}{{ $time ? " · $time" : '' }}
            </span>
            @if ($location)
                <span class="inline-flex items-center gap-1 text-center">
                    <x-icon name="map-pin" class="h-4 w-4 text-accent" />
                    {{ $location }}
                </span>
            @endif
        </div>
    </div>

    @if ($hasDetails)
        <div class="flex items-center justify-center gap-1 border-t py-2 text-xs font-semibold uppercase tracking-wider text-primary">
            Detalji utakmice
            <x-icon name="chevron-right" class="h-4 w-4" />
        </div>
    @endif
</{{ $tag }}>
