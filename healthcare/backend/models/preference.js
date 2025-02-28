"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class preference extends Model {
        static associate(models) {
            // define association here
        }
    }
    preference.init(
        {
            userId: DataTypes.INTEGER,
            language: DataTypes.STRING,
            breakfast: DataTypes.STRING,
            lunch: DataTypes.STRING,
            dinner: DataTypes.STRING,
            wakeTime: DataTypes.STRING,
            bedTime: DataTypes.STRING,
            weight: DataTypes.ENUM("Kg", "lbs"),
            height: DataTypes.ENUM("cm", "ft/inches"),
            bloodGlucose: DataTypes.ENUM("mmo/l", "mg/dl"),
            cholesterol: DataTypes.ENUM("mmo/l", "mg/dl"),
            bloodPressure: DataTypes.ENUM("kPa", "mmHg"),
            distance: DataTypes.ENUM("km", "miles"),
            systemEmails: DataTypes.BOOLEAN,
            memberServiceEmails: DataTypes.BOOLEAN,
            sms: DataTypes.BOOLEAN,
            phoneCall: DataTypes.BOOLEAN,
            post: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "preference",
        }
    );
    return preference;
};
