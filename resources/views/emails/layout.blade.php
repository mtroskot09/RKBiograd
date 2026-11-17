{{--
    RK Biograd e-mail template: club crest on the dark-blue header, club colours, contact footer.
    Built with tables and inline styles because that is what e-mail clients (Gmail, Outlook, Apple Mail) support.

    Use it from a mail view:
        @extends('emails.layout')
        @section('heading', 'Naslov poruke')
        @section('content') … @endsection

    The crest is embedded in the e-mail itself (not loaded from the web), so it is shown even when
    the client blocks remote images. In a browser preview there is no $message, so the public file is used.
--}}
@php
    $crest = isset($message)
        ? $message->embed(public_path('images/rk-biograd-logo.png'))
        : asset('images/rk-biograd-logo.png');
    $info = \App\Models\ClubInfo::current();
    $address = \App\Models\ClubInfo::lines($info->address);
    $navy = '#0B1A65';
    $night = '#060D33';
    $accent = '#27A7F1';
    $text = '#1A2240';
    $muted = '#545D78';
    $display = "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif";
    $sans = "Inter, 'Segoe UI', Helvetica, Arial, sans-serif";
@endphp
<!DOCTYPE html>
<html lang="hr" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>@yield('heading')</title>
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; }
        a { color: {{ $navy }}; }
        @media only screen and (max-width: 620px) {
            .container { width: 100% !important; border-radius: 0 !important; }
            .px { padding-left: 24px !important; padding-right: 24px !important; }
            .heading { font-size: 30px !important; }
        }
    </style>
</head>
<body style="margin:0; padding:0; background-color:#F4F7FB;">
    {{-- Preview text shown next to the subject in the inbox --}}
    <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">@yield('preheader')&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F7FB;">
        <tr>
            <td align="center" style="padding:32px 12px;">
                <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0"
                       style="width:600px; max-width:600px; background-color:#FFFFFF; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(11,26,101,0.12);">

                    {{-- Header with the crest --}}
                    <tr>
                        <td style="height:5px; line-height:5px; font-size:0; background-color:{{ $accent }};">&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="center" bgcolor="{{ $navy }}" class="px"
                            style="padding:32px 40px 28px; background-color:{{ $navy }}; background-image:linear-gradient(135deg, {{ $night }} 0%, {{ $navy }} 55%, #0D3C93 100%);">
                            <img src="{{ $crest }}" width="84" height="120" alt="Grb RK Biograd"
                                 style="display:block; width:84px; height:120px; border:0; outline:none; text-decoration:none;">
                            <div style="margin-top:14px; font-family:{{ $display }}; font-size:30px; font-weight:800; letter-spacing:3px; text-transform:uppercase; color:#FFFFFF; line-height:1;">
                                RK Biograd
                            </div>
                            <div style="margin-top:6px; font-family:{{ $sans }}; font-size:11px; font-weight:600; letter-spacing:4px; text-transform:uppercase; color:{{ $accent }};">
                                Rukometni klub &middot; od 1963.
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:5px; line-height:5px; font-size:0; background-color:{{ $accent }};">&nbsp;</td>
                    </tr>

                    {{-- Message --}}
                    <tr>
                        <td class="px" style="padding:40px 48px 8px; font-family:{{ $sans }}; color:{{ $text }};">
                            <h1 class="heading" style="margin:0; font-family:{{ $display }}; font-size:36px; font-weight:800; line-height:1.05; text-transform:uppercase; letter-spacing:0.5px; color:{{ $navy }};">
                                @yield('heading')
                            </h1>
                            <div style="width:48px; height:4px; margin:14px 0 24px; border-radius:2px; background-color:{{ $accent }}; font-size:0; line-height:0;">&nbsp;</div>
                            <div style="font-size:16px; line-height:1.65; color:{{ $text }};">
                                @yield('content')
                            </div>
                        </td>
                    </tr>

                    {{-- Sign-off --}}
                    <tr>
                        <td class="px" style="padding:24px 48px 40px; font-family:{{ $sans }};">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #E1E7F0;">
                                <tr>
                                    <td style="padding-top:24px; font-size:15px; line-height:1.5; color:{{ $muted }};">
                                        Sportski pozdrav,<br>
                                        <strong style="color:{{ $navy }};">RK Biograd</strong>
                                        <div style="margin-top:10px; font-family:{{ $display }}; font-size:20px; font-weight:800; letter-spacing:1px; text-transform:uppercase; color:{{ $accent }};">
                                            {{ config('club.motto') }}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Footer with club contacts --}}
                    <tr>
                        <td style="height:4px; line-height:4px; font-size:0; background-color:{{ $accent }};">&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="center" bgcolor="{{ $night }}" class="px"
                            style="padding:28px 40px; background-color:{{ $night }}; font-family:{{ $sans }}; font-size:13px; line-height:1.7; color:#B8C2DE;">
                            <img src="{{ $crest }}" width="28" height="40" alt="" style="display:block; width:28px; height:40px; border:0; margin:0 auto 10px;">
                            @if ($address)
                                {{ implode(', ', $address) }}<br>
                            @endif
                            @if ($info->phone)
                                <a href="{{ $info->phoneHref() }}" style="color:#FFFFFF; text-decoration:none;">{{ $info->phone }}</a>
                            @endif
                            @if ($info->phone && $info->email) &nbsp;&middot;&nbsp; @endif
                            @if ($info->email)
                                <a href="mailto:{{ $info->email }}" style="color:#FFFFFF; text-decoration:none;">{{ $info->email }}</a>
                            @endif
                            <div style="margin-top:12px;">
                                <a href="{{ url('/') }}" style="color:{{ $accent }}; font-weight:600; text-decoration:none;">{{ preg_replace('#^https?://#', '', url('/')) }}</a>
                                &nbsp;&middot;&nbsp;
                                <a href="{{ config('club.facebook_url') }}" style="color:{{ $accent }}; font-weight:600; text-decoration:none;">Facebook</a>
                                &nbsp;&middot;&nbsp;
                                <a href="{{ config('club.instagram_url') }}" style="color:{{ $accent }}; font-weight:600; text-decoration:none;">Instagram</a>
                            </div>
                            <div style="margin-top:12px; font-size:11px; color:#7F8AAB;">&copy; {{ date('Y') }} RK Biograd. Sva prava pridržana.</div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
