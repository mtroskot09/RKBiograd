@props(['person'])
{{-- Coach photo (uploaded in admin) or initials on the club gradient. --}}
@if ($person->photo_url)
    <img src="{{ $person->photo_url }}" alt="{{ $person->first_name }} {{ $person->last_name }}" loading="lazy"
         {{ $attributes->merge(['class' => 'rounded-full object-cover ring-2 ring-accent shrink-0']) }}>
@else
    <div aria-hidden="true" {{ $attributes->merge(['class' => 'rounded-full bg-brand-gradient ring-2 ring-accent flex items-center justify-center text-white font-display font-bold shrink-0']) }}>
        {{ $person->initials }}
    </div>
@endif
