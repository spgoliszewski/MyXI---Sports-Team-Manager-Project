const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const tmHtml = fs.readFileSync(path.resolve(rootDir, 'transfermarkt-liv-2324.html'), 'utf8');
const tmGamesHtml = fs.readFileSync(path.resolve(rootDir, 'transfermarkt-liv-2324-games.html'), 'utf8');

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function fixMojibake(s) {
  if (!/[Ãâ€]/.test(s)) return s;
  try {
    return Buffer.from(s, 'latin1').toString('utf8');
  } catch {
    return s;
  }
}

function stripTags(s) {
  return fixMojibake(decodeEntities(s.replace(/<[^>]*>/g, ' '))).replace(/\s+/g, ' ').trim();
}

function parseIntSafe(v) {
  if (!v || v === '-' || /Not used|Not in squad/i.test(v)) return 0;
  const n = parseInt(String(v).replace(/[^0-9-]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
}

function parseMinutes(v) {
  if (!v || v === '-' || /Not used|Not in squad/i.test(v)) return 0;
  return parseIntSafe(String(v).replace('.', '').replace("'", ''));
}

function mapPosition(positionLabel, groupLabel) {
  const posMap = {
    Goalkeeper: ['GK'],
    Defender: ['CB'],
    Midfield: ['CM'],
    Attack: ['ST'],
    'Centre-Back': ['CB'],
    'Left-Back': ['LB'],
    'Right-Back': ['RB'],
    'Defensive Midfield': ['CDM'],
    'Central Midfield': ['CM'],
    'Attacking Midfield': ['CAM'],
    'Left Winger': ['LW'],
    'Right Winger': ['RW'],
    'Centre-Forward': ['ST'],
  };

  return posMap[positionLabel] || posMap[groupLabel] || ['CM'];
}

function parseDdMmYyyyFromCell(text) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const match = cleaned.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return new Date('2024-01-01T00:00:00.000Z').toISOString();
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).toISOString();
}

function stripToFormation(rawSystem) {
  const system = rawSystem.replace(/\s+/g, ' ').trim();
  const match = system.match(/\d-\d-\d(?:-\d)?/);
  return match ? match[0] : '4-3-3';
}

const rowRegex = /<tr[^>]*class="(?:odd|even)"[^>]*>[\s\S]*?<td class="rechts[^"]*"[^>]*>[\s\S]*?<\/td>\s*<\/tr>/g;
const playerRows = [...tmHtml.matchAll(rowRegex)].map((m) => m[0]);
const players = [];
for (const row of playerRows) {
  if (!/hauptlink/.test(row)) continue;
  const nameMatch = row.match(/<a[^>]*title="([^"]+)"[^>]*href="([^\"]+\/profil\/spieler\/([0-9]+))"/);
  if (!nameMatch) continue;
  const fullName = stripTags(nameMatch[1]);
  const numericId = nameMatch[3];

  const photoMatch = row.match(/<img src="([^"]+)"[^>]*class="bilderrahmen-fixed"/);
  const photoUrl = photoMatch ? photoMatch[1] : undefined;

  const rn = row.match(/<div class=rn_nummer>([^<]+)<\/div>/);
  const jerseyNumber = rn ? stripTags(rn[1]) : '-';

  const groupMatch = row.match(/<td title="([^"]+)" class="zentriert rueckennummer/);
  const posMatch = row.match(/<\/tr><tr><td>([^<]+)<\/td><\/tr><\/table><\/td>/);
  const groupLabel = groupMatch ? stripTags(groupMatch[1]) : 'Midfield';
  const positionLabel = posMatch ? stripTags(posMatch[1]) : groupLabel;

  const zCells = [...row.matchAll(/<td[^>]*class="zentriert[^"]*"[^>]*>([\s\S]*?)<\/td>/g)].map((m) => stripTags(m[1]));
  if (zCells.length < 5) continue;

  const age = parseIntSafe(zCells[1]);

  const nationalityMatch = row.match(/<td class="zentriert">\s*(?:<img [^>]*alt="([^"]+)"[^>]*\/?>)/);
  const nationality = nationalityMatch ? stripTags(nationalityMatch[1]) : 'Unknown';

  const notUsed = /Not used|Not in squad/i.test(zCells[4]);

  const matchesPlayed = notUsed ? 0 : parseIntSafe(zCells[4]);
  const goals = notUsed ? 0 : parseIntSafe(zCells[5]);
  const assists = notUsed ? 0 : parseIntSafe(zCells[6]);
  const yellow = notUsed ? 0 : parseIntSafe(zCells[7]);
  const secondYellow = notUsed ? 0 : parseIntSafe(zCells[8]);
  const red = notUsed ? 0 : parseIntSafe(zCells[9]);

  const minuteMatch = row.match(/<td class="rechts[^"]*">([\s\S]*?)<\/td>\s*<\/tr>/);
  const minutes = minuteMatch ? parseMinutes(stripTags(minuteMatch[1])) : 0;

  const positions = mapPosition(positionLabel, groupLabel);

  const parts = fullName.split(' ');
  const firstName = parts.slice(0, -1).join(' ') || fullName;
  const lastName = parts.length > 1 ? parts[parts.length - 1] : '';

  players.push({
    id: `lfc-${numericId}`,
    firstName,
    lastName,
    age: age || 24,
    nationality,
    height: positions[0] === 'GK' ? 193 : 182,
    weight: positions[0] === 'GK' ? 87 : 76,
    positions,
    jerseyNumber: jerseyNumber === '-' ? undefined : jerseyNumber,
    photoUrl,
    stats: {
      goals,
      assists,
      secondAssists: 0,
      yellowCards: yellow,
      redCards: red,
      minutesPlayed: minutes,
      matchesPlayed,
    },
  });
}

players.sort((a, b) => {
  const aPos = a.positions[0] || '';
  const bPos = b.positions[0] || '';
  if (aPos !== bPos) return aPos.localeCompare(bPos);
  return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
});

const competitionNames = {
  GB1: 'Premier League',
  EL: 'UEFA Europa League',
  FAC: 'FA Cup',
  CGB: 'EFL Cup',
};

const matches = [];
let matchIndex = 1;
const competitionRegex = /<a name="(GB1|EL|FAC|CGB)"[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/g;
for (const competitionMatch of tmGamesHtml.matchAll(competitionRegex)) {
  const tbodyHtml = competitionMatch[2];

  for (const rowMatch of tbodyHtml.matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
    const rowHtml = rowMatch[1];
    const tdCells = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => m[1]);
    if (tdCells.length < 10) continue;

    const dateCell = stripTags(tdCells[1]);
    const venue = stripTags(tdCells[3]);
    const opponent = stripTags(tdCells[6]);
    const formation = stripToFormation(stripTags(tdCells[7]));
    const resultText = stripTags(tdCells[9]);

    const scoreMatch = resultText.match(/(\d+)\s*:\s*(\d+)/);
    if (!scoreMatch) continue;

    const firstScore = Number(scoreMatch[1]);
    const secondScore = Number(scoreMatch[2]);
    const isHome = venue === 'H';

    matches.push({
      id: `lfc-2324-match-${String(matchIndex).padStart(3, '0')}`,
      opponent,
      date: parseDdMmYyyyFromCell(dateCell),
      location: isHome ? 'Anfield' : 'Away',
      type: isHome ? 'home' : 'away',
      status: 'completed',
      score: {
        team: isHome ? firstScore : secondScore,
        opponent: isHome ? secondScore : firstScore,
      },
      formation,
    });

    matchIndex += 1;
  }
}

matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

const out = {
  players,
  matches,
};

fs.writeFileSync(path.resolve(__dirname, 'lib', 'liverpool2324Data.generated.json'), JSON.stringify(out, null, 2));
console.log('players', players.length, 'matches', out.matches.length);
