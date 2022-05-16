'use strict';
const { intConvertCid } = require('../utils/convertCID')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class roomId extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  roomId.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    // 62 ** 7 约为3000w亿的可分配空间
    nextId: {
      type: DataTypes.BIGINT(13).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      get() {
        const num = this.getDataValue('nextId')
        return intConvertCid(num)
      }
    }
  }, {
    sequelize,
    modelName: 'roomId',
  });
  return roomId;
};