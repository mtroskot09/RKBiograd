@php
    $info = \App\Models\ClubInfo::current();
    $address = \App\Models\ClubInfo::lines($info->address);
    $links = [
        '/first-team' => 'Prva ekipa',
        '/u15' => 'U15',
        '/u13' => 'U13',
        '/news' => 'Vijesti',
        '/history' => 'Povijest kluba',
        '/contact' => 'Kontakt',
    ];
@endphp
<footer class="mt-20 bg-brand-gradient text-white">
    <div class="h-1 w-full bg-accent"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div class="sm:col-span-2 lg:col-span-1">
                <div class="flex items-center gap-4 mb-5">
                    <img src="/images/rk-biograd-logo-192.png" alt="RK Biograd grb" class="h-20 w-auto drop-shadow">
                    <div>
                        <div class="font-display text-2xl font-bold uppercase tracking-wide">RK Biograd</div>
                        <div class="text-sm text-white/70">Rukometni klub Biograd · od 1963.</div>
                    </div>
                </div>
                <p class="font-display text-2xl font-bold uppercase tracking-wide text-accent">{{ config('club.motto') }}</p>
                <p class="mt-1 text-sm text-white/70">Pratite našu putanju kroz sezonu.</p>
            </div>

            <div>
                <h3 class="font-display text-lg font-bold uppercase tracking-wider text-accent mb-4">Brzi linkovi</h3>
                <ul class="grid grid-cols-2 gap-x-4 gap-y-1">
                    @foreach ($links as $path => $label)
                        <li>
                            <a href="{{ $path }}" class="inline-flex min-h-10 items-center text-white/80 hover:text-accent transition-colors">{{ $label }}</a>
                        </li>
                    @endforeach
                </ul>
            </div>

            <div>
                <h3 class="font-display text-lg font-bold uppercase tracking-wider text-accent mb-4">Kontakt</h3>
                <div class="space-y-3 text-sm text-white/80">
                    @if ($address)
                        <div class="flex items-start gap-3">
                            <x-icon name="map-pin" class="h-4 w-4 mt-0.5 text-accent" />
                            <span>{{ implode(', ', $address) }}</span>
                        </div>
                    @endif
                    @if ($info->email)
                        <a href="mailto:{{ $info->email }}" class="flex items-center gap-3 hover:text-accent transition-colors">
                            <x-icon name="mail" class="h-4 w-4 text-accent" />
                            <span class="break-all">{{ $info->email }}</span>
                        </a>
                    @endif
                    @if ($info->phone)
                        <a href="{{ $info->phoneHref() }}" class="flex items-center gap-3 hover:text-accent transition-colors">
                            <x-icon name="phone" class="h-4 w-4 text-accent" />
                            <span>{{ $info->phone }}</span>
                        </a>
                    @endif
                    <div class="flex items-center gap-3 pt-2">
                        <a href="{{ config('club.facebook_url') }}" target="_blank" rel="noopener noreferrer" aria-label="RK Biograd na Facebooku"
                           class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-accent hover:text-accent-foreground transition-colors">
                            <x-icon name="facebook" class="h-5 w-5" />
                        </a>
                        <a href="{{ config('club.instagram_url') }}" target="_blank" rel="noopener noreferrer" aria-label="RK Biograd na Instagramu"
                           class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-accent hover:text-accent-foreground transition-colors">
                            <x-icon name="instagram" class="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="border-t border-white/15 mt-10 pt-6 text-center text-sm text-white/60">
            <p>&copy; {{ date('Y') }} RK Biograd. Sva prava pridržana.</p>
        </div>
    </div>
</footer>
