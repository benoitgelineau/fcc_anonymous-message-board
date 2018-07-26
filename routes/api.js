/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const express = require('express');
const router = express.Router();

const thread_controller = require('../controllers/threadController');
const reply_controller = require('../controllers/replyController');

// Threads routes
router.get('/threads/:board', thread_controller.get_threads);

router.post('/threads/:board', thread_controller.create_thread);

router.put('/threads/:board', thread_controller.report_thread);

router.delete('/threads/:board', thread_controller.delete_thread);

// Replies routes
router.get('/replies/:board', reply_controller.get_thread);

router.post('/replies/:board', reply_controller.create_reply);

router.put('/replies/:board', reply_controller.report_reply);

router.delete('/replies/:board', reply_controller.delete_reply);

module.exports = router;