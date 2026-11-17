@props(['title', 'subtitle' => null, 'eyebrow' => null, 'image' => null])
{{-- Page header used at the top of team and content pages. Without an image it shows the club gradient with the crest. --}}
<section class="relative overflow-hidden rounded-2xl bg-brand-gradient shadow-xl shadow-primary/20 mb-10">
    @if ($image)
        <img src="{{ $image }}" alt="" class="absolute inset-0 h-full w-full object-cover" aria-hidden="true">
        <div class="absolute inset-0 bg-gradient-to-t from-night via-primary/75 to-[hsl(218_85%_32%/0.3)]"></div>
    @else
        <img src="/images/rk-biograd-logo-192.png" alt="" aria-hidden="true" class="absolute -right-6 -bottom-10 h-56 md:h-72 w-auto opacity-10 rotate-6">
    @endif
    <div class="absolute inset-x-0 bottom-0 h-1.5 bg-accent"></div>

    <div class="relative flex flex-col justify-end p-6 md:p-10 {{ $image ? 'min-h-56 md:min-h-72' : 'min-h-40 md:min-h-48' }}">
        @if ($eyebrow)
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">{{ $eyebrow }}</p>
        @endif
        <h1 class="font-display text-4xl md:text-6xl font-extrabold uppercase leading-none text-white">{{ $title }}</h1>
        @if ($subtitle)
            <p class="mt-3 max-w-3xl text-base md:text-lg text-white/85">{{ $subtitle }}</p>
        @endif
    </div>
</section>
