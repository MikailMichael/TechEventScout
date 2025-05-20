// fetchEvent.js
// Main entry point for scraping and storing event data from multiple sources.

const fs = require('fs');
const path = require('path');

const scrapeEventbrite = require('./eventbrite');
const scrapeMeetup = require('./meetup');
const { log, saveJSON } = require('./utils');

const EVENTS_FILE = path.join(__dirname, "..", "data", "events.json");

/*
 * Main function that orchestrates event scraping from all sources,
 * merges the results, and saves them to disk.
 */

async function main() {
  log("Starting event scraping...");

  // Scrape events from each source
  const eventbriteEvents = await scrapeEventbrite();
  const meetupEvents = await scrapeMeetup();

  // Combine results
  const allEvents = [...eventbriteEvents, ...meetupEvents];

  // Save to file
  await saveJSON(EVENTS_FILE, allEvents);
  log(`✅ Saved ${allEvents.length} events to ${EVENTS_FILE}`, "success");
}

// Run the main function and log any fatal errors
main().catch(err => log(`❌ Fatal error: ${err}`, "error"));