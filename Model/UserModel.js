const Sequelize = require('sequelize');

const db = require('../util/database');

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    mobile: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    enabled: Sequelize.STRING
});

module.exports = User;