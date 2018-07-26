/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);
chai.should();

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {

      test('All fields filled in', done => {
        chai
          .request(server)
          .post('/api/threads/test')
          .send({
            text: 'Test POST request',
            delete_password: 'testpw'
          })
          .redirects(0)
          .end((err, res) => {
            assert.equal(res.status, 302);
            res.should.redirectTo('/b/test/', 'Should redirect to board page');
            done();
          })
      });
    });
    
    suite('GET', function() {

      test('Render all threads', done => {
        chai
          .request(server)
          .get('/api/threads/test')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            res.body.length.should.be.at.most(10, 'Limit to 10 threads displayed');
            assert.property(res.body[0], 'text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'bumped_on');
            assert.property(res.body[0], 'replies');
            assert.property(res.body[0], 'replycount');
            assert.notProperty(res.body[0], 'reported', 'Reported value should not be sent');
            assert.notProperty(res.body[0], 'delete_password', 'Delete password should not be sent');
            assert.isString(res.body[0].text);
            assert.isString(res.body[0].created_on);
            assert.isString(res.body[0].bumped_on);
            assert.isNumber(res.body[0].replycount);
            assert.isArray(res.body[0].replies);
            res.body[0].replies.length.should.be.at.most(3, 'Limit to 3 replies displayed');
            done();
          })
      })
      
    });
    
    suite('DELETE', function() {

      test('Wrong password', done => {
        chai
          .request(server)
          .delete('/api/threads/test')
          .send({
            thread_id: '5b5a04ebe668332ccafb49a5',
            delete_password: 'wrongpw'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'incorrect password', 'Should not delete due to wrong password');
            done();
          });
      });

      test('Right password', done => {
        chai
          .request(server)
          .delete('/api/threads/test')
          .send({
            thread_id: '5b5a0657ce2c182cd50e3a20', // Change id each time you run a test
            delete_password: 'test'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success', 'Should delete successfully');
            done();
          });
      });
      
    });
    
    suite('PUT', function() {

      test('Update reported field', done => {
        chai
          .request(server)
          .put('/api/threads/test')
          .send({
            thread_id: '5b5a04ebe668332ccafb49a5'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success', 'Should update successfully');
            done();
          });
      });
      
    });
    
  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
      test('All fields filled in', done => {
        chai
          .request(server)
          .post('/api/replies/test')
          .send({
            thread_id: '5b5a04ebe668332ccafb49a5',
            text: 'Test POST request on replies',
            delete_password: 'test'
          })
          .redirects(0)
          .end((err, res) => {
            assert.equal(res.status, 302);
            res.should.redirectTo('/b/test/5b5a04ebe668332ccafb49a5', 'Should redirect to thread page');
            done();
          });
      });
    });
    
    suite('GET', function() {
      
      test('Render thread with replies', done => {
        chai
          .request(server)
          .get('/api/replies/test/')
          .query({ thread_id: '5b5a04ebe668332ccafb49a5' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.notProperty(res.body, 'reported', 'Reported value should not be sent');
            assert.notProperty(res.body, 'delete_password', 'Delete password should not be sent');
            assert.isArray(res.body.replies);
            assert.property(res.body.replies[0], '_id');
            assert.property(res.body.replies[0], 'text');
            assert.property(res.body.replies[0], 'created_on');
            assert.notProperty(res.body.replies[0], 'reported', 'Reported value in replies should not be sent');
            assert.notProperty(res.body.replies[0], 'delete_password', 'Delete password in replies should not be sent');
            assert.isString(res.body.replies[0]._id);
            assert.isString(res.body.replies[0].text);
            assert.isString(res.body.replies[0].created_on);
            done();
          });
      });
    });
    
    suite('PUT', function() {
      
      test('Update reported field in replies', done => {
        chai
          .request(server)
          .put('/api/replies/test')
          .send({
            thread_id: '5b5a04ebe668332ccafb49a5',
            reply_id: 'ErOMazwzo'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success', 'Should update successfully');
            done();
          });
      });
    });
    
    suite('DELETE', function() {
      
      test('Wrong password', done => {
        chai
          .request(server)
          .delete('/api/replies/test')
          .send({
            thread_id: '5b5a04ebe668332ccafb49a5',
            reply_id: 'ZUj3Onpwr',
            delete_password: 'wrongpw'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'incorrect password', 'Should not delete due to wrong password');
            done();
          });
      });

      test('Right password', done => {
        chai
          .request(server)
          .delete('/api/replies/test')
          .send({
            thread_id: '5b5a04ebe668332ccafb49a5',
            reply_id: 'k5SfvPIUD', // Change id each time you run a test
            delete_password: 'test'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success', 'Should delete successfully');
            done();
          });
      });
    });
    
  });

});
