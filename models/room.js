'use strict';
const { intConvertCid } = require('../utils/convertCID')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Room.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CID: {
      type: DataTypes.BIGINT(13).UNSIGNED,
      allowNull: false,
      get() {
        const num = this.getDataValue('CID')
        return intConvertCid(num)
      }
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'http://localhost:3000/images/default.jpg'
    }
  }, {
    sequelize,
    modelName: 'room',
  });
  return Room;
};