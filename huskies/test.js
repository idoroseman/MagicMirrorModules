const https = require('https');

/**
 * Fetch a page using only Node's https module.
 */
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * Very naive HTML parsing using regex & string search.
 * Looks for blocks of schedule entries.
 */
function parseSchedule(html) {
  const games = [];

  // Split by game containers (the site uses "schedule_game")
  const blocks = html.split('class="schedule_game"');

  for (const block of blocks) {
    const dateMatch = block.match(/class="schedule_date">([^<]+)/);
    const oppMatch = block.match(/class="schedule_opponent_name">([^<]+)/);
    const resultMatch = block.match(/class="schedule_game_result">([^<]*)</);
    const timeMatch = block.match(/class="schedule_game_time">([^<]*)</);

    if (!dateMatch || !oppMatch) continue; // skip if not a valid game

    const date = dateMatch[1].trim();
    const opponent = oppMatch[1].trim();
    const result = resultMatch ? resultMatch[1].trim() : null;
    const time = timeMatch ? timeMatch[1].trim() : null;

    // Location detection
    let location = 'home';
    if (opponent.toLowerCase().startsWith('at ')) location = 'away';

    games.push({ date, time, opponent, location, result });
  }

  return games;
}

async function getAllGames() {
  const url = 'https://nuhuskies.com/sports/womens-basketball/schedule';

  const html = await fetchPage(url);
  console.log(html);
  const allGames = parseSchedule(html);

  const past = [];
  const upcoming = [];

  for (const g of allGames) {
    if (g.result) past.push(g);
    else upcoming.push(g);
  }

  return { past, upcoming };
}

// Run it
(async () => {
  const obj = await getAllGames();
  console.log(JSON.stringify(obj, null, 2));
})();

