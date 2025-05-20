const fs = require('fs');
const path = require('path');

const scrapeEventbrite = require('./eventbrite');
const scrapeMeetup = require('./meetup');
const { log, saveJSON } = require('./utils');
const EVENTS_FILE = path.join(__dirname, "..", "data", "events.json");

async function main() {
  console.log("Starting event scraping...");

  const eventbriteEvents = await scrapeEventbrite();
  const meetupEvents = await scrapeMeetup();
  const allEvents = [...eventbriteEvents, ...meetupEvents];

  await saveJSON(EVENTS_FILE, allEvents);
  log(`✅ Saved ${allEvents.length} events to ${EVENTS_FILE}`, "success");
}

main().catch(err => log(`❌ Fatal error: ${err}`, "error"));