<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Same tables and columns as the earlier Node version of the site, so an existing database is
// taken over as is: tables that already exist are left alone, missing ones are created.
return new class extends Migration
{
    public function up(): void
    {
        $this->create('users', function (Blueprint $table) {
            $table->string('id')->primary(); // "google:<sub>" or "local-dev-admin"
            $table->string('email')->nullable()->unique();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('profile_image_url')->nullable();
            $table->timestamps();
        });

        $this->create('web_sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        $this->create('posts', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->text('title');
            $table->text('excerpt');
            $table->text('content');
            $table->text('category');
            $table->text('image_src')->nullable();
            $table->timestamp('published_at')->useCurrent();
            $table->timestamp('created_at')->useCurrent();
        });

        // Uploaded images live in the database because the host has no persistent disk.
        $this->create('images', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->text('content_type');
            $table->binary('data');
            $table->timestamp('created_at')->useCurrent();
        });

        // Coaching staff per team. People are picked from the team officials on HRS match sheets
        // (hrs_person_id); the name is copied so pages work even when HRS is down.
        $this->create('staff_assignments', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->text('team');
            $table->integer('hrs_person_id');
            $table->text('first_name');
            $table->text('last_name');
            $table->text('role');
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['team', 'hrs_person_id'], 'staff_assignments_team_person');
        });

        // One photo per coach, shared by all teams the person is assigned to.
        $this->create('coach_photos', function (Blueprint $table) {
            $table->integer('hrs_person_id')->primary();
            $table->text('photo_url');
        });

        // Custom top image per page; pages without a row use their built-in default.
        $this->create('page_banners', function (Blueprint $table) {
            $table->string('page')->primary();
            $table->text('image_src');
            $table->timestamp('updated_at')->useCurrent();
        });

        // Single row (id "main").
        $this->create('club_info', function (Blueprint $table) {
            $table->string('id')->primary()->default('main');
            $table->text('phone')->default('');
            $table->text('email')->default('');
            $table->text('address')->default('');
            $table->text('office_hours')->default('');
            $table->timestamp('updated_at')->useCurrent();
        });

        // Single row (id "main"): intro, mission and up to 4 highlight boxes.
        $this->create('history_content', function (Blueprint $table) {
            $table->string('id')->primary()->default('main');
            $table->text('intro')->default('');
            $table->text('mission')->default('');
            $table->jsonb('stats')->default('[]');
            $table->timestamp('updated_at')->useCurrent();
        });

        $this->create('history_events', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->text('year'); // free text: "1963.", "2010./11.", "2011. – 2019."
            $table->integer('sort_year');
            $table->text('title');
            $table->text('description')->default('');
            $table->text('image_src')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        $this->create('history_photos', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->text('image_src');
            $table->text('caption')->default('');
            $table->timestamp('created_at')->useCurrent();
        });

        $this->create('training_sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->text('team');
            $table->integer('day_of_week'); // 1 = Monday … 7 = Sunday
            $table->text('start_time'); // "HH:MM"
            $table->text('end_time');
            $table->text('location')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        foreach ([
            'training_sessions', 'history_photos', 'history_events', 'history_content', 'club_info',
            'page_banners', 'coach_photos', 'staff_assignments', 'images', 'posts', 'web_sessions', 'users',
        ] as $table) {
            Schema::dropIfExists($table);
        }
    }

    private function create(string $table, Closure $definition): void
    {
        if (! Schema::hasTable($table)) {
            Schema::create($table, $definition);
        }
    }
};
