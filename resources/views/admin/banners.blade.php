@use('App\Models\PageBanner')
<x-layouts.admin title="Naslovne slike" subtitle="Pozadinska slika na vrhu svake stranice. Stranice bez vlastite slike koriste zadanu.">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @foreach (PageBanner::PAGES as $key => $page)
            @php($image = $custom[$key] ?? $page['default'])
            <div class="card overflow-hidden flex flex-col">
                <div class="relative aspect-[16/9] bg-brand-gradient">
                    @if ($image)
                        <img src="{{ $image }}" alt="" class="h-full w-full object-cover">
                    @else
                        <img src="/images/rk-biograd-logo-192.png" alt="" class="absolute right-4 bottom-2 h-28 opacity-20">
                    @endif
                    <span class="badge absolute top-3 left-3 bg-white/90 text-primary">{{ isset($custom[$key]) ? 'Vlastita slika' : 'Zadano' }}</span>
                </div>
                <div class="p-4 flex flex-1 flex-col gap-3">
                    <div class="font-semibold">{{ $page['label'] }}</div>
                    <div class="mt-auto flex flex-wrap gap-2">
                        <form method="POST" action="{{ route('admin.banners.update', $key) }}" enctype="multipart/form-data">
                            @csrf
                            <label class="btn btn-primary btn-sm">
                                <x-icon name="upload" class="h-3.5 w-3.5" /> Učitaj sliku
                                <input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/gif" class="sr-only" onchange="this.form.submit()">
                            </label>
                        </form>
                        @isset($custom[$key])
                            <form method="POST" action="{{ route('admin.banners.update', $key) }}" onsubmit="return confirm('Vratiti zadanu sliku?')">
                                @csrf
                                <button class="btn btn-outline btn-sm">Vrati zadanu</button>
                            </form>
                        @endisset
                        <a href="{{ $page['path'] }}" target="_blank" class="btn btn-ghost btn-sm">Pogledaj <x-icon name="external-link" class="h-3.5 w-3.5" /></a>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</x-layouts.admin>
