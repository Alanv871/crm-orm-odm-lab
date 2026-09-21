const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'Company',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: true
      },
      salesPersonId: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      tableName: 'companies'
    }
  );
};
