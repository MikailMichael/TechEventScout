// meetup.js
// Scraper module for fetching tech-related networking events from Meetup in London.

const { chromium } = require('playwright');
const { retry, log, formatDateTime, processTags } = require("./utils");

const MEETUPURL = "https://www.meetup.com/find/?location=gb--17--London&source=EVENTS&keywords=tech%20networking";

/**
 * Public entry point to scrape Meetup events with retry support.
 * 
 * @returns {Promise<Object[]>} List of parsed event objects.
 */
module.exports = async function scrapeMeetupEvents() {
  return await retry(scrapeCore, 3, 3000);
}

/**
 * Opens a browser, navigates to the Meetup listings page,
 * scrapes event URLs, and extracts individual event details.
 * 
 * @returns {Promise<Object[]>} List of event objects.
 */
async function scrapeCore() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    log("Navigating to Meetup...");
    await page.goto(MEETUPURL, { waitUntil: "domcontentloaded" });

    log("Waiting for event links...");
    await page.waitForSelector('a[data-event-label="Revamped Event Card"]', { timeout: 15000 });

    log("Extracting Meetup events...");
    const eventLinks = await page.$$eval('a[data-event-label="Revamped Event Card"]', links => {
      const seen = new Set();
      return links.map(link => {
        const href = link.href;
        if (seen.has(href)) return null;
        seen.add(href);
        return href;
      }).filter(Boolean); // Deduplicate and clean
    });

    log(`Found ${eventLinks.length} unique event links.`, "success");

    const events = [];

    for (const url of eventLinks) {
      const eventPage = await browser.newPage();
      await eventPage.goto(url, { waitUntil: 'domcontentloaded' });

      // Skip private events
      const isPrivate = await eventPage.$eval('span.capitalize', el =>
        el.innerText.trim().toLowerCase() === "private"
      ).catch(() => false);

      if (isPrivate) {
        log("Skipping private group event.");
        await eventPage.close();
        continue;
      }

      // Extract core event info
      const title = await eventPage.$eval('h1', el => el.innerText).catch(() => null);
      const rawDateTime = await eventPage.$eval('time', el => el.dateTime || el.innerText).catch(() => null);
      const { date, time } = formatDateTime(rawDateTime);

      // Determine location
      const location = await eventPage.evaluate(() => {
        const venue = document.querySelector('[data-testid="venue-name-value"]');
        const venueText = venue?.innerText.trim().toLowerCase();

        if (venueText && venueText.includes("online event")) return "Online";

        const locationInfo = document.querySelector('[data-testid="location-info"]');
        return locationInfo?.innerText.trim() || "London";
      });

      // Extract tags, filtering out generic categories
      const rawTags = await eventPage.$$eval('.tag--topic', el =>
        el.map(tag => tag.innerText.trim())).catch(() => ["Tech"]);
        
      const tags = processTags(rawTags);

      events.push({
        title: title || "Untitled",
        date: date || null,
        time: time || null,
        location,
        tags,
        link: url
      });

      await eventPage.close();
    }
    return events;

  } finally {
    await browser.close();  // Ensure browser cleanup regardless of success or error
  }
}