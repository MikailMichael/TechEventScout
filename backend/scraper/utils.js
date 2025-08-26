// utils.js
// Utility functions shared across the project: logging, retries, formatting, and file saving.

// tagMap maps normalized tags to canonical names.
// Example: "Artificial Intelligence" → "AI", "startup_event" → "Startups"
// Tags not in this map will fall back to capitalized form.
const tagMap = require('../data/tagMap.json');
const locationMap = require('../data/locationMap.json');
const fs = require("fs");
const supabase = require('../supabaseClient');

/**
 * Retries a given async function multiple times before failing.
 * 
 * @param {Function} fn - Async function to retry.
 * @param {number} retries - Number of retry attempts.
 * @param {number} delay - Delay in milliseconds between retries.
 * @returns {Promise<any>} - The result of the async function.
 */
async function retry(fn, retries = 3, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      log(`Retry ${i + 1}/${retries} failed: ${err.message}`, "warning");
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

/**
 * Logs a message to the console with a timestamp and optional type coloring.
 * 
 * @param {string} message - Message to log.
 * @param {string} type - Log type: "info", "success", or "error".
 */
function log(message, type = "info") {
  const timestamp = new Date().toLocaleString("en-GB");
  const color = type === "error"
    ? "\x1b[31m" // Red 
    : type === "success"
      ? "\x1b[32m"  // Green
      : type === "warn"
        ? "\x1b[33m" // Yellow
        : "\x1b[36m"; // Cyan 
  console.log(`${color}[${timestamp}] [${type.toUpperCase()}] ${message}\x1b[0m`);
}

/**
 * Formats an ISO date/time string into separate date and time values.
 * 
 * @param {string} isoString - The ISO date string.
 * @returns {Object} - An object with 'date' and 'time' strings, or null if invalid.
 */
function formatDateTime(isoString) {
  const dateObj = new Date(isoString);
  if (isNaN(dateObj)) return { date: null, time: null };

  const date = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
  const time = dateObj.toTimeString().slice(0, 5); // HH:MM
  return { date, time };
}

/**
 * Saves data to a JSON file, with optional append mode.
 * 
 * @param {string} filepath - Path to the JSON file.
 * @param {Object[]} data - Data to save.
 * @param {boolean} append - Whether to append to existing file content.
 */
async function saveJSON(filepath, data, append = false) {
  let output = data;

  if (append && fs.existsSync(filepath)) {
    const exisiting = JSON.parse(fs.readFileSync(filepath));
    output = [...exisiting, ...data];
  }

  fs.writeFileSync(filepath, JSON.stringify(output, null, 2));
}

/**
 * Normalize a tag string by converting to lowercase, replacing underscores and dashes
 * with spaces, collapsing multiple spaces, and trimming whitespace.
 * 
 * @param {string} tag - The tag to normalize.
 * @returns {string} Normalized tag.
 */
function normalizeTag(tag) {
  return tag.toLowerCase().replace(/[_-]/g, " ").replace(/\s+/g, " ").trim();
}

/*
function normalizeTagArray(tags) {
  if (Array.isArray(tags) && tags.length === 1 && Array.isArray(tags[0])) {
    return tags[0];
  }
  return tags;
}
*/

/**
 * Capitalize the first letter of each word in a tag string.
 * 
 * @param {string} tag - The tag to capitalize.
 * @returns {string} Capitalized tag (e.g. "machine learning" → "Machine Learning").
 */
function capitalizeTag(tag) {
  return tag.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

/**
 * Deduplicate a list of tags after normalization, preserving the first occurrence.
 * 
 * @param {string[]} tags - An array of raw tag strings.
 * @returns {string[]} Array of unique, normalized tags.
 */
function deDuplicateTags(tags) {
  const seen = new Set();
  return tags.map(normalizeTag).filter(tag => {
    if (seen.has(tag)) return false;
    seen.add(tag);
    return true;
  });
}

/**
 * Normalize, deduplicate, and canonicalize tags using a predefined tag map.
 * Filters out tags mapped to "Other" and ensures capitalization.
 * Sorts tags so that "Other" is the last tag.
 * 
 * @param {string[]} rawTags - Array of raw tag strings from event sources.
 * @returns {string[]} Array of cleaned and canonicalized tags.
 */
function processTags(rawTags, title = "", description = "") {
  const cleanedInput = rawTags.filter(tag => typeof tag === "string" && tag.trim()); // Remove nulls, undefined, and empty strings
  const normalized = deDuplicateTags(cleanedInput);
  const canonicalized = normalized.map(tag => tagMap[tag]/* || "Other"*/).filter(tag => tag != null);

  const tagSet = new Set(canonicalized);
  const content = `${title} ${description}`.toLowerCase();

  // Search the title/description for any tagMap keys
  for (const [keyword, mappedTag] of Object.entries(tagMap)) {
    if (content.includes(keyword.toLowerCase()) && !tagSet.has(mappedTag)) {
      tagSet.add(mappedTag);
    }
  }

  if (tagSet.size === 0) tagSet.add("Other");

  return Array.from(tagSet);
}

/**
 * Inserts or updates a batch of event records in the 'events' table using Supabase.
 * Utilizes upsert to avoid duplicates bosed on the 'id' column.
 * Each object should match the schema of the 'events' table.
 * 
 * @param {Array<Object>} events - Array of event objects to be inserted or updated.
 */
async function insertEvents(events) {
  const { error } = await supabase.from('events').upsert(events, { onConflict: 'id' });

  if (error) {
    log(`Error inserting events: ${error.message}`, 'error');
  } else {
    log(`✅ Successfully inserted/updated ${events.length} events`, 'success');
  }
}

/**
 * Removes duplicate events based on their unique ID.
 * If multiple events share the same ID, only the last one is retained.
 * 
 * @param {Array} events - Array of event objects to deduplicate
 * @returns {Array} - Array of unqiue event objects
 */
function deDuplicateEvents(events) {
  const uniqueEventsMap = new Map();

  for (const event of events) {
    uniqueEventsMap.set(event.id, event);
  }
  return Array.from(uniqueEventsMap.values());
}

function mapLocation(location = "") {
  const cleaned = location.toUpperCase();

  if (cleaned.includes("ONLINE")) return "Online";

  const postcodeMatch = cleaned.match(/\b([A-Z]{1,2}[0-9][0-9A-Z]?)\s?[0-9][A-Z]{2}\b/);
  if (postcodeMatch) {
    const postcodePrefix = postcodeMatch[1];

    for (const { zone, postcodes } of locationMap) {
      for (const code of postcodes) {
        if (postcodePrefix.startsWith(code)) return zone;
      }
    }
  }

  for (const { zone, locations } of locationMap) {
    for (const keyword of locations) {
      if (cleaned.includes(keyword.toUpperCase())) return zone;
    }
  }

  return "London";
}

const monthMap = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04",
  May: "05", Jun: "06", Jul: "07", Aug: "08",
  Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  January: "01", February: "02", March: "03", April: "04",
  June: "06", July: "07", August: "08", September: "09",
  October: "10", November: "11", December: "12"
};

function convertTo24HourDate(month, day, hour, minute = "00", period = "am") {
  let hour24 = parseInt(hour, 10);
  if (period.toLowerCase() === "pm" && hour24 !== 12) hour24 += 12;
  if (period.toLowerCase() === "am" && hour24 === 12) hour24 = 0;

  return {
    date: `${new Date().getFullYear()}-${monthMap[month]}-${day.padStart(2, '0')}`,
    time: `${hour24.toString().padStart(2, '0')}:${minute}`
  };
}

function parseDatetimeText(datetimeText) {
  // Format 1: Tue, 10 Jun 2025 18:00
  const ShortMatch = datetimeText.match(/(\d{1,2}) (\w{3}) (\d{4}) (\d{2}):(\d{2})/);

  // Format 2: Friday, June 13 · 5:30 - 8:30pm GMT+1
  const longMatch = datetimeText.match(/(\w+), (\w+) (\d{1,2}) · (\d{1,2})(?::(\d{2}))?\s?(am|pm)? ?- ?(\d{1,2})(?::(\d{2}))?\s?(am|pm)?/i);

  // Format 3: September 30 · 10am - October 1 · 4pm GMT+1
  const daylessMatch = datetimeText.match(/^([A-Za-z]+) (\d{1,2}) · (\d{1,2})(?::(\d{2}))?(am|pm)?/i);

  if (ShortMatch) {
    const [, day, month, year, hour, minute] = ShortMatch;
    return {
      date: `${year}-${monthMap[month]}-${day.padStart(2, '0')}`,
      time: `${hour}:${minute}`
    };
  } else if (longMatch) {
    const [, , month, day, startHour, startMinute = "00", startPeriod, endHour, endMinute = "00", endPeriod] = longMatch;
    let inferredStartPeriod = startPeriod;
    if (!inferredStartPeriod) {
      if (endPeriod) {
        const startH = parseInt(startHour, 10);
        const endH = parseInt(endHour, 10);
        inferredStartPeriod = (startH <= endH) ? endPeriod : "am";
      } else inferredStartPeriod = "am";
    }
    return convertTo24HourDate(month, day, startHour, startMinute, inferredStartPeriod);
  } else if (daylessMatch) {
    const [, month, day, hour, minute = "00", period = "am"] = daylessMatch;
    return convertTo24HourDate(month, day, hour, minute, period);
  }

  return null;
}

module.exports = { retry, log, formatDateTime, saveJSON, processTags, insertEvents, deDuplicateEvents, mapLocation, monthMap, parseDatetimeText };