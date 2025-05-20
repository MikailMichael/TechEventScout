const { chromium } = require('playwright');
const axios = require('axios');

const URL = "https://www.eventbrite.com/d/united-kingdom--london/tech-conferences/";

module.exports = async function scrapeEventbrite() {
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