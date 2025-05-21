// fetchEvent.js
// Main entry point for scraping and storing event data from multiple sources.

const { log, saveJSON } = require('./utils');

// Show usage if --help flag is passed
if (process.argv.includes('--help')) {
  log(`
    Usage: node fetchEvents.js [number_of_pages]
    
    Description:
      Scrapes tech events from Eventbrite and Meetup and saves them to a JSON file.

    Options:
      [number_of_pages]   Optional. Number of Eventbrite pages to scrape (default: 2).
      --help              Show this help message.
    
    Examples:
      node fetchEvents.js 3       # Scrape 3 pages
      node fetchEvents.js         # Scrape 2 pages (default)
  `);
  process.exit(0);
}

const path = require('path');
const scrapeEventbrite = require('./eventbrite');
const scrapeMeetup = require('./meetup');

const EVENTS_FILE = path.join(__dirname, "..", "data", "events.json");
const NUM_OF_PAGES = parseInt(process.argv[2]) || 2;


/**
 * Main function that orchestrates event scraping from all sources,
 * merges the results, and saves them to disk.
 */

async function main() {
  log("Starting event scraping...");

  // Scrape events from each source
  const eventbriteEvents = await scrapeEventbrite(NUM_OF_PAGES);
  const meetupEvents = await scrapeMeetup(NUM_OF_PAGES);

  // Combine results
  const allEvents = [...eventbriteEvents, ...meetupEvents];

  // Save to file
  await saveJSON(EVENTS_FILE, allEvents);
  log(`✅ Saved ${allEvents.length} events to ${EVENTS_FILE}`, "success");
}

// Run the main function and log any fatal errors
main().catch(err => log(`❌ Fatal error: ${err}`, "error"));