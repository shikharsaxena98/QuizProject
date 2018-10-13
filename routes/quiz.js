var fs=require('fs');
var path = require('path')
var questions=require('./../question.json');

exports.showQuizPage = function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../public/frontend.html'));
};

var evalMarks = function (data, questions) {
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

exports.submitAnswers = function (request, response) {
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
}

var createQuestionsForUser=function (questions) {
    var questionsModified = [];
    for (var i = 0; i < questions.length; i++) {
        questionsModified.push({
            'question': questions[i].question,
            'answers': questions[i].answers
        });
    }
    return questionsModified;
}

exports.sendQuestions=function(req,res){
    var data=createQuestionsForUser(questions);
    res.send(data);
}
