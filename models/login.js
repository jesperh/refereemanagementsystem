"use strict";
var bcrypt = require("bcrypt-nodejs");
module.exports = function (sequelize, DataTypes) {
   var Login = sequelize.define("Login", {
      password: {type: DataTypes.STRING, allowNull: false},
   }, {
      classMethods: {
         associate: function (models) {

            Login.belongsTo(models.User);
         }
      },
      instanceMethods: {

         generateHash: function (password, done) {
            var salt = bcrypt.genSaltSync(10);
            bcrypt.hashSync(password, salt, null, done);
         },
         validPassword: function (password, next) {
            bcrypt.compare(password, this.password, next)
         }
      }
   });

   Login.beforeUpdate(function (model, done) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(model.password, salt);
      model.password = hash;

   });
   return Login;
};
