@extends('emails.layout')

@section('preheader', $preheader ?? '')
@section('heading', $heading)

@section('content')
    @foreach ($paragraphs as $paragraph)
        <p style="margin:0 0 16px;">{!! nl2br(e($paragraph)) !!}</p>
    @endforeach

    @if ($buttonText && $buttonUrl)
        {{-- "Bulletproof" button: a coloured table cell, so it also works in Outlook --}}
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;">
            <tr>
                <td align="center" bgcolor="#0B1A65" style="border-radius:999px; background-color:#0B1A65;">
                    <a href="{{ $buttonUrl }}" target="_blank"
                       style="display:inline-block; padding:14px 32px; font-family:Inter, 'Segoe UI', Helvetica, Arial, sans-serif; font-size:15px; font-weight:600; color:#FFFFFF; text-decoration:none; border-radius:999px;">
                        {{ $buttonText }} &rarr;
                    </a>
                </td>
            </tr>
        </table>
    @endif
@endsection
