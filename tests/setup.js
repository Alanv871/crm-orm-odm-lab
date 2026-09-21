const { connect: connectSequelize, close: closeSequelize } = require('../config/sequelize');
const { connect: connectMongoose, close: closeMongoose } = require('../config/mongoose');
const { reset } = require('../seeders/seed');

// Cada suite: conectar -> restablecer datos conocidos -> ejecutar -> cerrar conexiones.
beforeAll(async () => {
  await connectSequelize();
  await connectMongoose();
  await reset();
});

afterAll(async () => {
  await closeSequelize();
  await closeMongoose();
});
