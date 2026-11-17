<?php

namespace Tests\Unit;

use App\Services\Hrs\FeedParser;
use App\Services\Hrs\HrsUnavailableException;
use PHPUnit\Framework\TestCase;

class FeedParserTest extends TestCase
{
    public function test_parses_a_javascript_object_literal(): void
    {
        $data = FeedParser::parse(<<<'JS'
            var natjecanjeobjekt = {
                "broj": 2014, mu: 05, naziv: 'RK "Biograd"', e1: "Zagreb 0:0",
                lige: [{ broj: 4072, tablica: [{ por: 01, bod: 0, raz: -007 }], prazno: undefined, }],
                ok: true, // comment
            };
            JS);

        $this->assertSame(2014, $data['broj']);
        $this->assertSame(5, $data['mu']);
        $this->assertSame('RK "Biograd"', $data['naziv']);
        $this->assertSame('Zagreb 0:0', $data['e1']);
        $this->assertSame(['por' => 1, 'bod' => 0, 'raz' => -7], $data['lige'][0]['tablica'][0]);
        $this->assertNull($data['lige'][0]['prazno']);
        $this->assertTrue($data['ok']);
    }

    public function test_keeps_strings_with_digits_and_decimals(): void
    {
        $data = FeedParser::parse('x = { pc: "2026-09-20T19:00:00", f: 0.5, g: 05.25 }');

        $this->assertSame('2026-09-20T19:00:00', $data['pc']);
        $this->assertSame(0.5, $data['f']);
        $this->assertSame(5.25, $data['g']);
    }

    public function test_fails_without_an_object(): void
    {
        $this->expectException(HrsUnavailableException::class);
        FeedParser::parse('<html>Not found</html>');
    }
}
