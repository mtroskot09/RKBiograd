@props(['staff', 'variant' => 'list'])
{{-- Coaching staff of a team as set in Admin → Stručni stožer (already sorted by role).
     "list": avatars with names (Prva ekipa); "compact": short highlighted box (youth teams). --}}
@if ($staff->isEmpty())
    @if ($variant === 'list')
        <p class="text-muted-foreground">Stručni stožer još nije objavljen.</p>
    @else
        <div class="mt-4 p-4 rounded-xl bg-secondary/70 ring-1 ring-accent/20 text-sm text-muted-foreground">Stručni stožer još nije objavljen.</div>
    @endif
@elseif ($variant === 'compact')
    <div class="mt-4 p-4 rounded-xl bg-secondary/70 ring-1 ring-accent/20 space-y-3">
        @foreach ($staff as $person)
            <div class="flex items-center gap-3">
                <x-coach-avatar :person="$person" class="h-10 w-10 text-sm" />
                <div class="text-sm leading-tight">
                    <div class="font-semibold text-primary">{{ $person->role }}</div>
                    <div>{{ $person->first_name }} {{ $person->last_name }}</div>
                </div>
            </div>
        @endforeach
    </div>
@else
    <div class="space-y-4">
        @foreach ($staff as $person)
            <div class="flex items-center gap-4">
                <x-coach-avatar :person="$person" class="h-16 w-16 text-xl" />
                <div>
                    <div class="font-semibold">{{ $person->first_name }} {{ $person->last_name }}</div>
                    <div class="text-xs font-semibold uppercase tracking-wider text-accent-strong">{{ $person->role }}</div>
                </div>
            </div>
        @endforeach
    </div>
@endif
