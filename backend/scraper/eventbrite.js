// eventbrite.js
// Scraper module for fetching tech events from Eventbrite's London listings page.

const { chromium } = require('playwright');
const axios = require('axios');
const { log, processTags, mapLocation } = require('./utils');

const URL = "https://www.eventbrite.com/d/united-kingdom--london/tech-conferences/";

/**
 * Launches a headless browser, scrapes event links from Eventbrite UI,
 * then fetches detailed event data via Eventbrite's internal API.
 * 
 * @returns {Promise<Object[]>} List of parsed event objects.
 */

module.exports = async function scrapeEventbrite(pageCount = 2) {
  const browser = await chromium.launch({ headless: true });
  let page = await browser.newPage();

  log("Navigating to Eventbrite...");
  await page.goto(URL, { waitUntil: "domcontentloaded" });

  let eventLinks = [];

  for (let i = 1; i < pageCount + 1; i++) { // Scrape 2 pages
    log(`Scraping page ${i}...`);

    // Wait for event cards to appear in DOM
    await page.waitForSelector('.horizontal-event-card__column', { timeout: 10000 });

    // Collect links on current page
    const linksOnPage = await page.$$eval('a.event-card-link', links =>
      links.map(link => link.href)
    );
    eventLinks.push(...linksOnPage);

    await page.goto(`${URL}?page=${i + 1}`, { waitUntil: "domcontentloaded" });
  }

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

  const context = await chromium.launchPersistentContext('', { headless: true });
  page = await context.newPage();

  const enrichedEvents = [];
  const monthMap = {Jan: "01", Feb: "02", Mar: "03", Apr: "04",
  May: "05", Jun: "06", Jul: "07", Aug: "08",
  Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  January: "01", February: "02", March: "03", April: "04",
  June: "06", July: "07", August: "08", September: "09",
  October: "10", November: "11", December: "12"};

  for(const evt of allEvents) {
    const eventURL = evt.url;
    let date = evt.start_date;
    let time = evt.start_time;

    try {
      // log(`Visiting event: ${eventURL}`);
      await page.goto(eventURL, { waitUntil: "domcontentloaded", timeout: 15000 });

      const datetimeText = await page.$eval('span.date-info__full-datetime', el => el.textContent.trim());
      // Format 1: Tue, 10 Jun 2025 18:00
      const ShortMatch = datetimeText.match(/(\d{1,2}) (\w{3}) (\d{4}) (\d{2}):(\d{2})/);
      // Format 2: Friday, June 13 · 5:30 - 8:30pm GMT+1
      const longMatch = datetimeText.match(/(\w+), (\w+) (\d{1,2}) · (\d{1,2})(?::(\d{2}))?\s?(am|pm)?/i);
      // Format 3: September 30 · 10am - October 1 · 4pm GMT+1
      const daylessMatch = datetimeText.match(/^([A-Za-z]+) (\d{1,2}) · (\d{1,2})(?::(\d{2}))?(am|pm)?/i);
      if (ShortMatch) {
        const [, day, month, year, hour ,minute] = ShortMatch;
        date = `${year}-${monthMap[month]}-${day.padStart(2, '0')}`;
        time = `${hour}:${minute}`;
      } else if (longMatch) {
        const [, , monthName, day, hour, minute = "00", period = "am"] = longMatch;
        let hour24 = parseInt(hour, 10);
        if (period.toLowerCase() === "pm" && hour24 !== 12) hour24 += 12;
        if (period.toLowerCase() === "am" && hour24 === 12) hour24 = 0;
        date = `2025-${monthMap[monthName]}-${day.padStart(2, '0')}`;
        time = `${hour24.toString().padStart(2, '0')}:${minute}`;
      } else if (daylessMatch) {
        const [, monthName, day, hour, minute = "00", period = "am"] = daylessMatch;
        let hour24 = parseInt(hour, 10);
        if (period.toLowerCase() === "pm" && hour24 !== 12) hour24 += 12;
        if (period.toLowerCase() === "am" && hour24 === 12) hour24 = 0;
        date = `2025-${monthMap[monthName]}-${day.padStart(2, '0')}`;
        time = `${hour24.toString().padStart(2, '0')}:${minute}`;
      } else {
        log(`⚠️ Unable to parse datetime from: "${datetimeText}"`, "warn");
      }
    } catch (err) {
      // log(`⚠️ Failed to scrape datetime from ${eventURL}: ${err.message}`, "warn");
    }

    enrichedEvents.push({
      id: evt.id,
      title: evt.name,
      description: evt.summary,
      date,
      time,
      location: mapLocation(evt.primary_venue?.address?.localized_address_display || "London"),
      tags: processTags(evt.tags.map(tag => tag.display_name), evt.name, evt.summary),
      link: evt.url,
      img: evt?.image?.url
    });
  }

  await browser.close();
  return enrichedEvents;

  /*
  // Map API responses into simplified event objects
  return allEvents.map(evt => ({
    id: evt.id,
    title: evt.name,
    description: evt.summary,
    date: evt.start_date,
    time: evt.start_time,
    location: mapLocation(evt.primary_venue?.address?.localized_address_display || "London"),
    tags: processTags(evt.tags.map(tag => tag.display_name), evt.name, evt.summary),
    link: evt.url,
    img: evt?.image?.url
  }));
  */
}