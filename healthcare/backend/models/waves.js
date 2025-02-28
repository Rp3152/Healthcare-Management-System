"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class waves extends Model {
        static associate(models) {
            // define association here
        }
    }
    waves.init(
        {
            userId: DataTypes.INTEGER,
            message: DataTypes.STRING,
            image: DataTypes.STRING,
            status: DataTypes.BOOLEAN,
            deletedAt: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "waves",
        }
    );
    return waves;
};
