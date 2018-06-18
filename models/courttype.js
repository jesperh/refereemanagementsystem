"use strict";

module.exports = function (sequelize, DataTypes) {
   var CourtType = sequelize.define("CourtType", {
      number: {type: DataTypes.INTEGER, unique: true}

   }, {
      classMethods: {
         associate: function (models) {
         }
      }
   });

   return CourtType;
};
