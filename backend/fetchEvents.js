const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

//const EVENTBRITE_TOKEN = "TOKEN";
//const MEETUP_API_URL = "https://api.meetup.com/gql";
//const TOKEN = "YOUR_MEETUP_TOKEN_HERE";

/*
const fetchEventbriteEvents = async () => {
  try {
    const response = await axios.get("")
  }
}
*/
const URL = "https://www.eventbrite.co.uk/d/united-kingdom--london/tech-events/"

async function scrapeEventbrite() {
  try {
    const { data } = await axios.get(URL);

    const $ = cheerio.load(data);
    

    const events = [];

    $(".search-event-card-wrapper").each((i, el) => {
      const title = $(el).find(".eds-event-card-content__primary-content").text().trim();
      const date = $(el).find(".eds-event-card-content__sub-title").first().text().trim();
      const location = "London";
      const link = $(el).find("a.eds-event-card-content__action-link").attr("href");

      if (title && date) {
        events.push({ title, date, location, tags: ["Tech"], link });
      }
    });

    const filePath = path.join(__dirname, "data", "events2.json");
    fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
    console.log(`✅ Scraped ${events.length} events and saved to events2.json`); 
  } catch {
    console.log("❌ Error scraping Eventbrite:", err);
  }
}

scrapeEventbrite();