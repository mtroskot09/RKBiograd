@use('App\Support\Croatian')
@php
    $match = $detail['match'] ?? null;
    $eventLabels = ['goal' => 'Gol', 'suspension' => 'Isključenje 2\'', 'yellow' => 'Žuti karton', 'timeout' => 'Time-out'];
@endphp
<x-layouts.app :title="$match ? $match['home_team'].' – '.$match['away_team'] : 'Utakmica'">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <button type="button" class="btn btn-ghost" onclick="history.length > 1 ? history.back() : location.assign('/')">
            <x-icon name="arrow-left" class="h-4 w-4" />
            Natrag
        </button>

        @if (! $match)
            <x-hrs-unavailable what="Podaci o utakmici" />
        @else
            @php
                $time = Croatian::matchTime($match['starts_at']);
                $location = implode(', ', array_filter([$match['venue'], $match['city']]));
                $hasScore = $match['home_score'] !== null && $match['away_score'] !== null;
            @endphp
            <section class="relative overflow-hidden rounded-2xl bg-brand-gradient text-white shadow-xl shadow-primary/20 p-5 sm:p-8 md:p-10">
                <img src="/images/rk-biograd-logo-192.png" alt="" aria-hidden="true" class="absolute -right-8 -top-8 h-56 w-auto opacity-[0.07] rotate-12">
                <div class="absolute inset-x-0 bottom-0 h-1.5 bg-accent"></div>

                <div class="relative flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-8">
                    <span>{{ $match['competition'] }}{{ $match['round'] !== null && ! $match['is_cup'] ? " · {$match['round']}. kolo" : '' }}</span>
                    @if ($match['status'] === 'live')
                        <span class="rounded-full bg-accent px-2.5 py-1 text-[11px] text-accent-foreground animate-pulse">Uživo</span>
                    @endif
                </div>

                <div class="relative grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-6">
                    <div class="flex flex-col items-center gap-3 text-center min-w-0">
                        <div class="rounded-full bg-white p-2 shadow-lg">
                            <x-team-logo :src="$match['home_logo_url']" :name="$match['home_team']" class="h-14 w-14 md:h-20 md:w-20" />
                        </div>
                        <h1 class="font-display text-xl md:text-3xl font-bold uppercase leading-tight break-words">{{ $match['home_team'] }}</h1>
                    </div>
                    <div class="text-center">
                        @if ($hasScore)
                            <div class="font-display text-5xl sm:text-6xl md:text-8xl font-extrabold tabular-nums leading-none">
                                {{ $match['home_score'] }}<span class="mx-1 text-accent">:</span>{{ $match['away_score'] }}
                            </div>
                            @if ($match['home_half_time'] !== null && $match['away_half_time'] !== null)
                                <div class="mt-2 text-xs sm:text-sm text-white/70">Poluvrijeme {{ $match['home_half_time'] }}:{{ $match['away_half_time'] }}</div>
                            @endif
                        @else
                            <div class="font-display text-4xl font-bold text-accent">VS</div>
                        @endif
                    </div>
                    <div class="flex flex-col items-center gap-3 text-center min-w-0">
                        <div class="rounded-full bg-white p-2 shadow-lg">
                            <x-team-logo :src="$match['away_logo_url']" :name="$match['away_team']" class="h-14 w-14 md:h-20 md:w-20" />
                        </div>
                        <h2 class="font-display text-xl md:text-3xl font-bold uppercase leading-tight break-words">{{ $match['away_team'] }}</h2>
                    </div>
                </div>

                <div class="relative flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80 mt-8">
                    <span class="flex items-center gap-1">
                        <x-icon name="calendar" class="h-4 w-4 text-accent" />
                        {{ Croatian::matchDate($match['starts_at']) }}{{ $time ? " · $time" : '' }}
                    </span>
                    @if ($location)
                        <span class="flex items-center gap-1">
                            <x-icon name="map-pin" class="h-4 w-4 text-accent" />
                            {{ $location }}
                        </span>
                    @endif
                    <a href="{{ $detail['hrs_url'] }}" target="_blank" rel="noreferrer" class="flex items-center gap-1 underline hover:text-accent">
                        Zapisnik na HRS-u
                        <x-icon name="external-link" class="h-3 w-3" />
                    </a>
                </div>
            </section>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                @foreach ([$match['home_team'] => $detail['home'], $match['away_team'] => $detail['away']] as $teamName => $players)
                    @php($showSaves = collect($players)->contains(fn ($p) => $p['saves_attempts'] > 0))
                    <div class="card p-6">
                        <h2 class="card-title">{{ $teamName }}</h2>
                        @if (! $players)
                            <p class="text-muted-foreground">Sastav nije objavljen.</p>
                        @else
                            <div class="overflow-x-auto">
                                <table class="data-table w-full">
                                    <thead>
                                        <tr class="border-b bg-muted/60">
                                            <th class="text-left">#</th>
                                            <th class="text-left">Igrač</th>
                                            <th class="text-center">Golovi</th>
                                            <th class="text-center hidden sm:table-cell">7m</th>
                                            @if ($showSaves)<th class="text-center">Obrane</th>@endif
                                            <th class="text-center hidden sm:table-cell">Ž</th>
                                            <th class="text-center hidden sm:table-cell">2'</th>
                                            <th class="text-center hidden sm:table-cell">C</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach ($players as $p)
                                            <tr class="border-b">
                                                <td class="tabular-nums text-muted-foreground">{{ $p['shirt_number'] }}</td>
                                                <td>{{ $p['first_name'] }} {{ $p['last_name'] }}</td>
                                                <td class="num font-bold">{{ $p['goals'] }}</td>
                                                <td class="num hidden sm:table-cell">{{ $p['seven_meter_shots'] > 0 ? "{$p['seven_meter_goals']}/{$p['seven_meter_shots']}" : '' }}</td>
                                                @if ($showSaves)
                                                    <td class="num">{{ $p['saves_attempts'] > 0 ? "{$p['saves']}/{$p['saves_attempts']}" : '' }}</td>
                                                @endif
                                                <td class="num hidden sm:table-cell">{{ $p['yellow_cards'] ?: '' }}</td>
                                                <td class="num hidden sm:table-cell">{{ $p['suspensions'] ?: '' }}</td>
                                                <td class="num hidden sm:table-cell">{{ $p['red_cards'] ?: '' }}</td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>

            @php($events = array_reverse(array_filter($detail['events'], fn ($e) => isset($eventLabels[$e['type']]))))
            @if ($events)
                <div class="card p-6">
                    <h2 class="card-title">Tijek utakmice</h2>
                    <ol class="divide-y">
                        @foreach ($events as $e)
                            <li class="flex items-center gap-3 py-2 text-sm {{ $e['side'] === 'away' ? 'flex-row-reverse text-right' : '' }}">
                                <span class="tabular-nums text-muted-foreground w-12 shrink-0">{{ $e['time'] }}</span>
                                <span class="{{ $e['type'] === 'goal' ? 'rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground' : 'rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground' }}">
                                    {{ $eventLabels[$e['type']] }}{{ $e['type'] === 'goal' && $e['home_score'] !== null ? " {$e['home_score']}:{$e['away_score']}" : '' }}
                                </span>
                                <span class="text-muted-foreground truncate">{{ $e['player'] ?? ($e['side'] === 'home' ? $match['home_team'] : $match['away_team']) }}</span>
                            </li>
                        @endforeach
                    </ol>
                </div>
            @endif
        @endif
    </div>
</x-layouts.app>
