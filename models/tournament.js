"use strict";

module.exports = function (sequelize, DataTypes) {
   var Tournament = sequelize.define("Tournament", {
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
      year: DataTypes.STRING,
      title: DataTypes.STRING

   }, {
      classMethods: {
         associate: function (models) {

            Tournament.belongsToMany(models.User, {
               as: 'TournamentWorkers',
               through: models.Worker,
               onDelette: "SET NULL"
            });
         }
      }
   });

   return Tournament;
};
