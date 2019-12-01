var Sequelize = require('sequelize');
var fs = require('fs');

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
    host: 'localhost',
    port: 3002,
    omitNull: true
  },
);
const models = {
  User: sequelize.import('./user')
};


Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});


fs.readFile('node_modules/connect-pg-simple/table.sql', 'utf8', (err, data) => {
  sequelize.query(data);
});

module.exports = { models, sequelize };