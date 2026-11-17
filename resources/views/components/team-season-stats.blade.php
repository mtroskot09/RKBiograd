@props(['row'])
{{-- Position, points, wins and goal difference of our team in its (first) league table. --}}
@php
    $stats = [
        'Pozicija' => $row ? "{$row['position']}." : '–',
        'Bodova' => $row['points'] ?? '–',
        'Pobjeda' => $row['won'] ?? '–',
        'Gol razlika' => $row ? ($row['goal_diff'] > 0 ? '+' : '').$row['goal_diff'] : '–',
    ];
@endphp
<div class="grid grid-cols-2 gap-4 mt-6">
    @foreach ($stats as $label => $value)
        <div class="text-center p-4 rounded-xl bg-secondary/70 ring-1 ring-accent/20">
            <div class="font-display text-4xl font-extrabold text-primary tabular-nums">{{ $value }}</div>
            <div class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{{ $label }}</div>
        </div>
    @endforeach
</div>
