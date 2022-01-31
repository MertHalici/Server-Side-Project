var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var User = require('./models/users.js');

var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');



function auth (req, res, next) {
  //console.log(req.session);
  console.log('Start of authentication');
 if (req.session.user ==='authenticated'){
    console.log('I am authenticated');
    next()
  }
  else 
  if ((!req.session.user) || ('loggedOut' === req.session.user)) {
        console.log('I am starting checking'+req.headers.authorization);
        //console.log('Into login' +req.session.user);
        var authHeader = req.headers.authorization;
        if ((!authHeader)|| ('loggedOut' === req.session.user)) {
          var err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          return next(err);
        }

        var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        var username = auth[0];
        var password = auth[1];
        delete req.headers.authorization;
        console.log ('user name '+username);
        console.log ('password name '+password);
        User.findOne({username: username})
        .then((user) => {
          console.log ('search done'+user);
          if (user === null) {
            var err = new Error('User ' + username + ' does not exist!');
            err.status = 403;
            return next(err);
          }
          else if (user.password !== password) {
            var err = new Error('Your password is incorrect!');
            err.status = 403;
            return next(err);
          }
          else if (user.username === username && user.password === password) {
            req.session.user = 'authenticated';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You are authenticated!');
          }
        })
        .catch((err) => next(err));
      
    }
    console.log ('not found in database');
}



module.exports = auth;
