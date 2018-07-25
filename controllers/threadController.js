const getDb = require('../db').getDb;
// const ObjectId = require('mongodb').ObjectId;

exports.get_thread = (req, res, next) => {
  const board = req.params.board;
  const boardDb = getDb().collection(board);
  
  boardDb
    .find({})
    .limit(10)
    .sort({ bumped_on: -1 })
    .toArray()
    .then(results => {
      results.forEach(thread => {
        // Take the last 3 items of the replies array (check with GET replies to change it or not)
        thread.replies = thread.replies.slice(-3).reverse();
      });

      res.send(results);
    })
    .catch(error => console.log('Could not get this thread: ' + error));
};

exports.create_thread = (req, res, next) => {
  const board = req.params.board;
  const text = req.body.text;
  const pw = req.body.delete_password;
  const boardDb = getDb().collection(board);

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
    res.redirect(`/b/${board}`);
  })
  .catch(error => console.log('Could not create this thread: ' + error));

};

exports.report_thread = (req, res, next) => {};

exports.delete_thread = (req, res, next) => {};