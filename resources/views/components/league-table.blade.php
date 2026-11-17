@props(['rows', 'title' => 'Ljestvica', 'sourceUrl' => null])
<div class="card p-4 sm:p-6 overflow-hidden">
    <h2 class="card-title">{{ $title }}</h2>
    <div class="overflow-x-auto -mx-4 sm:mx-0">
        <table class="data-table w-full">
            <thead>
                <tr class="border-b bg-muted/60">
                    <th class="text-left pl-4 sm:pl-3 w-10">#</th>
                    <th class="text-left">Ekipa</th>
                    <th class="text-center">O</th>
                    <th class="text-center hidden md:table-cell">P</th>
                    <th class="text-center hidden md:table-cell">N</th>
                    <th class="text-center hidden md:table-cell">I</th>
                    <th class="text-center hidden lg:table-cell">DG</th>
                    <th class="text-center hidden lg:table-cell">PG</th>
                    <th class="text-center hidden sm:table-cell">GR</th>
                    <th class="text-center pr-4 sm:pr-3">B</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($rows as $team)
                    <tr class="border-b last:border-b-0 transition-colors {{ $team['is_our_team'] ? 'bg-accent/15 font-semibold' : 'hover:bg-muted/50' }}">
                        <td class="pl-4 sm:pl-3 {{ $team['is_our_team'] ? 'border-l-4 border-accent' : '' }}">
                            <span class="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold {{ $team['is_our_team'] ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground' }}">{{ $team['position'] }}</span>
                        </td>
                        <td>
                            <div class="flex items-center gap-2 min-w-0">
                                <x-team-logo :src="$team['logo_url']" :name="$team['team']" class="h-7 w-7" />
                                <span class="truncate {{ $team['is_our_team'] ? 'text-primary' : '' }}">{{ $team['team'] }}</span>
                            </div>
                        </td>
                        <td class="num">{{ $team['played'] }}</td>
                        <td class="num hidden md:table-cell">{{ $team['won'] }}</td>
                        <td class="num hidden md:table-cell">{{ $team['draw'] }}</td>
                        <td class="num hidden md:table-cell">{{ $team['lost'] }}</td>
                        <td class="num hidden lg:table-cell">{{ $team['goals_for'] }}</td>
                        <td class="num hidden lg:table-cell">{{ $team['goals_against'] }}</td>
                        <td class="num hidden sm:table-cell {{ $team['goal_diff'] > 0 ? 'text-primary font-semibold' : ($team['goal_diff'] < 0 ? 'text-muted-foreground' : '') }}">{{ $team['goal_diff'] > 0 ? '+' : '' }}{{ $team['goal_diff'] }}</td>
                        <td class="num font-bold text-primary pr-4 sm:pr-3">{{ $team['points'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <div class="mt-4 text-xs text-muted-foreground">
        O = Odigrano | P = Pobjeda | N = Neriješeno | I = Izgubljeno | DG = Dani golovi | PG = Primljeni golovi | GR = Gol razlika | B = Bodovi
    </div>
    <div class="mt-2 text-xs text-muted-foreground">
        Izvor:
        @if ($sourceUrl)
            <a href="{{ $sourceUrl }}" target="_blank" rel="noreferrer" class="underline hover:text-primary">Hrvatski rukometni savez</a>
        @else
            Hrvatski rukometni savez
        @endif
    </div>
</div>
