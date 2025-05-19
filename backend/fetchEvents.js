const { chromium } = require('playwright');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Eventbrite page to scrape
const URL = "https://www.eventbrite.com/d/united-kingdom--london/tech-conferences/";
const MEETUPURL = "https://www.meetup.com/find/?location=gb--17--London&source=EVENTS&keywords=tech%20networking";

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

  //console.log(`Gatheredevent links: ${eventLinks}`);
  await browser.close();

  // Extract event IDs from URLs
  const eventIds = Array.from(new Set(eventLinks // remove duplicates, converts back into an array
    .map(link => {
      const match = link.match(/tickets-(\d+)/); // after the litleral string tickets- captures one or more digitsd
      return match ? match[1] : null;
    })
    .filter(Boolean))); // remove nulls

  if (eventIds.length === 0) {
    console.error("❌ No event IDs found.");
    return;
  }

  console.log(`Found ${eventIds.length} event IDs.`);

  const chunkArray = (arr, size) =>
    arr.reduce((chunks, _, i) =>
      i % size === 0 ? [...chunks, arr.slice(i, i + size)] : chunks, []);

  const chunks = chunkArray(eventIds, 10);
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

      const batchEvents = res.data.events || [];
      allEvents = allEvents.concat(batchEvents);
    } catch (err) {
      console.error(`❌ Error fetching batch: ${batch}`, err.message);
    }
  }

  const formatted = allEvents.map(evt => ({
    title: evt.name,
    date: evt.start_date,
    time: evt.start_time,
    location: evt.primary_venue?.address?.localized_address_display || "London",
    tags: evt.tags.map(tag => tag.display_name),
    link: evt.url
  }));

  const filePath = path.join(__dirname, "data", "events2.json");
  fs.writeFileSync(filePath, JSON.stringify(formatted, null, 2));
  console.log(`✅ Saved ${formatted.length} events to events2.json`);
}

scrapeEventbrite();