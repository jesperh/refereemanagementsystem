"use strict";

module.exports = function (sequelize, DataTypes) {
   var User = sequelize.define("User", {
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
      username: {type: DataTypes.STRING, unique: true, allowNull: false},
      firstname: {type: DataTypes.STRING, allowNull: false},
      lastname: {type: DataTypes.STRING, allowNull: false},
      email: {type: DataTypes.STRING, allowNull: false},
      phonenumber: {type: DataTypes.STRING, allowNull: true},
      experience: DataTypes.INTEGER,
      interestedReferee: DataTypes.BOOLEAN,
      interestedSecurity: DataTypes.BOOLEAN,
      interestedMisc: DataTypes.BOOLEAN,
      interestedThisYear: DataTypes.BOOLEAN,
      greetings: DataTypes.STRING,
      role: DataTypes.ENUM('user', 'admin')
   }, {
      classMethods: {
         associate: function (models) {

            User.belongsToMany(models.Tournament, {
               as: 'WorkerTournaments',
               through: models.Worker,
               onDelete: "SET NULL"
            });
            User.hasOne(models.Login);
         }
      }
   });

   User.beforeCreate(function (model, done) {
      model.role = "user";

   });

   return User;
};
