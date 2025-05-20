// eventbrite.js
// Scraper module for fetching tech events from Eventbrite's London listings page.

const { chromium } = require('playwright');
const axios = require('axios');
const { log } = require('./utils');

const URL = "https://www.eventbrite.com/d/united-kingdom--london/tech-conferences/";

/**
 * Launches a headless browser, scrapes event links from Eventbrite UI,
 * then fetches detailed event data via Eventbrite's internal API.
 * 
 * @returns {Promise<Object[]>} List of parsed event objects.
 */

module.exports = async function scrapeEventbrite() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  log("Navigating to Eventbrite...");
  await page.goto(URL, { waitUntil: "domcontentloaded" });

  // Wait for event cards to appear in DOM
  await page.waitForSelector('.horizontal-event-card__column');

  log("Extracting event links...");
  const eventLinks = await page.$$eval('a.event-card-link', links =>
    links.map(link => link.href)
  );

  await browser.close();

  // Extract unique numeric event IDs from URLs (e.g., ...tickets-123456789)
  const eventIds = Array.from(new Set( 
    eventLinks.map(link => (link.match(/tickets-(\d+)/) || [])[1]).filter(Boolean) 
  ));

  if (!eventIds.length) {
    log("❌ No event IDs found.", "error");
    return [];
  }

  log(`Found ${eventIds.length} event IDs.`, "success");

  // Chunk IDs into batches of 10 for API requests
  const chunks = eventIds.reduce((arr, _, i) =>
    i % 10 === 0 ? [...arr, eventIds.slice(i, i + 10)] : arr, []);

  let allEvents = [];

  log("Fetching event data...");
  for (const batch of chunks) {
    // Prepare Eventbrite JSON API URL
    const apiUrl = `https://www.eventbrite.co.uk/api/v3/destination/events/?event_ids=${batch.join(",")}&expand=event_sales_status,image,primary_venue,saves,ticket_availability,primary_organizer,public_collections`;

    try {
      const res = await axios.get(apiUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json"
        }
      });
      allEvents = allEvents.concat(res.data.events || []);
    } catch (err) {
      log(`❌ Error fetching batch: ${batch} ${err.message}`, "error");
    }
  }

  // Map API responses into simplified event objects
  return allEvents.map(evt => ({
    title: evt.name,
    date: evt.start_date,
    time: evt.start_time,
    location: evt.primary_venue?.address?.localized_address_display || "London",
    tags: evt.tags.map(tag => tag.display_name),
    link: evt.url
  }));
}