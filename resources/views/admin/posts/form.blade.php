@php($editing = $post->exists)
<x-layouts.admin :title="$editing ? 'Uredi vijest' : 'Nova vijest'">
    <form method="POST" enctype="multipart/form-data" class="card p-6 space-y-5 max-w-3xl"
          action="{{ $editing ? route('admin.posts.update', $post) : route('admin.posts.store') }}">
        @csrf
        @if ($editing) @method('PUT') @endif

        <div>
            <label for="title" class="label">Naslov</label>
            <input id="title" name="title" class="input" value="{{ old('title', $post->title) }}" required maxlength="200">
        </div>
        <div>
            <label for="excerpt" class="label">Sažetak</label>
            <textarea id="excerpt" name="excerpt" rows="2" class="input" required maxlength="500">{{ old('excerpt', $post->excerpt) }}</textarea>
            <p class="mt-1 text-xs text-muted-foreground">Kratki uvod koji se prikazuje na karticama vijesti.</p>
        </div>
        <div>
            <label for="content" class="label">Tekst</label>
            <textarea id="content" name="content" rows="12" class="input" required>{{ old('content', $post->content) }}</textarea>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label for="category" class="label">Kategorija</label>
                <select id="category" name="category" class="input">
                    @foreach (\App\Models\Post::CATEGORIES as $category)
                        <option @selected(old('category', $post->category) === $category)>{{ $category }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label for="published_at" class="label">Datum objave</label>
                <input id="published_at" type="datetime-local" name="published_at" class="input" required
                       value="{{ old('published_at', $post->published_at?->format('Y-m-d\TH:i')) }}">
            </div>
        </div>
        <div>
            <label for="image" class="label">Fotografija</label>
            @if ($post->image_src)
                <div class="mb-3 flex items-center gap-4">
                    <img src="{{ $post->image_src }}" alt="" class="h-24 w-40 rounded-lg object-cover">
                    <label class="inline-flex items-center gap-2 text-sm">
                        <input type="checkbox" name="remove_image" value="1"> Ukloni fotografiju
                    </label>
                </div>
            @endif
            <input id="image" type="file" name="image" accept="image/jpeg,image/png,image/webp,image/gif" class="input">
            <p class="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP ili GIF, najviše 5 MB.{{ $post->image_src ? ' Nova fotografija zamjenjuje postojeću.' : '' }}</p>
        </div>

        <div class="flex gap-2 pt-2">
            <button class="btn btn-primary">{{ $editing ? 'Spremi promjene' : 'Objavi vijest' }}</button>
            <a href="{{ route('admin.posts.index') }}" class="btn btn-outline">Odustani</a>
        </div>
    </form>
</x-layouts.admin>
