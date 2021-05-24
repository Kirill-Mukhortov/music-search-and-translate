const mongoose = require('mongoose');
const {
  dbConnectionURL,
  options,
  DB_NAME,
} = require('./config');

function dbConnect() {
  mongoose.connect(dbConnectionURL, options, (err) => {
    if (err) return console.log(err);
    return console.log(`Succesfully conect to DB: ${DB_NAME}`);
  });
}

module.exports = dbConnect;
