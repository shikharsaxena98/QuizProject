var fs = require('fs');
var questions=require('./question.json');
var express=require('express');
var bodyParser = require('body-parser');


var app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json('application/json'));


var questionsMod=JSON.stringify(createQuestionsForUser(questions));
fs.writeFile('./public/questions.json',questionsMod,'utf-8',function(err){
    console.log(err);
});

app.use('/files',express.static(__dirname+'/public'));



app.use('/hellothere', function(request,response){
    response.send('Hello there,from Express');
});

var dataforEval;
app.post('/', function(request,response){
    var dataForEval=request.body.UserStats;
    var marks=evalMarks(dataForEval,questions);
    console.log(marks);
    response.write(marks.toString())
    
});

app.listen('3000',function(){console.log("At 3000 port")});

function createQuestionsForUser(questions){
    var questionsModified=[];
    for(var i=0;i<questions.length;i++){
        questionsModified.push({'question':questions[i].question,'answers':questions[i].answers});
    }
    return questionsModified;
}

function evalMarks(data,questions){
    var ques;
    var totalMarks=0;
    var MarksPerQuestion=1;
    for(var i=0;i<data.length;i++){
        ques=data[i].QuestionNo;
        if(questions[ques].correctAnswer===data[i].UserAnswer){
            totalMarks+=MarksPerQuestion;
        }
    }
    return totalMarks;
}



