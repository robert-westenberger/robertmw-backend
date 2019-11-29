var bcrypt = require('bcrypt');
var roles = require("../utils/roles");


const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      isEmail: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        return () => this.getDataValue('password');
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    hooks: {
      beforeCreate(model, options) {
        return bcrypt.hash(model.password(), 14).then(function(hash) {
          model.password = hash;
        });
      }
    }
  });

  User.prototype.verifyPassword = function(password) {
    return bcrypt.compare(password, this.password());
  };
  return User;
};

module.exports = user;