# RK Biograd – web stranica

Službena stranica Rukometnog kluba Biograd: vijesti, utakmice, ljestvice i statistika (uživo s HRS-a),
seniorska ekipa i mlađe selekcije (U15, U13), povijest kluba, kontakt i administracija za uređivanje sadržaja.

Built with **Laravel 12** (PHP 8.2+), Blade templates, Tailwind CSS 4 and a little Alpine.js. All UI text is in Croatian.

## Local development

Requirements: PHP 8.2+ (extensions `pdo_sqlite`, `intl`, `fileinfo`), Composer, Node 20+.

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate        # creates database/database.sqlite (answer "yes")
npm install
npm run build              # or `npm run dev` while editing views/CSS
php artisan serve          # http://localhost:8000
```

- Without `GOOGLE_CLIENT_ID` login is disabled and opening `/admin` signs you in as a local admin (refused in production).
- With `MAIL_MAILER=log` e-mails are written to `storage/logs/laravel.log` instead of being sent.
- Image uploads allow up to 5 MB, but PHP's default limit is 2 MB: set `upload_max_filesize = 6M` and
  `post_max_size = 110M` in your local `php.ini` (the Docker image already does).
- `php artisan test` runs the tests (feed parser, public pages with a fake HRS feed, contact form, admin access).
- After the first `composer install`, commit `composer.lock` so every deploy installs the same versions.

## How it is built

| Part | Where |
| --- | --- |
| Routes (public site, admin, Google login) | `routes/web.php` |
| Public pages | `app/Http/Controllers/PageController.php`, `ContactController.php`, views in `resources/views/pages` |
| Admin panel (`/admin`) | `app/Http/Controllers/Admin/*`, views in `resources/views/admin` |
| Shared view pieces (header, footer, fixture card, tables …) | `resources/views/partials`, `resources/views/components` |
| Database tables | `database/migrations`, models in `app/Models` |
| HRS data feed | `app/Services/Hrs`, season settings in `config/hrs.php` |
| E-mail template with the club crest | `resources/views/emails/layout.blade.php`, mailables in `app/Mail` |
| Colours and fonts | `resources/css/app.css` (`@theme`) |

**Data stored in the database:** admins (`users`), news (`posts`), uploaded images (`images`, kept in the database
so the host needs no persistent disk; served at `/api/images/{id}`), coaching staff (`staff_assignments`,
`coach_photos`), training times (`training_sessions`), contact details (`club_info`), page top images
(`page_banners`) and the history page (`history_content`, `history_events`, `history_photos`). The history page
is filled with verified facts from `app/Support/HistorySeed.php` the first time it is opened; after that it is only
edited in Admin → Povijest.

**Not stored:** fixtures, results, standings, player stats and match details come live from HRS (below).

**Admin login:** Google sign-in (Laravel Socialite). Only Google accounts listed in `ADMIN_EMAILS` get in; this is
checked on every admin request, so removing an e-mail locks that person out at once. Others see "Pristup odbijen".

**Coaching staff:** HRS lists team officials (A, B, …) per match but gives no job titles. In Admin → Stručni stožer an
admin picks people from this season's match sheets and assigns each to a team with a role (Glavni trener, Pomoćni
trener, Trener vratara, Kondicijski trener). The name is copied, so team pages work when HRS is down.

## HRS data

HRS has no official public API. The site reads the same public data files that power the standings widget on
hrs.hr, served by HRS's data vendor (Sportinfocentar):

- `https://www.sportinfocentar2.com/coman/natjecanje<competitionId>.js` — standings, all matches, player season stats
- `https://www.sportinfocentar2.com/coman/utakmice/<matchId>.js` — lineups with per-player stats, play-by-play
- `https://api.hrs.hr/ed/licence/1` — list of current competitions (used to find IDs)

Code lives in `app/Services/Hrs/`:

- `config/hrs.php` — club id and **the competition IDs for each team. Update these at the start of every season.**
- `FeedParser.php` — the files are JavaScript object literals, not JSON; they are converted token by token and never executed
- `HrsClient.php` — fetching with a cache (competitions 5 min, match files 1 min live / 1 h finished); serves the last good copy if HRS is down
- `HrsService.php` — converts vendor field names into plain arrays for the views; match pages only for our club's matches

The feed is unofficial and may change without notice — if pages show "trenutno nisu dostupni", check the log for
`HRS feed` errors.

## E-mail

All e-mails use one template: the club crest on a dark-blue header, the club colours, the motto and a footer with the
contact details from Admin → Kontakt podaci. The crest is embedded in the e-mail itself, so it shows even when the
mail client blocks remote images.

- **Contact form** (`/contact`): the message goes to `CONTACT_RECIPIENT` (or the club e-mail from Admin → Kontakt
  podaci) with "Reply" set to the visitor, and the visitor gets a "Hvala na poruci" confirmation.
- **Any other club e-mail:** `Mail::to($email)->send(new ClubMail(subjectLine: …, heading: …, paragraphs: [...], buttonText: …, buttonUrl: …))`.
- **Preview:** Admin → E-mail predložak (`/admin/email-preview`) shows the template with sample text.
  `php artisan mail:test you@example.com` sends that sample, to check the mail settings.

Sending needs an SMTP account (`MAIL_*` settings) — e.g. the club's Gmail/Google Workspace (app password), Brevo or
Mailgun. `MAIL_FROM_ADDRESS` should be an address that account may send from.

## Deploying on Render

`render.yaml` (a Render Blueprint) creates a Docker web service (`Dockerfile`: PHP 8.3 + Apache) and its Postgres
database.

**1. Google sign-in (one time).** In [Google Cloud Console](https://console.cloud.google.com/):
- Create a project → *APIs & Services* → *OAuth consent screen*: user type **External**, app name "RK Biograd",
  your email as support/developer contact. Publish it (only name/email/profile scopes are used, no review needed).
- *Credentials* → *Create credentials* → *OAuth client ID* → type **Web application**.
  Authorized redirect URI: `https://<service-name>.onrender.com/api/callback` (add
  `https://<your-domain>/api/callback` too once a custom domain is used). Keep the client ID and secret.

**2. Code on GitHub.** Push this branch to GitHub (Render deploys from it).

**3. Create the Blueprint.** Render dashboard → *New* → *Blueprint* → choose the repository and branch. Render reads
`render.yaml` and asks for `ADMIN_EMAILS`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `PUBLIC_URL` (empty = the
onrender.com address) and the mail settings (`MAIL_HOST`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`).
`DB_URL` and `APP_KEY` are filled in automatically.

**4. Deploy.** Each deploy builds the Docker image (Composer + `npm run build`), runs `php artisan migrate --force`,
then starts Apache. Render checks `/healthz`.

**5. Test.** Open `/admin` → sign in with Google → you land on the dashboard. Send yourself a message through the
contact form to check e-mail.

**Moving from the earlier Node version:** the tables and columns are the same, so the Laravel app can use the existing
Render database as it is — migrations only create tables that are missing (Laravel keeps its sessions in
`web_sessions`; the old `sessions` table is no longer used). Uploaded image URLs (`/api/images/…`) and the Google
redirect URI (`/api/callback`) are unchanged. Point `DB_URL` at the old database instead of creating a new one if you
want to keep the data.

**Custom domain (optional):** service → *Settings* → *Custom Domains* → add `rkbiograd.hr` and follow the DNS steps,
set `PUBLIC_URL=https://rkbiograd.hr`, and add `https://rkbiograd.hr/api/callback` to the Google redirect URIs.
