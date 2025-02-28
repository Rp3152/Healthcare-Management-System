"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            first_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            last_name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            phone_number: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            gender: {
                type: Sequelize.ENUM("Male", "Female"),
                allowNull: true,
            },
            ssn: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            dob: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            address1: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            address2: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            city: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            state: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            zip: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            marital_status: {
                type: Sequelize.ENUM("Married", "Unmarried"),
                allowNull: true,
            },
            kids: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            social: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            profileIcon: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            status: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: true,
            },
            deletedAt: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable("users");
    },
};
