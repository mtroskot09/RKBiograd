@extends('emails.layout')

@section('preheader', "{$senderName}: ".\Illuminate\Support\Str::limit($text, 80))
@section('heading', 'Nova poruka s web stranice')

@section('content')
    <p style="margin:0 0 20px;">Netko je poslao poruku putem kontakt obrasca na web stranici kluba.</p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 20px; font-size:15px;">
        <tr>
            <td style="padding:6px 0; width:90px; color:#545D78;">Ime</td>
            <td style="padding:6px 0; font-weight:600;">{{ $senderName }}</td>
        </tr>
        <tr>
            <td style="padding:6px 0; color:#545D78;">E-mail</td>
            <td style="padding:6px 0; font-weight:600;"><a href="mailto:{{ $senderEmail }}" style="color:#0B1A65;">{{ $senderEmail }}</a></td>
        </tr>
    </table>

    <div style="padding:16px 20px; border-left:4px solid #27A7F1; border-radius:4px; background-color:#EAF6FE; white-space:pre-line;">{{ $text }}</div>

    <p style="margin:20px 0 0; font-size:14px; color:#545D78;">Odgovorite na ovaj e-mail i odgovor će stići izravno pošiljatelju.</p>
@endsection
