@use('App\Models\TrainingSession')
@use('App\Services\Hrs\HrsService')
<x-layouts.admin title="Raspored treninga" subtitle="Tjedni termini treninga prikazuju se na stranici svake ekipe.">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        @foreach (HrsService::TEAMS as $team)
            <div class="card p-6">
                <h2 class="card-title">{{ HrsService::label($team) }}</h2>

                <div class="space-y-3 mb-6">
                    @forelse ($sessions[$team] ?? [] as $s)
                        <div class="rounded-xl bg-secondary/60 p-3">
                            <form method="POST" action="{{ route('admin.trainings.update', $s) }}" class="grid grid-cols-2 gap-2">
                                @csrf @method('PUT')
                                <input type="hidden" name="team" value="{{ $team }}">
                                <select name="day_of_week" class="input col-span-2" aria-label="Dan">
                                    @foreach (TrainingSession::DAYS as $i => $day)
                                        <option value="{{ $i + 1 }}" @selected($s->day_of_week === $i + 1)>{{ $day }}</option>
                                    @endforeach
                                </select>
                                <input type="time" name="start_time" value="{{ $s->start_time }}" class="input" aria-label="Početak" required>
                                <input type="time" name="end_time" value="{{ $s->end_time }}" class="input" aria-label="Kraj" required>
                                <input name="location" value="{{ $s->location }}" placeholder="Mjesto (neobavezno)" class="input col-span-2" maxlength="100">
                                <button class="btn btn-outline btn-sm">Spremi</button>
                                <button form="delete-{{ $s->id }}" class="btn btn-ghost btn-sm text-destructive"><x-icon name="trash" class="h-3.5 w-3.5" /> Obriši</button>
                            </form>
                            <form id="delete-{{ $s->id }}" method="POST" action="{{ route('admin.trainings.destroy', $s) }}" onsubmit="return confirm('Obrisati ovaj trening?')">
                                @csrf @method('DELETE')
                            </form>
                        </div>
                    @empty
                        <p class="text-sm text-muted-foreground">Još nema treninga.</p>
                    @endforelse
                </div>

                <form method="POST" action="{{ route('admin.trainings.store') }}" class="grid grid-cols-2 gap-2 border-t pt-4">
                    @csrf
                    <input type="hidden" name="team" value="{{ $team }}">
                    <div class="col-span-2 text-sm font-semibold">Novi trening</div>
                    <select name="day_of_week" class="input col-span-2" aria-label="Dan">
                        @foreach (TrainingSession::DAYS as $i => $day)
                            <option value="{{ $i + 1 }}">{{ $day }}</option>
                        @endforeach
                    </select>
                    <input type="time" name="start_time" class="input" aria-label="Početak" required>
                    <input type="time" name="end_time" class="input" aria-label="Kraj" required>
                    <input name="location" placeholder="Mjesto (neobavezno)" class="input col-span-2" maxlength="100">
                    <button class="btn btn-primary col-span-2"><x-icon name="plus" class="h-4 w-4" /> Dodaj trening</button>
                </form>
            </div>
        @endforeach
    </div>
</x-layouts.admin>
