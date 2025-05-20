const { chromium } = require('playwright');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Eventbrite & Meetup page to scrape
const URL = "https://www.eventbrite.com/d/united-kingdom--london/tech-conferences/";
const MEETUPURL = "https://www.meetup.com/find/?location=gb--17--London&source=EVENTS&keywords=tech%20networking";

const EVENTS_FILE = path.join(__dirname, "data", "events.json");

async function scrapeEventbrite() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log("Navigating to Eventbrite...");
  await page.goto(URL, { waitUntil: "domcontentloaded" });

  // Wait for event cards to load
  await page.waitForSelector('.horizontal-event-card__column');

  console.log("Extracting event links...");
  const eventLinks = await page.$$eval('a.event-card-link', links =>
    links.map(link => link.href)
  );

  await browser.close();

  // Extract event IDs from URLs
  const eventIds = Array.from(new Set( // remove duplicates, converts back into an array
    eventLinks.map(link => (link.match(/tickets-(\d+)/) || [])[1]).filter(Boolean) // after the litleral string tickets- captures one or more digitsd // remove nulls
  ));

  if (!eventIds.length) {
    console.error("❌ No event IDs found.");
    return [];
  }

  console.log(`Found ${eventIds.length} event IDs.`);

  const chunks = eventIds.reduce((arr, _, i) =>
    i % 10 === 0 ? [...arr, eventIds.slice(i, i + 10)] : arr, []);

  let allEvents = [];

  console.log("Fetching event data...");
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
      console.error(`❌ Error fetching batch: ${batch}`, err.message);
    }
  }

  return allEvents.map(evt => ({
    title: evt.name,
    date: evt.start_date,
    time: evt.start_time,
    location: evt.primary_venue?.address?.localized_address_display || "London",
    tags: evt.tags.map(tag => tag.display_name),
    link: evt.url
  }));
}

async function scrapeMeetupEvents() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log("Navigating to Meetup...");
  await page.goto(MEETUPURL, { waitUntil: "domcontentloaded" });

  console.log("Waiting for event links...");

    page.waitForSelector('a[data-event-label="Revamped Event Card"]', { timeout: 2000 })

  console.log("Extracting Meetup events...");
  const eventLinks = await page.$$eval('a[data-event-label="Revamped Event Card"]', links => {
    const seen = new Set();
    return links.map(link => {
      const href = link.href;
      if(seen.has(href)) return null;
      seen.add(href);
      return href;
    }).filter(Boolean);
  });

  console.log(`Found ${eventLinks.length} unique event links.`);

  const events = [];

  for (const url of eventLinks) { 
    const eventPage = await browser.newPage();
    await eventPage.goto(url, { waitUntil: 'domcontentloaded'});

    const isPrivate = await eventPage.$eval('span.capitalize', el =>
      el.innerText.trim().toLowerCase() === "private"
    ).catch(() => false);

    if (isPrivate) {
      console.log("❌ Skipping private group event.");
      await eventPage.close();
      continue;
    }

    const title = await eventPage.$eval('h1', el => el.innerText).catch(() => null);
    const rawDateTime = await eventPage.$eval('time', el => el.dateTime || el.innerText).catch(() => null);

    let date = null, time = null;

    if(rawDateTime) {
      const iso = new Date(rawDateTime);
      if(!isNaN(iso)) {
        date = iso.toISOString().split('T')[0]; // Gets "YYYY-MM-DD"
        time = iso.toTimeString().slice(0, 5); // Gets "HH:MM"
      }
    }

    const location = await eventPage.evaluate(() => {
      const venue = document.querySelector('[data-testid="venue-name-value"]');
      const venueText = venue?.innerText.trim().toLowerCase();

      if(venueText && venueText.includes("online event")) return "Online";

      const locationInfo = document.querySelector('[data-testid="location-info"]');
      return locationInfo?.innerText.trim() || "London";
    });

    const tags = await eventPage.$$eval('.tag--topic', el =>
      el.map(tag => tag.innerText.trim())
      .filter(tag =>
        tag &&                                      //not empty
        !tag.toLowerCase().startsWith("events in") // exclude "Events in...", case-insensitive
      )).catch(() => ["Tech"]);

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

  await browser.close();
  return events;
}

async function saveEventsToFile(events) {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
  console.log(`✅ Saved ${events.length} events to ${EVENTS_FILE}`);
}

async function main() {
  console.log("Starting event scraping...");

  const eventbriteEvents = await scrapeEventbrite();
  const meetupEvents = await scrapeMeetupEvents();

  const allEvents = [...eventbriteEvents, ...meetupEvents];
  await saveEventsToFile(allEvents);
}

main().catch(err => console.error("❌ Fatal error:", err));