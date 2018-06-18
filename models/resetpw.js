"use strict";

module.exports = function (sequelize, DataTypes) {
   var ResetPw = sequelize.define("ResetPw", {
      token: {type: DataTypes.STRING, allowNull: false},
      expires: {type: DataTypes.STRING, allowNull: false},
   }, {
      classMethods: {
         associate: function (models) {

            ResetPw.belongsTo(models.User);
         }
      },
   });

   return ResetPw;
};
