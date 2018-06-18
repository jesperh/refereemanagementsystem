"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || "development";
var sequelize = connectToDatabase();
var db        = {};

function connectToDatabase() {

  var url = process.env.DATABASE_URL;
  if (url) {
    return connectToPostgres(url);
  }
  else if (process.env.USER==='vagrant') {
    return connectToPostgres('postgres://vagrant:vagrant@localhost/tuho');
  }
  else {
    return connectToSqlite();
  }
}

function connectToSqlite() {
  console.log("Using SQLite database.");
  return new Sequelize('tuho', 'tuho', 'tuho', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './database-tuho'
  });
}

function connectToPostgres(url) {
  console.log("Using PostgreSQL database: " + url);
  var m = url.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+)(?::(\d+))?\/(.+)/);
  if (!m) {
    throw "Error parsing DATABASE_URL: " + url;
  }
  return new Sequelize(m[5], m[1], m[2], {
    dialect:  'postgres',
    protocol: 'postgres',
    port:     m[4] || '5432', // Default port if no excpl. given
    host:     m[3],
    logging:  false
  });
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
