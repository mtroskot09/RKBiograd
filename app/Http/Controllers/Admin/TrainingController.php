<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainingSession;
use App\Services\Hrs\HrsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class TrainingController extends Controller
{
    public function index(): View
    {
        return view('admin.trainings', ['sessions' => TrainingSession::forTeam()->groupBy('team')]);
    }

    public function store(Request $request): RedirectResponse
    {
        TrainingSession::create($this->validated($request));

        return back()->with('status', 'Trening je spremljen');
    }

    public function update(Request $request, TrainingSession $training): RedirectResponse
    {
        $training->update($this->validated($request));

        return back()->with('status', 'Trening je spremljen');
    }

    public function destroy(TrainingSession $training): RedirectResponse
    {
        $training->delete();

        return back()->with('status', 'Trening je obrisan');
    }

    private function validated(Request $request): array
    {
        $time = ['required', 'regex:/^([01]\d|2[0-3]):[0-5]\d$/'];

        return $request->validate([
            'team' => ['required', Rule::in(HrsService::TEAMS)],
            'day_of_week' => ['required', 'integer', 'between:1,7'],
            'start_time' => $time,
            'end_time' => [...$time, 'after:start_time'],
            'location' => ['nullable', 'string', 'max:100'],
        ], [
            'start_time.regex' => 'Upišite vrijeme u obliku HH:MM',
            'end_time.regex' => 'Upišite vrijeme u obliku HH:MM',
            'end_time.after' => 'Kraj mora biti nakon početka',
        ]);
    }
}
