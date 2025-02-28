"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class users extends Model {
        static associate(models) {}
    }
    users.init(
        {
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            email: DataTypes.STRING,
            phone_number: DataTypes.STRING,
            password: DataTypes.STRING,
            gender: DataTypes.ENUM("Male", "Female"),
            ssn: DataTypes.INTEGER,
            dob: DataTypes.DATEONLY,
            address1: DataTypes.STRING,
            address2: DataTypes.STRING,
            city: DataTypes.STRING,
            state: DataTypes.STRING,
            zip: DataTypes.INTEGER,
            marital_status: DataTypes.ENUM("Married", "Unmarried"),
            kids: DataTypes.INTEGER,
            social: DataTypes.STRING,
            profileIcon: DataTypes.STRING,
            status: DataTypes.BOOLEAN,
            deletedAt: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "users",
        }
    );
    return users;
};
