'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class friends extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  friends.init({
    inviterId: DataTypes.INTEGER,
    inviteEmail: DataTypes.STRING,
    inviteMessage: DataTypes.STRING,
    inviteName: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    isAccepted: DataTypes.BOOLEAN,
    deletedAt: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'friends',
  });
  return friends;
};