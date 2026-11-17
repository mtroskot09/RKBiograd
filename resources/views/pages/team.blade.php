@php
    $ourRow = collect($standings[0]['rows'] ?? [])->firstWhere('is_our_team', true);
@endphp
<x-layouts.app :title="$title">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <x-page-banner :title="$title" :eyebrow="$page['eyebrow']" :subtitle="$page['subtitle']" :image="$banner" />

        @if ($team === 'senior')
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div class="card p-6">
                    <h2 class="card-title">O momčadi</h2>
                    <p class="text-muted-foreground mb-4">Seniorska ekipa RK Biograd trenutno se natječe u 2. HRL Jug ligi.</p>
                    <x-team-season-stats :row="$ourRow" />
                </div>

                <div class="card p-6">
                    <h2 class="card-title">Trenerski stožer</h2>
                    <x-team-staff :staff="$staff" />
                </div>

                @if ($trainings->isNotEmpty())
                    <div class="card p-6">
                        <h2 class="card-title">Treninzi</h2>
                        <x-team-trainings :sessions="$trainings" />
                    </div>
                @endif
            </div>

            <x-team-hrs-section :matches="$matches" :standings="$standings" :players="$players" />
        @else
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="card p-6">
                    <h2 class="card-title">O ekipi</h2>
                    @if ($team === 'u15')
                        <p class="text-muted-foreground mb-4">
                            U15 selekcija RK Biograd je temelj budućnosti našeg kluba. Mladi igrači razvijaju vještine,
                            timski duh i ljubav prema rukometu pod vodstvom iskusnog stručnog tima.
                        </p>
                        <p class="text-muted-foreground">
                            Natječemo se u 1. HRL U15 ligi gdje pokazujemo odlične rezultate i kontinuirani napredak.
                        </p>
                    @else
                        <p class="text-muted-foreground mb-4">
                            U13 ekipa je naš najmlađi kadar koji već pokazuje veliki potencijal. Fokus je na
                            razvoju osnovnih rukometnih vještina, fair play i timskom duhu.
                        </p>
                        <p class="text-muted-foreground">
                            Mladi igrači uče od najboljih i polako grade temelje za budućnost u RK Biograd.
                        </p>
                    @endif
                    <x-team-season-stats :row="$ourRow" />
                </div>

                <div class="card p-6">
                    <h2 class="card-title">Treninzi</h2>
                    <x-team-trainings :sessions="$trainings" />
                    <x-team-staff :staff="$staff" variant="compact" />
                </div>
            </div>

            <section class="mt-12">
                <x-team-hrs-section :matches="$matches" :standings="$standings" :players="$players" />
            </section>

            @if ($team === 'u13')
                <section class="mt-8">
                    <div class="card p-6">
                        <h2 class="card-title">Pridruži se ekipi!</h2>
                        <p class="text-muted-foreground mb-4">
                            Tražimo nove talente! Ako voliš rukomet i imaš 12-13 godina, pridruži se našoj ekipi.
                        </p>
                        <p class="text-sm text-muted-foreground">
                            Za više informacija <a href="/contact" class="underline hover:text-primary">kontaktirajte nas</a>
                            ili dođite na trening u Sportsku dvoranu Biograd.
                        </p>
                    </div>
                </section>
            @endif
        @endif
    </div>
</x-layouts.app>
