@props(['sessions'])
{{-- Weekly training times of a team as set in Admin → Raspored treninga. --}}
@if ($sessions->isEmpty())
    <p class="text-muted-foreground">Raspored treninga još nije objavljen.</p>
@else
    <div class="space-y-3">
        @foreach ($sessions as $s)
            <div class="flex items-center justify-between gap-4 p-3 rounded-xl bg-secondary/70 border-l-4 border-accent">
                <span class="font-semibold text-primary">{{ $s->day_name }}</span>
                <span class="tabular-nums text-foreground text-right">
                    {{ $s->start_time }} - {{ $s->end_time }}
                    @if ($s->location)
                        <span class="block text-xs text-muted-foreground">{{ $s->location }}</span>
                    @endif
                </span>
            </div>
        @endforeach
    </div>
@endif
