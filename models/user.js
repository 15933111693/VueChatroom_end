'use strict';
const {
  Model
} = require('sequelize');

const { aesEncrypt, aesDecrypt } = require('../utils/crypto')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userAccount: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userPwd: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const val = this.getDataValue('userPwd')
        return val ? aesDecrypt(val) : null
      },
      set(val) {
        this.setDataValue('userPwd', aesEncrypt(val))
      }
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://cdn.vuetifyjs.com/images/john.png'
    },
    isRemove: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  return User;
};