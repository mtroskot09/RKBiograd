<x-layouts.admin title="Kontakt podaci" subtitle="Prikazuju se u podnožju svake stranice, na stranici Kontakt i u e-mailovima kluba.">
    <form method="POST" action="{{ route('admin.club-info.update') }}" class="card p-6 space-y-5 max-w-2xl">
        @csrf @method('PUT')
        <div>
            <label for="phone" class="label">Telefon</label>
            <input id="phone" type="tel" name="phone" class="input" value="{{ old('phone', $info->phone) }}" placeholder="+385 23 123 456" maxlength="50">
        </div>
        <div>
            <label for="email" class="label">E-mail</label>
            <input id="email" type="email" name="email" class="input" value="{{ old('email', $info->email) }}" placeholder="info@rkbiograd.hr" maxlength="100">
            <p class="mt-1 text-xs text-muted-foreground">Na ovu adresu stižu i poruke s kontakt obrasca.</p>
        </div>
        <div>
            <label for="address" class="label">Adresa</label>
            <textarea id="address" name="address" rows="3" class="input" maxlength="200">{{ old('address', $info->address) }}</textarea>
            <p class="mt-1 text-xs text-muted-foreground">Svaki dio adrese u novi red.</p>
        </div>
        <div>
            <label for="office_hours" class="label">Radno vrijeme</label>
            <textarea id="office_hours" name="office_hours" rows="4" class="input" placeholder="Ponedjeljak - Petak: 16:00 - 21:00" maxlength="500">{{ old('office_hours', $info->office_hours) }}</textarea>
            <p class="mt-1 text-xs text-muted-foreground">Svaki dan ili raspon dana u novi red.</p>
        </div>
        <button class="btn btn-primary">Spremi</button>
    </form>
</x-layouts.admin>
