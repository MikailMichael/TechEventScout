const express = require("express"); // imports express library
const cors = require("cors"); // imports CORS middleware
const events = require("./data/events.json"); // loads sample events from json file

const app = express(); // creates express app instance
app.use(cors()); // enables CORS so frontend can talk to backend

// GET route for path /events
app.get("/events", (req, res) => {
    res.json(events); // sends back list of events as a JSON HTTP response
});

const PORT = process.env.port || 3001; // use environ variable PORT (deployment), default 3001
app.listen(PORT, () => console.log(`API listening on port ${PORT}`)); // starts server