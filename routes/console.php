<?php

use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;

// Sends the sample club e-mail, to check the template and the mail settings:
//   php artisan mail:test you@example.com
Artisan::command('mail:test {to}', function (string $to) {
    Mail::to($to)->send(app(DashboardController::class)->emailPreview());
    $this->info("Sent to {$to}.");
})->purpose('Send the sample RK Biograd e-mail');
