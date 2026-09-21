require('dotenv').config();
const mongoose = require('mongoose');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connect({ retries = 30, delayMs = 1000 } = {}) {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Falta la variable de entorno MONGODB_URI (ver .env.example)');
  }

  for (let attempt = 1; ; attempt++) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      return mongoose;
    } catch (err) {
      if (attempt >= retries) {
        throw err;
      }
      await sleep(delayMs);
    }
  }
}

async function close() {
  await mongoose.disconnect();
}

module.exports = { mongoose, connect, close };
