@use('App\Models\StaffAssignment')
@use('App\Services\Hrs\HrsService')
<x-layouts.admin title="Stručni stožer" subtitle="HRS na zapisnicima navodi službene osobe ekipe, ali ne i njihove uloge. Ovdje odaberite trenere i dodijelite im ekipu i ulogu.">
    {{-- Current staff per team --}}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        @foreach (HrsService::TEAMS as $team)
            <div class="card p-6">
                <h2 class="card-title">{{ HrsService::label($team) }}</h2>
                @forelse ($staff[$team] ?? [] as $member)
                    <div class="border-t py-4 first-of-type:border-t-0 space-y-3">
                        <div class="flex items-center gap-3">
                            <x-coach-avatar :person="$member" class="h-12 w-12 text-base" />
                            <div class="min-w-0">
                                <div class="font-semibold">{{ $member->first_name }} {{ $member->last_name }}</div>
                                <div class="text-xs text-muted-foreground">{{ $member->role }}</div>
                            </div>
                        </div>

                        {{-- Photo: one per person, shared by all their teams --}}
                        <div class="flex flex-wrap items-center gap-2">
                            <form method="POST" action="{{ route('admin.staff.photo', $member->hrs_person_id) }}" enctype="multipart/form-data">
                                @csrf
                                <label class="btn btn-outline btn-sm">
                                    <x-icon name="upload" class="h-3.5 w-3.5" /> {{ $member->photo_url ? 'Promijeni fotografiju' : 'Dodaj fotografiju' }}
                                    <input type="file" name="photo" accept="image/jpeg,image/png,image/webp,image/gif" class="sr-only" onchange="this.form.submit()">
                                </label>
                            </form>
                            @if ($member->photo_url)
                                <form method="POST" action="{{ route('admin.staff.photo', $member->hrs_person_id) }}" onsubmit="return confirm('Ukloniti fotografiju?')">
                                    @csrf
                                    <button class="btn btn-ghost btn-sm">Ukloni fotografiju</button>
                                </form>
                            @endif
                        </div>

                        <form method="POST" action="{{ route('admin.staff.update', $member) }}" class="flex flex-wrap gap-2">
                            @csrf @method('PUT')
                            <select name="team" class="input w-auto py-1" aria-label="Ekipa">
                                @foreach (HrsService::TEAMS as $t)
                                    <option value="{{ $t }}" @selected($member->team === $t)>{{ HrsService::label($t) }}</option>
                                @endforeach
                            </select>
                            <select name="role" class="input w-auto py-1" aria-label="Uloga">
                                @foreach (StaffAssignment::ROLES as $role)
                                    <option @selected($member->role === $role)>{{ $role }}</option>
                                @endforeach
                            </select>
                            <button class="btn btn-outline btn-sm">Spremi</button>
                        </form>
                        <form method="POST" action="{{ route('admin.staff.destroy', $member) }}" onsubmit="return confirm('Ukloniti trenera iz stožera ove ekipe?')">
                            @csrf @method('DELETE')
                            <button class="btn btn-ghost btn-sm text-destructive"><x-icon name="trash" class="h-3.5 w-3.5" /> Ukloni iz ekipe</button>
                        </form>
                    </div>
                @empty
                    <p class="text-sm text-muted-foreground">Nitko još nije dodan.</p>
                @endforelse
            </div>
        @endforeach
    </div>

    {{-- People from HRS match sheets --}}
    <h2 class="section-title mb-2">Službene osobe s HRS-a</h2>
    <p class="mb-6 text-sm text-muted-foreground">Osobe koje su ove sezone bile upisane kao službene osobe naših ekipa na zapisnicima utakmica.</p>

    @if ($officials === null)
        <x-hrs-unavailable what="Podaci s HRS-a" />
    @elseif (! $officials)
        <div class="card p-6 text-muted-foreground">Ove sezone još nema odigranih utakmica sa zapisnikom.</div>
    @else
        <div class="card divide-y">
            @foreach ($officials as $person)
                <form method="POST" action="{{ route('admin.staff.store') }}" class="flex flex-col md:flex-row md:items-center gap-3 p-4">
                    @csrf
                    <input type="hidden" name="hrs_person_id" value="{{ $person['person_id'] }}">
                    <input type="hidden" name="first_name" value="{{ $person['first_name'] }}">
                    <input type="hidden" name="last_name" value="{{ $person['last_name'] }}">
                    <div class="flex-1 min-w-0">
                        <div class="font-semibold">{{ $person['first_name'] }} {{ $person['last_name'] }}</div>
                        <div class="text-xs text-muted-foreground">
                            Utakmice:
                            @foreach ($person['teams'] as $team => $count)
                                {{ HrsService::label($team) }} ({{ $count }}){{ $loop->last ? '' : ',' }}
                            @endforeach
                            @if ($person['last_match'])
                                · zadnja {{ \App\Support\Croatian::matchDate($person['last_match']) }}
                            @endif
                        </div>
                    </div>
                    <select name="team" class="input md:w-40" aria-label="Ekipa">
                        @foreach (HrsService::TEAMS as $t)
                            <option value="{{ $t }}" @selected(array_key_first($person['teams']) === $t)>{{ HrsService::label($t) }}</option>
                        @endforeach
                    </select>
                    <select name="role" class="input md:w-48" aria-label="Uloga">
                        @foreach (StaffAssignment::ROLES as $role)
                            <option>{{ $role }}</option>
                        @endforeach
                    </select>
                    <button class="btn btn-primary"><x-icon name="plus" class="h-4 w-4" /> Dodaj</button>
                </form>
            @endforeach
        </div>
    @endif
</x-layouts.admin>
