"use strict";

module.exports = function (sequelize, DataTypes) {
   var Referee = sequelize.define("Referee", {
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
      comments: {type: DataTypes.STRING, allowNull: true},
      status: DataTypes.ENUM('Kentällä', 'Rikki', 'Kuollut', 'Valmis', 'Reservissä'),
      powerbank: DataTypes.ENUM('Luovutettu', 'Hukattu', 'Palautettu', 'Ostettu', 'Hajonnut'),
      pawn: DataTypes.ENUM('Maksettu', 'Palautettu', 'EiPalauteta')
   }, {
      classMethods: {
         associate: function (models) {
            Referee.belongsTo(models.Worker, {
               foreignKeyConstraint: true,
               onDelete: 'cascade'
            });
            Referee.belongsTo(models.Court), {
               foreignKeyConstraint: false
            };
         }
      }
   });

   return Referee;
};
