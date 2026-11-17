<?php

namespace App\Services\Hrs;

/**
 * Feed files are JavaScript, not JSON, e.g. `var natjecanjeobjekt = { "broj": 2014, mu: 05, ... };`
 * They have unquoted keys, numbers with leading zeros and sometimes trailing commas. They are
 * never executed: the object literal is rewritten token by token into JSON and decoded.
 */
class FeedParser
{
    public static function parse(string $text): array
    {
        $start = strpos($text, '{');
        $end = strrpos($text, '}');
        if ($start === false || $end === false || $end < $start) {
            throw new HrsUnavailableException('no object found in response');
        }

        $data = json_decode(self::toJson(substr($text, $start, $end - $start + 1)), true, 512, JSON_BIGINT_AS_STRING);
        if (! is_array($data)) {
            throw new HrsUnavailableException('could not parse response ('.json_last_error_msg().')');
        }

        return $data;
    }

    private static function toJson(string $js): string
    {
        $out = '';
        $length = strlen($js);
        $comma = null; // position in $out of a comma not yet followed by a value

        for ($i = 0; $i < $length;) {
            $c = $js[$i];
            if ($c === '"' || $c === "'" || ctype_alnum($c) || $c === '-' || $c === '.' || $c === '_' || $c === '$') {
                $comma = null; // a string, number or identifier follows
            }

            // String literal: double-quoted ones are copied, single-quoted ones re-encoded.
            if ($c === '"' || $c === "'") {
                $j = $i + 1;
                while ($j < $length && $js[$j] !== $c) {
                    $j += $js[$j] === '\\' ? 2 : 1;
                }
                $literal = substr($js, $i, $j - $i + 1);
                $out .= $c === '"' ? $literal : json_encode(stripcslashes(substr($literal, 1, -1)), JSON_UNESCAPED_UNICODE);
                $i = $j + 1;

                continue;
            }

            // Comments.
            if ($c === '/' && ($js[$i + 1] ?? '') === '/') {
                $i = strpos($js, "\n", $i) ?: $length;

                continue;
            }
            if ($c === '/' && ($js[$i + 1] ?? '') === '*') {
                $i = (strpos($js, '*/', $i + 2) ?: $length - 2) + 2;

                continue;
            }

            // Number: drop leading zeros ("05" → "5", "-007.5" → "-7.5").
            if (preg_match('/\G-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/', $js, $m, 0, $i)) {
                $number = preg_replace('/^(-?)0+(?=\d)/', '$1', $m[0]);
                $number = preg_replace(['/^(-?)\./', '/\.(?=$|[eE])/'], ['${1}0.', '.0'], $number);
                $out .= $number;
                $i += strlen($m[0]);

                continue;
            }

            // Identifier: an unquoted key gets quotes; true/false/null stay; anything else is null.
            if (preg_match('/\G[A-Za-z_$][\w$]*/', $js, $m, 0, $i)) {
                $i += strlen($m[0]);
                $isKey = preg_match('/\G\s*:/', $js, $_, 0, $i);
                $out .= match (true) {
                    (bool) $isKey => json_encode($m[0]),
                    in_array($m[0], ['true', 'false', 'null'], true) => $m[0],
                    default => 'null',
                };

                continue;
            }

            // A comma followed only by whitespace/comments before } or ] is a trailing comma: blank it out.
            if (($c === '}' || $c === ']') && $comma !== null) {
                $out[$comma] = ' ';
            }
            if ($c === ',') {
                $comma = strlen($out);
            } elseif (! ctype_space($c)) {
                $comma = null;
            }

            $out .= $c;
            $i++;
        }

        return $out;
    }
}
