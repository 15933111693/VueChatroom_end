'use strict';
const { intConvertCid, cidConvertInt } = require('../utils/convertCID')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class roomWithUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  roomWithUser.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    CID: {
      type: DataTypes.BIGINT(13).UNSIGNED,
      allowNull: false,
      get() {
        const num = this.getDataValue('CID')
        return intConvertCid(num)
      }
    }
  }, {
    sequelize,
    modelName: 'roomWithUser',
  });
  return roomWithUser;
};