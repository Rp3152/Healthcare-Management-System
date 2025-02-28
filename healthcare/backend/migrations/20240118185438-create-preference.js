"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("preferences", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
                references: { model: "users", key: "id" },
                allowNull: false,
            },
            language: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            breakfast: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            lunch: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            dinner: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            wakeTime: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            bedTime: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            weight: {
                type: Sequelize.ENUM("Kg", "lbs"),
                allowNull: true,
            },
            height: {
                type: Sequelize.ENUM("cm", "ft/inches"),
                allowNull: true,
            },
            bloodGlucose: {
                type: Sequelize.ENUM("mmo/l", "mg/dl"),
                allowNull: true,
            },
            cholesterol: {
                type: Sequelize.ENUM("mmo/l", "mg/dl"),
                allowNull: true,
            },
            bloodPressure: {
                type: Sequelize.ENUM("kPa", "mmHg"),
                allowNull: true,
            },
            distance: {
                type: Sequelize.ENUM("km", "miles"),
                allowNull: true,
            },
            systemEmails: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            memberServiceEmails: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            sms: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            phoneCall: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            post: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("preferences");
    },
};
