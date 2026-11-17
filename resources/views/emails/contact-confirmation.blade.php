@extends('emails.layout')

@section('preheader', 'Primili smo vašu poruku i javit ćemo vam se uskoro.')
@section('heading', 'Hvala na poruci!')

@section('content')
    <p style="margin:0 0 16px;">Poštovani/a {{ $senderName }},</p>
    <p style="margin:0 0 20px;">primili smo vašu poruku i javit ćemo vam se što je prije moguće. Za vašu evidenciju, ovo ste nam poslali:</p>

    <div style="padding:16px 20px; border-left:4px solid #27A7F1; border-radius:4px; background-color:#EAF6FE; color:#545D78; white-space:pre-line;">{{ $text }}</div>

    <p style="margin:20px 0 0;">Vidimo se u Sportskoj dvorani Biograd!</p>
@endsection
