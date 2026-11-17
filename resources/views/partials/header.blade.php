@php
    $items = [
        '/' => 'Početna',
        '/first-team' => 'Prva ekipa',
        '/u15' => 'U15',
        '/u13' => 'U13',
        '/news' => 'Vijesti',
        '/history' => 'Povijest',
        '/contact' => 'Kontakt',
    ];
    if (\App\Support\LocalAdmin::isAdmin(auth()->user())) {
        $items['/admin'] = 'Admin';
    }
    // "/news/abc" keeps "Vijesti" highlighted; "/" only matches the home page itself.
    $isActive = fn ($path) => $path === '/' ? request()->is('/') : request()->is(ltrim($path, '/'), ltrim($path, '/').'/*');
@endphp
<header class="sticky top-0 z-50 w-full bg-brand-gradient text-white shadow-lg shadow-primary/20" x-data="{ open: false }">
    <div class="h-1 w-full bg-accent"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 md:h-20 items-center justify-between gap-4">
            <a href="/" class="flex items-center gap-3 rounded-md -ml-1 px-1 py-1">
                <img src="/images/rk-biograd-logo-192.png" alt="RK Biograd grb" class="h-11 md:h-14 w-auto drop-shadow">
                <div class="leading-tight">
                    <div class="font-display text-xl md:text-2xl font-bold uppercase tracking-wide">RK Biograd</div>
                    <div class="text-[11px] md:text-xs uppercase tracking-[0.2em] text-accent">Rukometni klub</div>
                </div>
            </a>

            <nav class="hidden lg:flex items-center gap-1" aria-label="Glavna navigacija">
                @foreach ($items as $path => $label)
                    <a href="{{ $path }}" @if ($isActive($path)) aria-current="page" @endif
                       class="relative px-3 py-2 text-sm font-semibold uppercase tracking-wide rounded-md transition-colors {{ $isActive($path) ? 'text-accent' : 'text-white/85 hover:text-white hover:bg-white/10' }}">
                        {{ $label }}
                        @if ($isActive($path))
                            <span class="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-accent"></span>
                        @endif
                    </a>
                @endforeach
            </nav>

            <button type="button" class="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-white/10"
                    @click="open = !open" :aria-expanded="open" :aria-label="open ? 'Zatvori izbornik' : 'Otvori izbornik'" aria-label="Otvori izbornik">
                <x-icon name="menu" class="h-6 w-6" x-show="!open" />
                <x-icon name="x" class="h-6 w-6" x-show="open" x-cloak />
            </button>
        </div>
    </div>

    <nav class="lg:hidden border-t border-white/10 bg-primary/95 backdrop-blur" aria-label="Glavna navigacija" x-show="open" x-cloak>
        <div class="max-w-7xl mx-auto px-4 py-3 grid gap-1">
            @foreach ($items as $path => $label)
                <a href="{{ $path }}" @if ($isActive($path)) aria-current="page" @endif
                   class="flex items-center min-h-12 px-4 rounded-lg font-display text-xl font-semibold uppercase tracking-wide transition-colors {{ $isActive($path) ? 'bg-accent text-accent-foreground' : 'text-white hover:bg-white/10' }}">
                    {{ $label }}
                </a>
            @endforeach
        </div>
    </nav>
</header>
