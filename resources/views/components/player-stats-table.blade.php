@props(['players'])
<div class="card p-4 sm:p-6 overflow-hidden">
    <h2 class="card-title">Igrači</h2>
    <div class="overflow-x-auto -mx-4 sm:mx-0">
        <table class="data-table w-full">
            <thead>
                <tr class="border-b bg-muted/60">
                    <th class="text-left pl-4 sm:pl-3">Igrač</th>
                    <th class="text-center">Utk</th>
                    <th class="text-center">Golovi</th>
                    <th class="text-center hidden md:table-cell">7m</th>
                    <th class="text-center hidden md:table-cell">Ž</th>
                    <th class="text-center hidden md:table-cell">2'</th>
                    <th class="text-center hidden md:table-cell">C</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($players as $p)
                    <tr class="border-b last:border-b-0 hover:bg-muted/50">
                        <td class="pl-4 sm:pl-3">
                            <div class="flex items-center gap-3">
                                @if ($p['photo_url'])
                                    <img src="{{ $p['photo_url'] }}" alt="" loading="lazy" class="h-9 w-9 rounded-full object-cover shrink-0 ring-2 ring-accent/40">
                                @else
                                    <div class="h-9 w-9 rounded-full bg-secondary text-primary text-xs font-bold flex items-center justify-center shrink-0">
                                        {{ mb_substr($p['first_name'], 0, 1) }}{{ mb_substr($p['last_name'], 0, 1) }}
                                    </div>
                                @endif
                                <span class="font-medium">{{ $p['first_name'] }} {{ $p['last_name'] }}</span>
                                @if ($loop->first && $p['goals'] > 0)
                                    <span class="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">Strijelac</span>
                                @endif
                            </div>
                        </td>
                        <td class="num">{{ $p['matches'] }}</td>
                        <td class="num font-bold text-primary">{{ $p['goals'] }}</td>
                        <td class="num hidden md:table-cell">{{ $p['seven_meter_shots'] > 0 ? "{$p['seven_meter_goals']}/{$p['seven_meter_shots']}" : '–' }}</td>
                        <td class="num hidden md:table-cell">{{ $p['yellow_cards'] }}</td>
                        <td class="num hidden md:table-cell">{{ $p['suspensions'] }}</td>
                        <td class="num hidden md:table-cell">{{ $p['red_cards'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <div class="mt-4 text-xs text-muted-foreground">
        Utk = Utakmice | 7m = Sedmerci (golovi/pokušaji) | Ž = Žuti kartoni | 2' = Isključenja | C = Crveni kartoni
    </div>
    <div class="mt-2 text-xs text-muted-foreground">Izvor: Hrvatski rukometni savez</div>
</div>
