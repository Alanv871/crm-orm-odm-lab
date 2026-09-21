const { sequelize } = require('../../config/sequelize');

const User = require('./user')(sequelize);
const Company = require('./company')(sequelize);
const Contact = require('./contact')(sequelize);

// User 1 --- N Company (salesPerson)
User.hasMany(Company, { foreignKey: 'salesPersonId', as: 'companies', onDelete: 'SET NULL' });
Company.belongsTo(User, { foreignKey: 'salesPersonId', as: 'salesPerson' });

// Company 1 --- N Contact
Company.hasMany(Contact, { foreignKey: 'companyId', as: 'contacts', onDelete: 'CASCADE' });
Contact.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

module.exports = { sequelize, User, Company, Contact };
