const { connect: connectSequelize, close: closeSequelize } = require('../config/sequelize');
const { connect: connectMongoose, close: closeMongoose, mongoose } = require('../config/mongoose');
const { sequelize, User, Company, Contact } = require('../models/sequelize');
const Activity = require('../models/mongoose/activity');

const users = [
  { id: 1, name: 'Ana García', email: 'ana.garcia@crm.test' },
  { id: 2, name: 'Bruno Martínez', email: 'bruno.martinez@crm.test' },
  { id: 3, name: 'Carla López', email: 'carla.lopez@crm.test' }
];

const companies = [
  { id: 1, name: 'Acme Technologies', industry: 'Technology', salesPersonId: 1 },
  { id: 2, name: 'Globex Software', industry: 'Technology', salesPersonId: 2 },
  { id: 3, name: 'Initech Finance', industry: 'Finance', salesPersonId: 1 },
  { id: 4, name: 'Umbrella Health', industry: 'Healthcare', salesPersonId: 3 }
];

const contacts = [
  { id: 1, firstName: 'Laura', lastName: 'Sánchez', email: 'laura.sanchez@acme.test', phone: '+52 55 1000 0001', companyId: 1 },
  { id: 2, firstName: 'Miguel', lastName: 'Torres', email: 'miguel.torres@acme.test', phone: '+52 55 1000 0002', companyId: 1 },
  { id: 3, firstName: 'Sofía', lastName: 'Ramírez', email: 'sofia.ramirez@acme.test', phone: '+52 55 1000 0003', companyId: 1 },
  { id: 4, firstName: 'Diego', lastName: 'Herrera', email: 'diego.herrera@globex.test', phone: '+52 55 2000 0004', companyId: 2 },
  { id: 5, firstName: 'Valeria', lastName: 'Castro', email: 'valeria.castro@globex.test', phone: '+52 55 2000 0005', companyId: 2 },
  { id: 6, firstName: 'Andrés', lastName: 'Ortega', email: 'andres.ortega@initech.test', phone: '+52 55 3000 0006', companyId: 3 },
  { id: 7, firstName: 'Camila', lastName: 'Flores', email: 'camila.flores@initech.test', phone: '+52 55 3000 0007', companyId: 3 },
  { id: 8, firstName: 'Héctor', lastName: 'Ruiz', email: 'hector.ruiz@umbrella.test', phone: '+52 55 4000 0008', companyId: 4 }
];

const activities = [
  { _id: '650000000000000000000001', type: 'CALL', description: 'Llamada de seguimiento', contactId: 1, userId: 1, metadata: { duration: 420, result: 'INTERESTED' }, createdAt: new Date('2026-01-05T10:00:00Z') },
  { _id: '650000000000000000000002', type: 'CALL', description: 'Llamada de presentación', contactId: 2, userId: 1, metadata: { duration: 180, result: 'NO_ANSWER' }, createdAt: new Date('2026-01-06T11:30:00Z') },
  { _id: '650000000000000000000003', type: 'CALL', description: 'Llamada de cierre', contactId: 4, userId: 2, metadata: { duration: 600, result: 'CLOSED' }, createdAt: new Date('2026-01-07T09:15:00Z') },
  { _id: '650000000000000000000004', type: 'CALL', description: 'Llamada de soporte', contactId: 8, userId: 3, metadata: { duration: 240, result: 'FOLLOW_UP' }, createdAt: new Date('2026-01-08T16:45:00Z') },
  { _id: '650000000000000000000005', type: 'EMAIL', description: 'Envío de propuesta', contactId: 1, userId: 1, metadata: { subject: 'Propuesta comercial', opened: true }, createdAt: new Date('2026-01-09T08:00:00Z') },
  { _id: '650000000000000000000006', type: 'EMAIL', description: 'Recordatorio de reunión', contactId: 5, userId: 2, metadata: { subject: 'Recordatorio', opened: false }, createdAt: new Date('2026-01-10T12:00:00Z') },
  { _id: '650000000000000000000007', type: 'EMAIL', description: 'Envío de contrato', contactId: 6, userId: 1, metadata: { subject: 'Contrato de servicio', opened: true }, createdAt: new Date('2026-01-11T14:20:00Z') },
  { _id: '650000000000000000000008', type: 'MEETING', description: 'Reunión de descubrimiento', contactId: 3, userId: 1, metadata: { location: 'Oficina central', attendees: ['Ana García', 'Sofía Ramírez'] }, createdAt: new Date('2026-01-12T15:00:00Z') },
  { _id: '650000000000000000000009', type: 'MEETING', description: 'Demo del producto', contactId: 7, userId: 1, metadata: { location: 'Videollamada', attendees: ['Ana García', 'Camila Flores', 'Andrés Ortega'] }, createdAt: new Date('2026-01-13T17:00:00Z') },
  { _id: '65000000000000000000000a', type: 'MEETING', description: 'Reunión de seguimiento', contactId: 8, userId: 3, metadata: { location: 'Sala 2', attendees: ['Carla López', 'Héctor Ruiz'] }, createdAt: new Date('2026-01-14T10:30:00Z') }
];

async function seed() {
  await sequelize.sync();
  await sequelize.truncate({ cascade: true, restartIdentity: true });

  await User.bulkCreate(users);
  await Company.bulkCreate(companies);
  await Contact.bulkCreate(contacts);

  // Al insertar ids explicitos la secuencia no avanza; se sincroniza para que los POST funcionen.
  for (const table of ['users', 'companies', 'contacts']) {
    await sequelize.query(
      `SELECT setval(pg_get_serial_sequence('${table}', 'id'), (SELECT MAX(id) FROM ${table}))`
    );
  }

  await Activity.deleteMany({});
  await Activity.insertMany(activities);
}

async function reset() {
  await sequelize.sync({ force: true });
  await mongoose.connection.dropDatabase();
  await seed();
}

async function main() {
  const shouldReset = process.argv.includes('--reset');

  await connectSequelize();
  await connectMongoose();

  if (shouldReset) {
    await reset();
  } else {
    await seed();
  }

  console.log(
    `${shouldReset ? 'Reset' : 'Seed'} completado: ` +
      `${users.length} users, ${companies.length} companies, ` +
      `${contacts.length} contacts, ${activities.length} activities`
  );
}

if (require.main === module) {
  main()
    .catch((err) => {
      console.error('Error en seed/reset:', err);
      process.exitCode = 1;
    })
    .finally(async () => {
      await closeSequelize();
      await closeMongoose();
    });
}

module.exports = { seed, reset, data: { users, companies, contacts, activities } };
