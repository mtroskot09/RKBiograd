<x-layouts.app title="Vijesti">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <x-page-banner title="Vijesti" eyebrow="RK Biograd" subtitle="Novosti, izvještaji s utakmica i sve iz života kluba." :image="$banner" />

        @if ($posts->isEmpty())
            <x-news-empty />
        @else
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach ($posts as $post)
                    <x-news-card :post="$post" />
                @endforeach
            </div>
        @endif
    </div>
</x-layouts.app>
