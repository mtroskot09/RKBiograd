@use('App\Models\HistoryContent')
@php
    $stats = old('stats', $content->stats);
    // Empty rows to fill in, up to the maximum.
    $stats = array_pad($stats, HistoryContent::MAX_STATS, ['value' => '', 'label' => '']);
    $event = $editing ?? new \App\Models\HistoryEvent;
@endphp
<x-layouts.admin title="Povijest" subtitle="Sadržaj stranice Povijest: uvod, istaknuti podaci, ključni događaji i galerija.">
    {{-- Texts and highlight boxes --}}
    <form method="POST" action="{{ route('admin.history.content') }}" class="card p-6 space-y-5 mb-10">
        @csrf @method('PUT')
        <h2 class="card-title">Tekstovi</h2>
        <div>
            <label for="intro" class="label">Uvod</label>
            <textarea id="intro" name="intro" rows="3" class="input" maxlength="2000">{{ old('intro', $content->intro) }}</textarea>
        </div>
        <div>
            <span class="label">Istaknuti podaci (najviše {{ HistoryContent::MAX_STATS }})</span>
            <div class="space-y-2">
                @foreach ($stats as $i => $stat)
                    <div class="grid grid-cols-[8rem_1fr] gap-2">
                        <input name="stats[{{ $i }}][value]" value="{{ $stat['value'] }}" placeholder="1963." class="input" aria-label="Vrijednost" maxlength="20">
                        <input name="stats[{{ $i }}][label]" value="{{ $stat['label'] }}" placeholder="Godina osnutka" class="input" aria-label="Opis" maxlength="60">
                    </div>
                @endforeach
            </div>
            <p class="mt-1 text-xs text-muted-foreground">Prazni redovi se ne prikazuju.</p>
        </div>
        <div>
            <label for="mission" class="label">Naša misija</label>
            <textarea id="mission" name="mission" rows="5" class="input" maxlength="4000">{{ old('mission', $content->mission) }}</textarea>
        </div>
        <button class="btn btn-primary">Spremi tekstove</button>
    </form>

    {{-- Timeline --}}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div class="card p-6">
            <h2 class="card-title">Ključni događaji</h2>
            <div class="divide-y">
                @forelse ($events as $e)
                    <div class="flex items-start gap-3 py-3">
                        @if ($e->image_src)
                            <img src="{{ $e->image_src }}" alt="" class="h-12 w-16 rounded object-cover shrink-0">
                        @endif
                        <div class="flex-1 min-w-0">
                            <div class="text-sm font-bold text-primary">{{ $e->year }}</div>
                            <div class="font-semibold">{{ $e->title }}</div>
                            <div class="text-sm text-muted-foreground line-clamp-2">{{ $e->description }}</div>
                        </div>
                        <a href="{{ route('admin.history', ['edit' => $e->id]) }}#event-form" class="btn btn-outline btn-sm" aria-label="Uredi događaj"><x-icon name="pencil" class="h-3.5 w-3.5" /></a>
                        <form method="POST" action="{{ route('admin.history.events.destroy', $e) }}" onsubmit="return confirm('Obrisati ovaj događaj?')">
                            @csrf @method('DELETE')
                            <button class="btn btn-danger btn-sm" aria-label="Obriši događaj"><x-icon name="trash" class="h-3.5 w-3.5" /></button>
                        </form>
                    </div>
                @empty
                    <p class="text-sm text-muted-foreground">Još nema događaja.</p>
                @endforelse
            </div>
        </div>

        <form id="event-form" method="POST" enctype="multipart/form-data" class="card p-6 space-y-4 self-start"
              action="{{ $editing ? route('admin.history.events.update', $editing) : route('admin.history.events.store') }}">
            @csrf
            @if ($editing) @method('PUT') @endif
            <h2 class="card-title">{{ $editing ? 'Uredi događaj' : 'Novi događaj' }}</h2>
            <div class="grid grid-cols-[8rem_1fr] gap-3">
                <div>
                    <label for="event-year" class="label">Godina</label>
                    <input id="event-year" name="year" value="{{ old('year', $event->year) }}" placeholder="2010./11." class="input" required maxlength="30">
                </div>
                <div>
                    <label for="event-title" class="label">Naslov</label>
                    <input id="event-title" name="title" value="{{ old('title', $event->title) }}" placeholder="Prvaci 2. HRL" class="input" required maxlength="120">
                </div>
            </div>
            <div>
                <label for="event-description" class="label">Opis</label>
                <textarea id="event-description" name="description" rows="4" class="input" maxlength="2000">{{ old('description', $event->description) }}</textarea>
            </div>
            <div>
                <label for="event-image" class="label">Fotografija (neobavezno)</label>
                @if ($event->image_src)
                    <div class="mb-3 flex items-center gap-4">
                        <img src="{{ $event->image_src }}" alt="" class="h-20 w-32 rounded-lg object-cover">
                        <label class="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="remove_image" value="1"> Ukloni fotografiju</label>
                    </div>
                @endif
                <input id="event-image" type="file" name="image" accept="image/jpeg,image/png,image/webp,image/gif" class="input">
            </div>
            <div class="flex gap-2">
                <button class="btn btn-primary">{{ $editing ? 'Spremi događaj' : 'Dodaj događaj' }}</button>
                @if ($editing)
                    <a href="{{ route('admin.history') }}" class="btn btn-outline">Odustani</a>
                @endif
            </div>
        </form>
    </div>

    {{-- Gallery --}}
    <div class="card p-6">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 class="card-title mb-0">Galerija</h2>
            <form method="POST" action="{{ route('admin.history.photos.store') }}" enctype="multipart/form-data">
                @csrf
                <label class="btn btn-primary">
                    <x-icon name="upload" class="h-4 w-4" /> Dodaj fotografije
                    <input type="file" name="photos[]" multiple accept="image/jpeg,image/png,image/webp,image/gif" class="sr-only" onchange="this.form.submit()">
                </label>
            </form>
        </div>
        @if ($photos->isEmpty())
            <p class="text-sm text-muted-foreground">Galerija je prazna.</p>
        @else
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                @foreach ($photos as $photo)
                    <div class="space-y-2">
                        <img src="{{ $photo->image_src }}" alt="" class="aspect-square w-full rounded-xl object-cover">
                        <form method="POST" action="{{ route('admin.history.photos.update', $photo) }}" class="flex gap-1">
                            @csrf @method('PUT')
                            <input name="caption" value="{{ $photo->caption }}" placeholder="Opis (neobavezno)" class="input py-1 text-xs" maxlength="200">
                            <button class="btn btn-outline btn-sm" aria-label="Spremi opis"><x-icon name="check" class="h-3.5 w-3.5" /></button>
                        </form>
                        <form method="POST" action="{{ route('admin.history.photos.destroy', $photo) }}" onsubmit="return confirm('Obrisati fotografiju?')">
                            @csrf @method('DELETE')
                            <button class="btn btn-ghost btn-sm text-destructive"><x-icon name="trash" class="h-3.5 w-3.5" /> Obriši</button>
                        </form>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</x-layouts.admin>
