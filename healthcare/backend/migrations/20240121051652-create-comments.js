"use strict";

const { ref } = require("joi");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("comments", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            commenterId: {
                type: Sequelize.INTEGER,
                references: { model: "users", key: "id" },
                allowNull: false,
            },
            waveId: {
                type: Sequelize.INTEGER,
                references: { model: "waves", key: "id" },
                allowNull: false,
            },
            commenterFirstName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            commenterLastName: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            comment: {
                type: Sequelize.STRING,
                allowNull: false,
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
        await queryInterface.dropTable("comments");
    },
};
