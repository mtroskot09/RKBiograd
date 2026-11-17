<x-layouts.admin title="Vijesti" subtitle="Vijesti se prikazuju na početnoj stranici i na stranici Vijesti.">
    <div class="mb-6">
        <a href="{{ route('admin.posts.create') }}" class="btn btn-primary"><x-icon name="plus" class="h-4 w-4" /> Nova vijest</a>
    </div>

    @if ($posts->isEmpty())
        <div class="card p-6 text-muted-foreground">Još nema vijesti.</div>
    @else
        <div class="space-y-4">
            @foreach ($posts as $post)
                <div class="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    @if ($post->image_src)
                        <img src="{{ $post->image_src }}" alt="" class="h-20 w-32 rounded-lg object-cover shrink-0">
                    @endif
                    <div class="flex-1 min-w-0">
                        <h2 class="font-semibold truncate">{{ $post->title }}</h2>
                        <div class="text-sm text-muted-foreground">
                            {{ $post->category }} · {{ $post->published_at->format('d.m.Y.') }}
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <a href="/news/{{ $post->id }}" target="_blank" class="btn btn-outline btn-sm">Pogledaj</a>
                        <a href="{{ route('admin.posts.edit', $post) }}" class="btn btn-outline btn-sm"><x-icon name="pencil" class="h-3.5 w-3.5" /> Uredi</a>
                        <form method="POST" action="{{ route('admin.posts.destroy', $post) }}" onsubmit="return confirm('Obrisati ovu vijest?')">
                            @csrf @method('DELETE')
                            <button class="btn btn-danger btn-sm" aria-label="Obriši"><x-icon name="trash" class="h-3.5 w-3.5" /></button>
                        </form>
                    </div>
                </div>
            @endforeach
        </div>
    @endif
</x-layouts.admin>
