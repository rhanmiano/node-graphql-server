const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'node-boilerplate',
    'root',
    '',
    {
        'dialect': 'mysql',
        'host': 'localhost'
    }
);

module.exports = sequelize;