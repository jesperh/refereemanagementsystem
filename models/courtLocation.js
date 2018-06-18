"use strict";

module.exports = function (sequelize, DataTypes) {
   var CourtLocation = sequelize.define("CourtLocation", {
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
   }, {
      classMethods: {
         associate: function (models) {
         }
      }
   });

   return CourtLocation;
};
