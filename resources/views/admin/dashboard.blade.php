@php
    $user = auth()->user();
    $sections = [
        ['admin.posts.index', 'Vijesti', 'Pisanje i uređivanje vijesti', 'Otvori vijesti'],
        ['admin.staff', 'Stručni stožer', 'Treneri po ekipama i njihove uloge', 'Otvori stručni stožer'],
        ['admin.trainings', 'Raspored treninga', 'Tjedni termini treninga za svaku ekipu', 'Otvori raspored treninga'],
        ['admin.club-info', 'Kontakt podaci', 'Telefon, e-mail, adresa i radno vrijeme', 'Otvori kontakt podatke'],
        ['admin.history', 'Povijest', 'Tekstovi, ključni događaji i galerija fotografija', 'Otvori povijest'],
        ['admin.banners', 'Naslovne slike', 'Pozadinske slike na vrhu stranica', 'Otvori naslovne slike'],
        ['admin.email-preview', 'E-mail predložak', 'Izgled e-mailova kluba s grbom (pregled s primjerom teksta)', 'Pogledaj predložak'],
    ];
@endphp
<x-layouts.admin title="Administracija" :subtitle="'Dobro došli, '.$user->name" :back="false">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="card p-6">
            <div class="flex items-center justify-between text-sm font-medium">
                Objavljene vijesti <x-icon name="file-text" class="h-4 w-4 text-muted-foreground" />
            </div>
            <div class="mt-2 text-2xl font-bold">{{ $postCount }}</div>
            <p class="text-xs text-muted-foreground">Vijesti i novosti</p>
        </div>
        <div class="card p-6">
            <div class="flex items-center justify-between text-sm font-medium">
                Račun <x-icon name="user" class="h-4 w-4 text-muted-foreground" />
            </div>
            <div class="mt-2 text-sm font-medium">{{ $user->email }}</div>
            <p class="text-xs text-muted-foreground">Administrator</p>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @foreach ($sections as [$route, $title, $description, $button])
            <div class="card p-6 flex flex-col">
                <h2 class="text-xl font-semibold">{{ $title }}</h2>
                <p class="mt-1 mb-6 flex-1 text-sm text-muted-foreground">{{ $description }}</p>
                <a href="{{ route($route) }}" class="btn btn-primary w-full" @if ($route === 'admin.email-preview') target="_blank" @endif>{{ $button }}</a>
            </div>
        @endforeach

        <div class="card p-6">
            <h2 class="flex items-center gap-2 text-xl font-semibold">
                <x-icon name="refresh-cw" class="h-4 w-4" /> Rezultati i ljestvice
            </h2>
            <p class="mt-1 mb-4 text-sm text-muted-foreground">
                Utakmice, ljestvice i statistika igrača automatski se preuzimaju s HRS-a (sezona {{ config('hrs.season') }}).
                Natjecanja za novu sezonu upisuje programer (config/hrs.php).
            </p>
            <ul class="space-y-2 text-sm">
                @foreach ($hrsTeams as $team)
                    @foreach ($team['competitions'] as $c)
                        <li class="flex justify-between gap-4">
                            <span class="font-medium">{{ $team['label'] }}</span>
                            <a href="{{ $c['hrs_url'] }}" target="_blank" rel="noreferrer" class="underline text-muted-foreground text-right">{{ $c['name'] }}</a>
                        </li>
                    @endforeach
                @endforeach
            </ul>
        </div>
    </div>
</x-layouts.admin>
