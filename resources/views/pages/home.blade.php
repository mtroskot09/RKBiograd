<x-layouts.app>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <x-hero :title="config('club.motto')"
                subtitle="Pratite našu putanju kroz sezonu. Pobjede, timski duh i nevjerojatna podrška navijača."
                :image="$banner" :stats="$stats" />

        <section class="mt-16">
            <div class="flex items-center justify-between gap-4 mb-8">
                <h2 class="section-title">Najnovije vijesti</h2>
                @if ($posts->isNotEmpty())
                    <a href="/news" class="btn btn-outline">Sve vijesti</a>
                @endif
            </div>
            @if ($posts->isEmpty())
                <x-news-empty />
            @else
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    @foreach ($posts as $post)
                        <x-news-card :post="$post" />
                    @endforeach
                </div>
            @endif
        </section>

        <section class="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-12">
                <div>
                    <h2 class="section-title mb-8">Sljedeće utakmice</h2>
                    @if ($matches === null)
                        <x-hrs-unavailable what="Utakmice" />
                    @elseif (! $nextMatches)
                        <p class="text-muted-foreground">Nema predstojećih utakmica.</p>
                    @else
                        <div class="space-y-4">
                            @foreach ($nextMatches as $match)
                                <x-fixture-card :match="$match" />
                            @endforeach
                        </div>
                    @endif
                </div>

                @if ($lastResult)
                    <div>
                        <h2 class="section-title mb-8">Zadnji rezultat</h2>
                        <x-fixture-card :match="$lastResult" />
                    </div>
                @endif
            </div>

            <div>
                @if ($league && $league['rows'])
                    <x-league-table :rows="$league['rows']" :title="$league['competition']['name'].' - Ljestvica'" :source-url="$league['competition']['hrs_url']" />
                @else
                    <x-hrs-unavailable what="Ljestvica i rezultati" />
                @endif
            </div>
        </section>
    </div>
</x-layouts.app>
