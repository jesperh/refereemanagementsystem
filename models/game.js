"use strict";

module.exports = function(sequelize, DataTypes) {
   var Game = sequelize.define("Game", {
      gameId: { type : DataTypes.STRING, unique: true },

   }, {
      classMethods: {
         associate: function(models) {
         }
      }
   });

   return Game;
};
