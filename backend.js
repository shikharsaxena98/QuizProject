process.env.NODE_ENV="development";
var fs = require('fs');
var express=require('./config/expressConfig.js');
var https = require('https');
//var parseurl = require('parseurl');
var httpsPort = 3000;
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');
var app = express();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var config = require('./config/config.js');
var login=require('./routes/login.js');
var quiz=require('./routes/quiz.js');

/*
fs.writeFile('./public/questions.json', questionsMod, 'utf-8', function (err) {
    if(err){
    console.error(err);
    }
});
*/

app.get('/questions',quiz.sendQuestions);

app.get('/', login.userLoginForm);

app.get('/quizPage', quiz.showQuizPage);

app.get('/admin', login.adminLoginForm);

/*
app.get('/exm', function (req, res) {
    //res.writeHead(302);
    res.set({
        'Content-Type': 'text/plain'
    });

    res.set({
        'Document-Type': 'text/plain'
    });
    res.status(302).send('Hello')
})
*/

app.post('/admin', passport.authenticate('local', {failureRedirect: '/admin'}),
         login.adminLoginSubmit);

app.get('/results', ensureLoggedIn('/admin'),login.showResults);

app.post('/eval', quiz.submitAnswers);

var secureServer = https.createServer(config, app);

secureServer.listen(httpsPort, function () {
    console.log("Server Running at 3000");
});

app.get('/getDatabase',ensureLoggedIn('/admin'), login.getDatabaseFromServer);
