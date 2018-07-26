const getDb = require('../db').getDb;
const ObjectId = require('mongodb').ObjectId;
const shortid = require('shortid');

exports.get_thread = (req, res, next) => {
  const board = req.params.board;
  const boardDb = getDb().collection(board);
  const thread_id = req.query.thread_id;

  boardDb
    .findOne(
      { _id: ObjectId(thread_id) },
      {
        projection: {
          reported: 0,
          delete_password: 0,
          'replies.delete_password': 0,
          'replies.reported': 0,
        }
      }
    )
    .then(result => {

      result.replies.reverse();

      res.send(result);
    })
    .catch(error => console.log('Could not find this thread: ' + error));
};

exports.create_reply = (req, res, next) => {
  const board = req.params.board;
  const boardDb = getDb().collection(board);
  const thread_id = req.body.thread_id;
  const text = req.body.text;
  const pw = req.body.delete_password;

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

exports.report_reply = (req, res, next) => {
  const board = req.params.board;
  const boardDb = getDb().collection(board);
  const thread_id = req.body.thread_id;
  const reply_id = req.body.reply_id;

  boardDb.updateOne(
    {
      _id: ObjectId(thread_id),
      replies: {
        $elemMatch: { _id: reply_id }
      }
    },
    {
      $set: { 'replies.$.reported': true }
    }
  )
  .then(result => {
    res.send('success');
  })
  .catch(error => console.log('Could not update this reply: ' + error))
};

exports.delete_reply = (req, res, next) => {
  const board = req.params.board;
  const boardDb = getDb().collection(board);
  const thread_id = req.body.thread_id;
  const reply_id = req.body.reply_id;
  const pw = req.body.delete_password;

  boardDb.findOneAndUpdate(
    {
      _id: ObjectId(thread_id),
      replies: {
        $elemMatch: {
          _id: reply_id,
          delete_password: pw
        }
      }
    },
    { $set: { 'replies.$.text': '[deleted]' } }
  )
  .then(result => {

    const message = result.value ? 'success' : 'incorrect password';
    res.send(message);
  })
  .catch(error => console.log('Could not delete this reply: ' + error));
};
