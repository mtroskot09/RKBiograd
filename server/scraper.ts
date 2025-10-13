import * as cheerio from 'cheerio';
import type { InsertLeagueTable } from '@shared/schema';

export async function scrapeLeagueTable(url: string): Promise<InsertLeagueTable[]> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const teams: InsertLeagueTable[] = [];
    let ourTeamName = 'RK Biograd';

    $('table tbody tr').each((index, element) => {
      const cells = $(element).find('td');
      
      if (cells.length >= 10) {
        const position = parseInt($(cells[0]).text().trim()) || index + 1;
        const teamName = $(cells[1]).text().trim();
        const played = parseInt($(cells[2]).text().trim()) || 0;
        const won = parseInt($(cells[3]).text().trim()) || 0;
        const draw = parseInt($(cells[4]).text().trim()) || 0;
        const lost = parseInt($(cells[5]).text().trim()) || 0;
        const goalsFor = parseInt($(cells[6]).text().trim()) || 0;
        const goalsAgainst = parseInt($(cells[7]).text().trim()) || 0;
        const goalDiff = parseInt($(cells[8]).text().trim()) || (goalsFor - goalsAgainst);
        const points = parseInt($(cells[9]).text().trim()) || 0;

        teams.push({
          position,
          team: teamName,
          played,
          won,
          draw,
          lost,
          goalsFor,
          goalsAgainst,
          goalDiff,
          points,
          isOurTeam: teamName.toLowerCase().includes('biograd'),
        });
      }
    });

    return teams;
  } catch (error) {
    console.error('Error scraping league table:', error);
    throw new Error('Failed to scrape league table');
  }
}
