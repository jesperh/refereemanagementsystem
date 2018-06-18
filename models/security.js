"use strict";

module.exports = function (sequelize, DataTypes) {
   var Security = sequelize.define("Security", {}, {
      classMethods: {
         associate: function (models) {
            Security.belongsTo(models.Worker);
         }
      }
   });

   return Security;
};
