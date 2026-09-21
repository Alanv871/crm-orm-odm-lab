const express = require('express');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const companiesRouter = require('./routes/companies');
const contactsRouter = require('./routes/contacts');
const activitiesRouter = require('./routes/activities');

const app = express();

app.use(express.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/companies', companiesRouter);
app.use('/contacts', contactsRouter);
app.use('/activities', activitiesRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const CLIENT_ERRORS = [
  'SequelizeValidationError',
  'SequelizeUniqueConstraintError',
  'SequelizeForeignKeyConstraintError',
  'ValidationError',
  'CastError'
];

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const invalidId = err.original && err.original.code === '22P02';
  let status = err.status || err.statusCode;

  if (!status) {
    status = CLIENT_ERRORS.includes(err.name) || invalidId ? 400 : 500;
  }

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ error: err.message });
});

module.exports = app;
