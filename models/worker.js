"use strict";

module.exports = function (sequelize, DataTypes) {
   var Worker = sequelize.define("Worker", {
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
   }, {
      classMethods: {
         associate: function (models) {
            Worker.hasOne(models.Referee, {
               foreignKeyConstraint: true,
               onDelete: 'cascade',
               hooks: true
            });
            Worker.belongsTo(models.User)

         }
      }
   });

   return Worker;
};
