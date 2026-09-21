const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'Contact',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isEmail: true }
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'contacts'
    }
  );
};
