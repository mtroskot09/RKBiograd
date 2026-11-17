@php
    $info = \App\Models\ClubInfo::current();
    $address = \App\Models\ClubInfo::lines($info->address);
    $hours = \App\Models\ClubInfo::lines($info->office_hours);
    $iconClass = 'h-10 w-10 p-2.5 rounded-full bg-secondary text-primary';
@endphp
<x-layouts.app title="Kontakt">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <x-page-banner title="Kontakt" eyebrow="RK Biograd" subtitle="Imate pitanja? Želite se pridružiti klubu? Javite nam se!" :image="$banner" />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="card p-6 self-start">
                <h2 class="card-title mb-6">Pošaljite nam poruku</h2>

                @if (session('status'))
                    <div class="mb-6 flex items-center gap-3 rounded-xl bg-secondary p-4 text-primary ring-1 ring-accent/30">
                        <x-icon name="check" class="h-5 w-5" />
                        <span class="font-medium">{{ session('status') }}</span>
                    </div>
                @endif
                @if (session('error'))
                    <div class="mb-6 rounded-xl bg-destructive/10 p-4 text-destructive">{{ session('error') }}</div>
                @endif

                <form method="POST" action="/contact" class="space-y-4">
                    @csrf
                    {{-- Spam trap: hidden from people, bots fill it in. --}}
                    <div class="hidden" aria-hidden="true">
                        <label>Web stranica <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
                    </div>
                    <div>
                        <label for="name" class="label">Ime i prezime</label>
                        <input id="name" name="name" class="input" value="{{ old('name') }}" placeholder="Vaše ime" required maxlength="100">
                        @error('name') <p class="field-error">{{ $message }}</p> @enderror
                    </div>
                    <div>
                        <label for="email" class="label">Email</label>
                        <input id="email" type="email" name="email" class="input" value="{{ old('email') }}" placeholder="vas.email@example.com" required maxlength="100">
                        @error('email') <p class="field-error">{{ $message }}</p> @enderror
                    </div>
                    <div>
                        <label for="message" class="label">Poruka</label>
                        <textarea id="message" name="message" rows="5" class="input" placeholder="Vaša poruka..." required maxlength="5000">{{ old('message') }}</textarea>
                        @error('message') <p class="field-error">{{ $message }}</p> @enderror
                        @error('website') <p class="field-error">{{ $message }}</p> @enderror
                    </div>
                    <button type="submit" class="btn btn-primary btn-lg w-full rounded-full">
                        <x-icon name="send" class="h-4 w-4" />
                        Pošalji poruku
                    </button>
                </form>
            </div>

            <div class="space-y-6">
                <div class="card p-6">
                    <h2 class="card-title mb-6">Informacije</h2>
                    <div class="space-y-4">
                        @if ($address)
                            <div class="flex items-start gap-4">
                                <x-icon name="map-pin" :class="$iconClass" />
                                <div>
                                    <div class="font-semibold text-primary">Adresa</div>
                                    <div class="text-muted-foreground">
                                        @foreach ($address as $line)<div>{{ $line }}</div>@endforeach
                                    </div>
                                </div>
                            </div>
                        @endif
                        @if ($info->phone)
                            <div class="flex items-start gap-4">
                                <x-icon name="phone" :class="$iconClass" />
                                <div>
                                    <div class="font-semibold text-primary">Telefon</div>
                                    <a href="{{ $info->phoneHref() }}" class="text-muted-foreground hover:text-primary hover:underline">{{ $info->phone }}</a>
                                </div>
                            </div>
                        @endif
                        @if ($info->email)
                            <div class="flex items-start gap-4">
                                <x-icon name="mail" :class="$iconClass" />
                                <div class="min-w-0">
                                    <div class="font-semibold text-primary">Email</div>
                                    <a href="mailto:{{ $info->email }}" class="text-muted-foreground hover:text-primary hover:underline break-all">{{ $info->email }}</a>
                                </div>
                            </div>
                        @endif
                        @if ($hours)
                            <div class="flex items-start gap-4">
                                <x-icon name="clock" :class="$iconClass" />
                                <div>
                                    <div class="font-semibold text-primary">Radno vrijeme</div>
                                    <div class="text-muted-foreground">
                                        @foreach ($hours as $line)<div>{{ $line }}</div>@endforeach
                                    </div>
                                </div>
                            </div>
                        @endif
                        <div class="flex items-start gap-4">
                            <x-icon name="facebook" :class="$iconClass" />
                            <div>
                                <div class="font-semibold text-primary">Društvene mreže</div>
                                <div class="flex flex-col text-muted-foreground">
                                    <a href="{{ config('club.facebook_url') }}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 hover:text-foreground hover:underline">
                                        <x-icon name="facebook" class="h-4 w-4" /> Facebook
                                    </a>
                                    <a href="{{ config('club.instagram_url') }}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 hover:text-foreground hover:underline">
                                        <x-icon name="instagram" class="h-4 w-4" /> @rkbiograd
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card p-6">
                    <h2 class="card-title">Pridružite se klubu</h2>
                    <p class="text-muted-foreground mb-4">Zainteresirani ste za rukomet? Pridružite se RK Biograd i postanite dio naše obitelji!</p>
                    <p class="text-sm text-muted-foreground">Kontaktirajte nas za više informacija o upisima u mlade selekcije ili seniorsku ekipu.</p>
                </div>
            </div>
        </div>
    </div>
</x-layouts.app>
