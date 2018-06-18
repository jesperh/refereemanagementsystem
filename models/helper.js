"use strict";

module.exports = function(sequelize, DataTypes) {
   var Helper = sequelize.define("Helper", {
      id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true, allowNull:false},
   }, {
      classMethods: {
         associate: function(models) {
            Helper.belongsTo(models.Worker);
         }
      }
   });

   return Helper;
};
