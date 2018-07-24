const mongoUtil = require('../db');
const db = mongoUtil.getDB();

exports.get_thread = (req, res, next) => {

};

exports.create_thread = (req, res, next) => {
  // const board = req.body.board;
  const text = req.body.text;
  const pw = req.body.delete_password;

  db.insertOne({ text: text });


};

exports.report_thread = (req, res, next) => {};

exports.delete_thread = (req, res, next) => {};