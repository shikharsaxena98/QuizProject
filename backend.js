var fs = require('fs');
var questions = require('./question.json');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var Grant = require('grant-express');
var grant = new Grant(require('./config.json'));
var https = require('https');
var app = express();
var parseurl = require('parseurl');
var httpsPort = 3000;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json('application/json'));

var options = {
    key: fs.readFileSync('./https Certificates/key.pem', 'utf8'),
    cert: fs.readFileSync('./https Certificates/server.crt', 'utf8')
};

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
})

var questionsMod = JSON.stringify(createQuestionsForUser(questions));

fs.writeFile('./public/questions.json', questionsMod, 'utf-8', function (err) {
    console.log(err);
});

app.use(express.static('public'));

app.get('/', function (req, res) {
    //res.write("Hello"); 
    res.sendFile(__dirname + '/public/startQuizPage.html')
});

app.get('/quizPage', function (req, res) {
    res.sendFile(__dirname + '/public/frontend.html')
});

app.use('/results', function (request, response) {
    //var data=fs.readFileSync('database.json');
    //res.send(data);
    response.sendFile(__dirname + '/public/results.html');
    
});

app.post('/eval', function (request, response) {
    response.writeHead(200);
    var data=request.body;
    var fullArr=fs.readFileSync('database.json',function(err,data){
        if(err){
            console.error(err);
        }
        
    });
    
    fullArr=JSON.parse(fullArr);
    fullArr.push(data);
    fullArr=JSON.stringify(fullArr);
    fs.writeFile('database.json',fullArr,'utf-8',function(err){
        if(err){
            console.error(err);
        }
    });
    /*
    var userCreds=request.body.UserCredentials;
    console.log(typeof userCreds);
    userCreds=JSON.stringify(userCreds);
    fs.appendFile('database.json',userCreds,'utf-8',function(err){
        if(err){
            console.log(err);
        }
    });
    */
    var dataForEval = request.body.UserStats;
    var marks = evalMarks(dataForEval, questions);
    response.write(marks.toString());
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
var secureServer = https.createServer(options, app);

secureServer.listen(httpsPort, function () {
    console.log("Server Running at 3000")
});

app.get('/getDatabase',function(req,res){
    var data=fs.readFileSync('database.json','utf-8');
    console.log(data);
    res.send(data);
})