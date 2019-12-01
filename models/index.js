var Sequelize = require('sequelize');
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

module.exports = { models, sequelize };