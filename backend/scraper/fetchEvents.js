const fs = require('fs');
const path = require('path');

const scrapeEventbrite = require('./eventbrite');
const scrapeMeetup = require('./meetup');
const EVENTS_FILE = path.join(__dirname, "..", "data", "events.json");

async function saveEventsToFile(events) {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
  console.log(`✅ Saved ${events.length} events to ${EVENTS_FILE}`);
}

async function main() {
  console.log("Starting event scraping...");

  const eventbriteEvents = await scrapeEventbrite();
  const meetupEvents = await scrapeMeetup();
  const allEvents = [...eventbriteEvents, ...meetupEvents];

  await saveEventsToFile(allEvents);
}

main().catch(err => console.error("❌ Fatal error:", err));