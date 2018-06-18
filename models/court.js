"use strict";

module.exports = function(sequelize, DataTypes) {
   var Court = sequelize.define("Court", {
      number: { type : DataTypes.INTEGER, unique: true },
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
      angle: DataTypes.INTEGER

   }, {
      classMethods: {
         associate: function(models) {
            Court.belongsTo(models.Tournament);
            Court.hasMany(models.Game, {as: 'Games'});
            Court.hasMany(models.Referee);
         }
      }
   });

   return Court;
};
