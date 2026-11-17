<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

// Public site (addresses are the same as in the earlier version of the site)
Route::get('/', [PageController::class, 'home']);
Route::get('/first-team', [PageController::class, 'team'])->defaults('team', 'senior');
Route::get('/u15', [PageController::class, 'team'])->defaults('team', 'u15');
Route::get('/u13', [PageController::class, 'team'])->defaults('team', 'u13');
Route::get('/news', [PageController::class, 'news']);
Route::get('/news/{post}', [PageController::class, 'post']);
Route::get('/utakmica/{id}', [PageController::class, 'match']);
Route::get('/history', [PageController::class, 'history']);
Route::get('/contact', [ContactController::class, 'show']);
Route::post('/contact', [ContactController::class, 'send'])->middleware('throttle:5,10');
Route::view('/pristup-odbijen', 'pages.access-denied');

// Uploaded images (stored in the database)
Route::get('/api/images/{id}', [ImageController::class, 'show']);

// Admin login with Google; the callback URL must match the one set in Google Cloud Console.
Route::get('/api/login', [GoogleController::class, 'redirect'])->name('login');
Route::get('/api/callback', [GoogleController::class, 'callback']);
Route::match(['get', 'post'], '/api/logout', [GoogleController::class, 'logout']);

Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/email-preview', [Admin\DashboardController::class, 'emailPreview'])->name('email-preview');

    Route::resource('posts', Admin\PostController::class)->except('show');

    Route::get('/staff', [Admin\StaffController::class, 'index'])->name('staff');
    Route::post('/staff', [Admin\StaffController::class, 'store'])->name('staff.store');
    Route::put('/staff/{staff}', [Admin\StaffController::class, 'update'])->name('staff.update');
    Route::delete('/staff/{staff}', [Admin\StaffController::class, 'destroy'])->name('staff.destroy');
    Route::post('/staff/photos/{personId}', [Admin\StaffController::class, 'photo'])->whereNumber('personId')->name('staff.photo');

    Route::get('/trainings', [Admin\TrainingController::class, 'index'])->name('trainings');
    Route::post('/trainings', [Admin\TrainingController::class, 'store'])->name('trainings.store');
    Route::put('/trainings/{training}', [Admin\TrainingController::class, 'update'])->name('trainings.update');
    Route::delete('/trainings/{training}', [Admin\TrainingController::class, 'destroy'])->name('trainings.destroy');

    Route::get('/club-info', [Admin\ClubInfoController::class, 'edit'])->name('club-info');
    Route::put('/club-info', [Admin\ClubInfoController::class, 'update'])->name('club-info.update');

    Route::get('/history', [Admin\HistoryController::class, 'index'])->name('history');
    Route::put('/history/content', [Admin\HistoryController::class, 'updateContent'])->name('history.content');
    Route::post('/history/events', [Admin\HistoryController::class, 'storeEvent'])->name('history.events.store');
    Route::put('/history/events/{event}', [Admin\HistoryController::class, 'updateEvent'])->name('history.events.update');
    Route::delete('/history/events/{event}', [Admin\HistoryController::class, 'destroyEvent'])->name('history.events.destroy');
    Route::post('/history/photos', [Admin\HistoryController::class, 'storePhotos'])->name('history.photos.store');
    Route::put('/history/photos/{photo}', [Admin\HistoryController::class, 'updatePhoto'])->name('history.photos.update');
    Route::delete('/history/photos/{photo}', [Admin\HistoryController::class, 'destroyPhoto'])->name('history.photos.destroy');

    Route::get('/banners', [Admin\BannerController::class, 'index'])->name('banners');
    Route::post('/banners/{page}', [Admin\BannerController::class, 'update'])->name('banners.update');
});
