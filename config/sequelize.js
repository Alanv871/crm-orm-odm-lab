require('dotenv').config();
const { Sequelize } = require('sequelize');

const required = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  throw new Error(`Faltan variables de entorno: ${missing.join(', ')} (ver .env.example)`);
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false
  }
);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connect({ retries = 30, delayMs = 1000 } = {}) {
  for (let attempt = 1; ; attempt++) {
    try {
      await sequelize.authenticate();
      return sequelize;
    } catch (err) {
      if (attempt >= retries) {
        throw err;
      }
      await sleep(delayMs);
    }
  }
}

async function close() {
  await sequelize.close();
}

module.exports = { sequelize, connect, close };
