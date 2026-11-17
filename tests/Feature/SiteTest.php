<?php

namespace Tests\Feature;

use App\Mail\ClubMail;
use App\Mail\ContactConfirmation;
use App\Mail\ContactMessage;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class SiteTest extends TestCase
{
    use RefreshDatabase;

    private const COMPETITION_FEED = <<<'JS'
        var natjecanjeobjekt = { broj: 2014, lige: [{
            broj: 4072,
            tablica: [
                { por: 1, n: "RK Biograd", k: 1421, e: 77, utk: 2, pob: 2, ner: 0, izg: 0, dat: 60, prim: 50, raz: 10, bod: 4 },
                { por: 2, n: "RK Split", k: 999, e: 78, utk: 2, pob: 0, ner: 0, izg: 2, dat: 50, prim: 60, raz: -10, bod: 0 }
            ],
            utakmice: [
                { broj: 501, kolo: 1, pc: "2026-09-20T19:00:00", e1: "RK Biograd", e2: "RK Split", k1: 1421, k2: 999, st: 2, r1: 30, r2: 25, p11: 15, p12: 12, mnaziv: "SD Biograd", mmjesto: "Biograd na Moru" },
                { broj: 502, kolo: 2, pc: "2099-10-04T18:00:00", e1: "RK Split", e2: "RK Biograd", k1: 999, k2: 1421, st: 0 }
            ]
        },
        { broj: 4351, tablica: [], utakmice: [] },
        { broj: 4117, tablica: [], utakmice: [] },
        { broj: 4112, tablica: [], utakmice: [] }
        ], statistika: { stat: [
            { ig: 11, ime: "Ivan", prezime: "Horvat", utk: 2, sutd: 14, ek: [{ b: 77 }] }
        ] } };
        JS;

    // Not in setUp: the first matching fake wins, so a test could not switch HRS off afterwards.
    private function fakeHrs(): void
    {
        Http::fake([
            '*/natjecanje*' => Http::response(self::COMPETITION_FEED),
            '*/utakmice/501.js' => Http::response('var u = { ut: [{ status: 2, ekipa1: 77 }], sastavi: [{ igrac: 11, ime: "Ivan", prezime: "Horvat", ekipa: 77, dres: 7, sutd: 9 }], dogadjaji: [{ sk: 1, vr: "01:10", e: 1, td: 0, ish: 0, i: "Ivan", p: "Horvat", r1: 1, r2: 0 }], sudionici: [] };'),
        ]);
    }

    public function test_public_pages_render(): void
    {
        $this->fakeHrs();
        Post::create(['title' => 'Pobjeda u derbiju', 'excerpt' => 'Sažetak', 'content' => 'Tekst', 'category' => 'Novosti', 'published_at' => now()]);

        foreach (['/', '/first-team', '/u15', '/u13', '/news', '/history', '/contact', '/pristup-odbijen'] as $url) {
            $this->get($url)->assertOk();
        }
        $this->get('/')->assertSee('Pobjeda u derbiju')->assertSee('RK Split');
        $this->get('/first-team')->assertSee('Ivan Horvat');
        $this->get('/history')->assertSee('Osnovan RK Biograd');
    }

    public function test_match_page_shows_only_our_matches(): void
    {
        $this->fakeHrs();
        $this->get('/utakmica/501')->assertOk()->assertSee('Tijek utakmice');
        $this->get('/utakmica/123')->assertNotFound();
        $this->get('/utakmica/abc')->assertNotFound();
    }

    public function test_pages_still_work_when_hrs_is_down(): void
    {
        Http::fake(['*' => Http::response('', 500)]);

        $this->get('/')->assertOk()->assertSee('trenutno nisu dostupni');
        $this->get('/first-team')->assertOk()->assertSee('trenutno nisu dostupni');
    }

    public function test_contact_form_sends_both_emails(): void
    {
        Mail::fake();

        $this->post('/contact', ['name' => 'Ana', 'email' => 'ana@example.com', 'message' => 'Upisi za U13?'])
            ->assertRedirect('/contact');

        Mail::assertSent(ContactMessage::class, fn ($m) => $m->hasTo('info@rkbiograd.hr') && $m->hasReplyTo('ana@example.com'));
        Mail::assertSent(ContactConfirmation::class, fn ($m) => $m->hasTo('ana@example.com'));
    }

    public function test_contact_form_rejects_bots(): void
    {
        Mail::fake();

        $this->post('/contact', ['name' => 'Bot', 'email' => 'bot@example.com', 'message' => 'spam', 'website' => 'x'])
            ->assertSessionHasErrors('website');

        Mail::assertNothingSent();
    }

    public function test_email_template_renders_with_crest(): void
    {
        $html = (new ClubMail('Naslov', 'Upisi su otvoreni!', ["Prvi red\nDrugi red"], 'Raspored', 'https://example.com'))->render();

        // The crest is embedded in the e-mail; the preview shows it inline as a data URI.
        $this->assertMatchesRegularExpression('/<img src="(data:image\/png;base64,|cid:)[^"]+"[^>]*alt="Grb RK Biograd"/', $html);
        $this->assertStringContainsString('Upisi su otvoreni!', $html);
        $this->assertStringContainsString('Prvi red<br />', $html);
        $this->assertStringContainsString('SVIM SRCEM - ZA BIOGRAD!', $html);
    }

    public function test_admin_requires_an_admin_account(): void
    {
        config(['services.google.client_id' => 'test-client']);

        $this->get('/admin')->assertRedirect('/api/login');

        $this->actingAs(User::create(['id' => 'google:1', 'email' => 'someone@example.com']))
            ->get('/admin')->assertRedirect('/pristup-odbijen');

        $this->actingAs(User::create(['id' => 'google:2', 'email' => 'admin@example.com']))
            ->get('/admin')->assertOk()->assertSee('Administracija');
    }

    public function test_admin_can_publish_a_post(): void
    {
        $this->actingAs(User::create(['id' => 'google:2', 'email' => 'admin@example.com']));

        $this->post('/admin/posts', [
            'title' => 'Nova vijest',
            'excerpt' => 'Kratko',
            'content' => 'Dugo',
            'category' => 'U15',
            'published_at' => '2026-11-17T10:00',
        ])->assertRedirect('/admin/posts');

        $this->assertDatabaseHas('posts', ['title' => 'Nova vijest', 'category' => 'U15']);
    }
}
