const { chromium } = require('playwright');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Eventbrite page to scrape
const URL = "https://www.eventbrite.co.uk/d/united-kingdom--london/tech-events/";

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
  const eventIds = eventLinks
    .map(link => {
      console.log(link);
      const match = link.match(/tickets-(\d+)/); // after the litleral string tickets- captures one or more digits
      console.log(match);
      return match ? match[1] : null; 
    })
    .filter(Boolean);

  if (eventIds.length === 0) {
    console.error("❌ No event IDs found.");
    return;
  }

  console.log(`Found ${eventIds.length} event IDs.`);

  // Prepare Eventbrite JSON API URL
  const eventbriteAPI = `https://www.eventbrite.co.uk/api/v3/destination/events/?event_ids=${eventIds.join(",")}&expand=event_sales_status,image,primary_venue,saves,ticket_availability,primary_organizer,public_collections`;

  try {
    console.log("Fetching event data...");
    const res = await axios.get(eventbriteAPI, {
      headers: {
        // Spoof browser headers to avoud 403
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json"
      }
    });

    const events = res.data.events || [];

    console.log(`Fetched events: ${events}`);

    const formatted = events.map(evt ({
      title: evt.name?.text,
      date: evt.start?.local,
      location: evt.primary_venue?.address?.localized_address_display || "London",
      tags: ["Tech"],
      link: `https://www.eventbrite.co.uk/e/${evt.id}`
    }));

    console.log(`Formatted events: ${formatted}`);

    const filePath = path.join(__dirname, "data", "events2.json");
    fs.writeFileSync(filePath, JSON.stringify(path.format, null, 2));
    console.log(`✅ Saved ${formatted.length} events to events2.json`);
  } catch (err) {
    console.error("❌ Failed to fetch event details:", err.message);
  }
}

scrapeEventbrite();