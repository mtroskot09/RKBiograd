{{-- Shown after a Google login with an account that is not in ADMIN_EMAILS (or a failed login). --}}
<x-layouts.app title="Pristup odbijen">
    <div class="flex items-center justify-center px-4 py-16">
        <div class="relative w-full max-w-xl overflow-hidden rounded-2xl bg-brand-gradient p-8 md:p-12 text-center text-white shadow-xl shadow-primary/20">
            <x-icon name="shield-alert" class="mx-auto mb-4 h-14 w-14 text-accent" />
            <h1 class="font-display text-4xl md:text-5xl font-extrabold uppercase leading-none mb-3">Pristup odbijen</h1>
            <p class="text-white/85 mb-2">Ovaj račun nema pristup administraciji stranice.</p>
            <p class="text-sm text-white/60 mb-8">
                Ako ste administrator kluba, prijavite se s računom čija je e-mail adresa na popisu administratora.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-3">
                <a href="/" class="btn btn-accent btn-lg rounded-full">
                    <x-icon name="home" class="h-4 w-4" /> Na početnu
                </a>
                <a href="/api/login" class="btn btn-lg rounded-full bg-white/10 border border-white/40 text-white hover:bg-white/20">
                    <x-icon name="log-in" class="h-4 w-4" /> Prijava drugim računom
                </a>
            </div>
            <div class="absolute inset-x-0 bottom-0 h-1.5 bg-accent"></div>
        </div>
    </div>
</x-layouts.app>
