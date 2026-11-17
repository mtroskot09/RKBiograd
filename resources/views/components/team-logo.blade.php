@props(['src', 'name'])
{{-- Club logo from HRS; falls back to the team's initial when HRS has no logo. --}}
<span {{ $attributes->merge(['class' => 'relative inline-flex shrink-0 items-center justify-center']) }}>
    <img src="{{ $src }}" alt="" loading="lazy" class="h-full w-full object-contain"
         onerror="this.hidden = true; this.nextElementSibling.hidden = false">
    <span hidden class="h-full w-full rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-semibold" aria-hidden="true">{{ mb_substr($name, 0, 1) }}</span>
</span>
