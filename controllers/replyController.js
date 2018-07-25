const getDb = require('../db').getDb;
const ObjectId = require('mongodb').ObjectId;
const shortid = require('shortid');

exports.get_reply = (req, res, next) => {};

exports.create_reply = (req, res, next) => {
  const thread_id = req.body.thread_id;
  const text = req.body.text;
  const pw = req.body.delete_password;
  const board = req.params.board;
  const boardDb = getDb().collection(board);

  boardDb.updateOne(
    { _id: ObjectId(thread_id) },
    {
      $currentDate: {
        bumped_on: true
      },
      $push: {
        replies: {
          _id: shortid.generate(),
          text: text,
          created_on: new Date(),
          delete_password: pw,
          reported: false
        }
      }
    }
  )
  .then(result => {
    res.redirect(`/b/${board}/${thread_id}`);
  })
  .catch(error => console.log('Could not create this reply: ' + error))
};

exports.report_reply = (req, res, next) => {};

exports.delete_reply = (req, res, next) => {};
