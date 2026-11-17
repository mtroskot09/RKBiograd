<?php

// Club-wide settings and texts used across the site.
return [
    'motto' => 'SVIM SRCEM - ZA BIOGRAD!',

    // Official RK Biograd social media profiles (footer, contact page, e-mails).
    'facebook_url' => 'https://www.facebook.com/rukometniklub.biograd/',
    'instagram_url' => 'https://www.instagram.com/rkbiograd/',

    // Anyone with a Google account can sign in, so only these e-mails get admin access.
    // Checked on every admin request, so removing someone takes effect at once.
    'admin_emails' => array_values(array_filter(array_map(
        fn ($email) => strtolower(trim($email)),
        explode(',', (string) env('ADMIN_EMAILS', '')),
    ))),

    // Contact form messages go here; empty = the e-mail from Admin → Kontakt podaci.
    'contact_recipient' => env('CONTACT_RECIPIENT'),
];
