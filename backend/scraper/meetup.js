const { chromium } = require('playwright');
const axios = require('axios');

const { retry } = require("./utils");

const MEETUPURL = "https://www.meetup.com/find/?location=gb--17--London&source=EVENTS&keywords=tech%20networking";

module.exports = async function scrapeMeetupEvents() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log("Navigating to Meetup...");
  await page.goto(MEETUPURL, { waitUntil: "domcontentloaded" });

  console.log("Waiting for event links...");
  await retry(() =>
    page.waitForSelector('a[data-event-label="Revamped Event Card"]', { timeout: 2000 }));

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