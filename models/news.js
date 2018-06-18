"use strict";

module.exports = function (sequelize, DataTypes) {
   var News = sequelize.define("News", {
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
      title: {type: DataTypes.STRING},
      body: {type: DataTypes.STRING}
   }, {
      classMethods: {
         associate: function (models) {
         }
      }
   });

   return News;
};
