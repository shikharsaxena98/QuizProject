process.env.NODE_ENV="development";
var fs = require('fs');
var questions = require('./question.json');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var Grant = require('grant-express');
var grant = new Grant(require('./config.json'));
var https = require('https');
var parseurl = require('parseurl');
var httpsPort = 3000;
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');
var app = express();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var config = require('./config/config.js');


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json('application/json'));

app.use(logger('dev'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(grant)

app.use(function (req, res, next) {
    if (!req.session.views) {
        req.session.views = {};
    }

    // get the url pathname
    var pathname = parseurl(req).pathname;

    // count the views
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;

    next();
});

var questionsMod = JSON.stringify(createQuestionsForUser(questions));

fs.writeFile('./public/questions.json', questionsMod, 'utf-8', function (err) {
    if(err){
    console.error(err);
    }
});

app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Strategy(
    function (username, password, cb) {
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

app.get('/questions',function(req,res){
    var data=createQuestionsForUser(questions);
    res.send(data);
});

app.get('/', function (req, res) {
    //res.write("Hello"); 
    res.sendFile(__dirname + '/public/startQuizPage.html');
});

app.get('/quizPage', function (req, res) {
    res.sendFile(__dirname + '/public/frontend.html')
});

app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/public/login.html')
});

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

app.post('/login', passport.authenticate('local', { /*successReturnToOrRedirect:'/results',*/
    failureRedirect: '/login'
}), function (req, res) {
    res.redirect('/results');
});

app.get('/results', require('connect-ensure-login').ensureLoggedIn(), function (request, response) {
    //var data=fs.readFileSync('database.json');
    //res.send(data);
    response.sendFile(__dirname + '/public/results.html');

});

app.post('/eval', function (request, response) {
    //response.writeHead(200);
    var data = request.body;
    var fullArr = fs.readFileSync('db/database.json', function (err, data) {
        if (err) {
            console.log("Database Error");
        }
    });
    fullArr = JSON.parse(fullArr);
    fullArr.push(data);
    fullArr = JSON.stringify(fullArr);
    fs.writeFile('db/database.json', fullArr, 'utf-8', function (err) {
        if (err) {
            console.error(err);
        }
    });
    var marks = 0;
    if (request.body.UserStats != null) {
        var dataForEval = request.body.UserStats;
        marks = evalMarks(dataForEval, questions);
        console.log(marks);
    }

    response.send({
        'redirectUrl': '/'
    });
});

function createQuestionsForUser(questions) {
    var questionsModified = [];
    for (var i = 0; i < questions.length; i++) {
        questionsModified.push({
            'question': questions[i].question,
            'answers': questions[i].answers
        });
    }
    return questionsModified;
}

function evalMarks(data, questions) {
    var ques;
    var totalMarks = 0;
    var MarksPerQuestion = 1;
    for (var i = 0; i < data.length; i++) {
        ques = data[i].QuestionNo;
        if (questions[ques].correctAnswer === data[i].UserAnswer) {
            totalMarks += MarksPerQuestion;
        }
    }
    return totalMarks;
}
console.log(config.options);
var secureServer = https.createServer(config, app);

secureServer.listen(httpsPort, function () {
    console.log("Server Running at 3000");
});

app.get('/getDatabase',require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
    var data = fs.readFileSync('db/database.json', 'utf-8');
    res.send(data);
});
