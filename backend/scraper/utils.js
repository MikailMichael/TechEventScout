// utils.js
// Utility functions shared across the project: logging, retries, formatting, and file saving.

// tagMap maps normalized tags to canonical names.
// Example: "Artificial Intelligence" → "AI", "startup_event" → "Startups"
// Tags not in this map will fall back to capitalized form.
const tagMap = require('../data/tagMap.json');
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
      : type === "warning"
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
  const canonicalized = normalized.map(tag => tagMap[tag] || "Other");

  const tagSet = new Set(canonicalized);
  const content = `${title} ${description}`.toLowerCase();

  // Search the title/description for any tagMap keys
  for (const [keyword, mappedTag] of Object.entries(tagMap)) {
    if (content.includes(keyword.toLowerCase()) && !tagSet.has(mappedTag)) {
      tagSet.add(mappedTag);
    }
  }

  const sorted = Array.from(tagSet).sort((a, b) => {
    if (a === "Other") return 1; // push "Other down"
    if (b === "Other") return -1; // bring other tags up
    return 0;
  });

  return [sorted];
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

module.exports = { retry, log, formatDateTime, saveJSON, processTags, insertEvents, deDuplicateEvents };