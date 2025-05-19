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
  console.log(`Event IDs: ${eventIds}`);

  
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
    
    const formatted = events.map(evt => ({
      title: evt.name,
      date: evt.start_date,
      time: evt.start_time,
      location: evt.primary_venue?.address?.localized_address_display || "London",
      tags: evt.tags.map(tag => tag.display_name),
      link: evt.url
    }));

    console.log(`Formatted events: ${formatted}`);

    const filePath = path.join(__dirname, "data", "events2.json");
    fs.writeFileSync(filePath, JSON.stringify(formatted, null, 2));
    console.log(`✅ Saved ${formatted.length} events to events2.json`);
  } catch (err) {
    console.error("❌ Failed to fetch event details:", err.message);
  }
}

scrapeEventbrite();