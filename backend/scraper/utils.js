async function retry(fn, retries = 3, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      console.warn(`Retry ${i + 1}/${retries} failed: ${err.message}`);
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

function log(message, type = "info") {
    const timestamp = new Date().toLocaleString("en-GB");
    const color = type === "error"
     ? "\x1b[31m" // red 
     : type === "success"
        ? "\x1b[32m"  // green
        : "\x1b[36m"; // cyan 
    console.log(`${color}[${timestamp}] [${type.toUpperCase()}] ${message}\x1b[0m`);
}

module.exports = { retry, log };