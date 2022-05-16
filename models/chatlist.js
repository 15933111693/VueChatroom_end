'use strict';
const { intConvertCid, cidConvertInt } = require('../utils/convertCID')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chatList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  chatList.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CID: {
      type: DataTypes.BIGINT(13).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      get() {
        const num = this.getDataValue('CID')
        return intConvertCid(num)
      },
      set(val) {
        this.setDataValue('CID', cidConvertInt(val))
      }
    }
  }, {
    sequelize,
    modelName: 'chatList',
  });
  return chatList;
};