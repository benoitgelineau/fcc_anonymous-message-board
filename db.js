const assert = require('assert');
const mongo = require('mongodb').MongoClient;

let _db;

function initDb() {
  const dbString = process.env.DATABASE.split('@')[1].split('/')[1];

  if (_db) {
    console.warn('Trying to init DB again!');
    return _db;
  }

  mongo.connect(
    process.env.DATABASE,
    { useNewUrlParser: true },
    connected
  )

  function connected(err, client) {
    if (err) {
      console.error(err);
    } else {
      console.log('DB initialized - connected to ' + dbString);
      _db = client.db(dbString);
      return _db;
    }

  }
}

function getDb() {
  assert.ok(_db, 'Db has not been initialized, please call init first.');
  return _db;
}

module.exports = {
  getDb,
  initDb
};
