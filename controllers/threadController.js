const getDb = require('../db').getDb;
const ObjectId = require('mongodb').ObjectId;

exports.get_threads = (req, res, next) => {
  const board = req.params.board;
  const boardDb = getDb().collection(board);
  
  boardDb
    .find({})
    .limit(10)
    .sort({ bumped_on: -1 })
    .project({ reported: 0, delete_password: 0 })
    .toArray()
    .then(results => {

      results.forEach(thread => {
        thread.replycount = thread.replies.length;
        thread.replies = thread.replies.slice(-3).reverse();
      });

      res.send(results);
    })
    .catch(error => console.log('Could not find these threads: ' + error));
};

exports.create_thread = (req, res, next) => {
  const board = req.params.board;
  const boardDb = getDb().collection(board);
  const text = req.body.text;
  const pw = req.body.delete_password;

  boardDb.insertOne(
    {
      text: text,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      delete_password: pw,
      replies: []
    }
  )
  .then(result => {
    res.redirect(`/b/${board}/`);
  })
  .catch(error => console.log('Could not create this thread: ' + error));

};

exports.report_thread = (req, res, next) => {
  const board = req.params.board;
  const boardDb = getDb().collection(board);
  const thread_id = req.body.report_id;

  boardDb.updateOne(
    { _id: ObjectId(thread_id) },
    {
      $set: { reported: true }
    }
  )
  .then(result => {
    res.send('success');
  })
  .catch(error => console.log('Could not update this thread: ' + error))
};

exports.delete_thread = (req, res, next) => {
  const board = req.params.board;
  const boardDb = getDb().collection(board);
  const thread_id = req.body.thread_id;
  const pw = req.body.delete_password;

  boardDb
    .findOneAndDelete({
      _id: ObjectId(thread_id),
      delete_password: { $eq: pw }
    })
    .then(result => {

      const message = result.value ? 'success' : 'incorrect password';
      res.send(message);
    })
    .catch(error => console.log('Could not delete this thread: ' + error));
};