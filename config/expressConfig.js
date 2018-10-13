var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./../db');

module.exports = function () {
    var app = express();
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json('application/json'));

    //app.use(logger('dev'));

    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
    }));

    /*app.use(function (req, res, next) {
        if (!req.session.views) {
            req.session.views = {};
        }

        // get the url pathname
        var pathname = parseurl(req).pathname;

        // count the views
        req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;

        next();
    });*/

    app.use(express.static('public'));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new Strategy(function (username, password, cb) {
        db.admins.findByUsername(username, function (err, user) {
            if (err) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false);
            }
            if (user.password != password) {
                return cb(null, false);
            }
            return cb(null, user);
        });
    }));

    passport.serializeUser(function (user, cb) {
        cb(null, user.id);
    });

    passport.deserializeUser(function (id, cb) {
        db.admins.findById(id, function (err, user) {
            if (err) {
                return cb(err);
            }
            cb(null, user);
        });
    });

    return app;
}
