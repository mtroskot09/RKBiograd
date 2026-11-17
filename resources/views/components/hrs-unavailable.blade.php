@props(['what' => 'Podaci'])
<div class="card p-6 flex items-start gap-3">
    <x-icon name="alert-circle" class="h-5 w-5 text-muted-foreground mt-0.5" />
    <div>
        <p class="font-medium">{{ $what }} trenutno nisu dostupni.</p>
        <p class="text-sm text-muted-foreground">
            Podaci se preuzimaju sa stranica Hrvatskog rukometnog saveza. Pokušajte ponovno za nekoliko minuta.
        </p>
    </div>
</div>
