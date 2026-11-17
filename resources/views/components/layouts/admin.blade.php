@props(['title', 'subtitle' => null, 'back' => true])
<!DOCTYPE html>
<html lang="hr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <title>{{ $title }} – Administracija RK Biograd</title>
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen">
    <div class="bg-brand-gradient text-white">
        <div class="h-1 w-full bg-accent"></div>
        <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-3">
                <img src="/images/rk-biograd-logo-192.png" alt="RK Biograd grb" class="h-10 w-auto">
                <span class="font-display text-xl font-bold uppercase tracking-wide">Administracija</span>
            </a>
            <div class="flex items-center gap-2 text-sm">
                <a href="/" class="btn btn-sm text-white hover:bg-white/10"><x-icon name="home" class="h-4 w-4" /> <span class="hidden sm:inline">Pogledaj stranicu</span></a>
                <form method="POST" action="/api/logout">
                    @csrf
                    <button class="btn btn-sm text-white hover:bg-white/10"><x-icon name="log-out" class="h-4 w-4" /> <span class="hidden sm:inline">Odjava</span></button>
                </form>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
        @if ($back)
            <a href="{{ route('admin.dashboard') }}" class="btn btn-ghost -ml-3 mb-4">
                <x-icon name="arrow-left" class="h-4 w-4" /> Natrag na administraciju
            </a>
        @endif

        <div class="mb-8">
            <h1 class="font-display text-3xl md:text-4xl font-bold uppercase text-primary mb-1">{{ $title }}</h1>
            @if ($subtitle)
                <p class="text-muted-foreground">{{ $subtitle }}</p>
            @endif
        </div>

        @if (session('status'))
            <div class="mb-6 flex items-center gap-3 rounded-xl bg-secondary p-4 text-primary ring-1 ring-accent/30" role="status">
                <x-icon name="check" class="h-5 w-5" />
                <span class="font-medium">{{ session('status') }}</span>
            </div>
        @endif
        @if (session('error'))
            <div class="mb-6 rounded-xl bg-destructive/10 p-4 font-medium text-destructive" role="alert">{{ session('error') }}</div>
        @endif
        @if ($errors->any())
            <div class="mb-6 rounded-xl bg-destructive/10 p-4 text-destructive" role="alert">
                <p class="font-medium">Promjene nisu spremljene:</p>
                <ul class="mt-1 list-disc pl-5 text-sm">
                    @foreach (array_unique($errors->all()) as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        {{ $slot }}
    </div>
</body>
</html>
