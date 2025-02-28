"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("friends", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            inviterId: {
                type: Sequelize.INTEGER,
                references: { model: "users", key: "id" },
                allowNull: false,
            },
            inviteEmail: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            inviteMessage: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            inviteName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            status: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            isAccepted: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false,
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
        await queryInterface.dropTable("friends");
    },
};
