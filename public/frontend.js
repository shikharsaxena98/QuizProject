function startExamTimer(hours, mins, secs) {
    //This will Trigger on Page Loading, it will Start a Timer at the beginning of the Quiz.
    var countDownDate = new Date()
    countDownDate.setHours(countDownDate.getHours() + hours);
    countDownDate.setMinutes(countDownDate.getMinutes() + mins);
    countDownDate.setSeconds(countDownDate.getSeconds() + secs);

    // Update the count down every 500 milisecond
    var x = setInterval(function () {

        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now an the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        //var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        document.getElementById("demo").innerHTML = hours + "h " +
            minutes + "m " + seconds + "s ";

        // If the count down is over, write some text 
        if (distance < 0) {
            document.getElementById('quiz').style.display = "none";
            clearInterval(x);
            document.getElementById("demo").innerHTML = "EXPIRED";
            document.getElementById('submit').disabled = false;
            document.getElementById('move').style.display = "none";
            document.getElementById('submit').style.backgroundColor = "green";
        }
    }, 500);
}

function displayQuestion(quizContainer, questions, alreadyAsked, questionNo) {
    //This Function will trigger once on Page Loading, displatying the First Question, and then when Submit this Answer is clicked.
    if (alreadyAsked.length >= questions.length) {
        return
    }


    alreadyAsked.push(questionNo);

    quizContainer.innerHTML ='<strong>' + questions[questionNo].question + '</strong><br/>';

    for (option in questions[questionNo].answers) {
        quizContainer.innerHTML += '<label>' +
            '<input type="radio" name="question" value="' + option + '">' +
            option + ': ' +
            questions[questionNo].answers[option] +
            '</label>'+"<br/>";
    }


    //console.log(document.querySelector('input[name=question]:checked').value);
    //console.log(document.querySelector('input[name="question"]:checked').value);
    // if answer is correct


}

function generateRandomNo(alreadyAsked, questions) {
    //Creates a Random Question No. and checks that the Question hasnt beeen asked before
    if (alreadyAsked.length < questions.length) {

        console.log("already Asked is " + alreadyAsked);
        var questionNo = Math.floor(Math.random() * questions.length);
        console.log("Question no is " + questionNo);
        var flag = isQuestionAsked(questionNo, alreadyAsked);
        while (flag) {
            questionNo = Math.floor(Math.random() * questions.length);
            flag = isQuestionAsked(questionNo, alreadyAsked);
        }
        return questionNo;

        function isQuestionAsked(questionNo, alreadyAsked) {
            for (var i = 0; i < alreadyAsked.length; i++) {
                if (questionNo == alreadyAsked[i]) {
                    return true;
                }
            }
            return false;
        }


    }
}

function getAnswer(quizContainer, questions) {
    //Returns the selected Option by the user.
    var answerContainers = quizContainer.querySelectorAll('.answers');
    console.log(answerContainers.length);
    var userAnswer = '';
    //var numCorrect = 0;
    var answers = document.getElementsByName('question');
    for (var answer in answers) {
        console.log(answers[answer].value + "::" + answers[answer].checked);
        if (answers[answer].checked) {
            userAnswer = answers[answer].value;
            console.log(userAnswer);
            break;
        }
    }
    return userAnswer;
}

function move(QuesLen, askedLen, submitButton) {

    //console.log("Move Initiated");
    var elem = document.getElementById("bar");
    width = askedLen / QuesLen * 100;
    elem.style.width = width + "%";
    //console.log(width);
    if (width >= 100) {
        submitButton.disabled = false;
        $('#demo').hide();
        
        submitButton.style.backgroundColor = "green";
        document.getElementById('move').style.display = "none";
        document.getElementById('quiz').innerHTML = "<h1 align='center'>Quiz Completed. SUBMIT THE QUIZ NOW.</h1>";
    }

}

function captureTime(QuizStartTime, hours, mins, secs) {
    //console.log(7200 - (QuizStartTime.getTime() - Date.now()) / 1000);
    var totalSecs = hours * 3600 + mins * 60 + secs;
    return ((Date.now() - QuizStartTime.getTime()) / 1000);
    //time_difference(QuizStartTime.getFullYear(),QuizStartTime.getMonth(),QuizStartTime.getDate(),QuizStartTime.getHours(),QuizStartTime.getMinutes(),QuizStartTime.getSeconds());   
}

function saveToLocalStorage(alreadyAsked, timeArray, ansArray) {
    //Creating the Final Object
    var finalObj = {};
    var finalArr = [];
    for (var i = 0; i < alreadyAsked.length; i++) {
        finalArr.push({
            "QuestionNo": alreadyAsked[i],
            "TimeTaken": timeArray[i],
            "UserAnswer": ansArray[i]
        });
    }
    console.log(finalArr);
    //console.log(UserStatsArr);

    //Saving to Local Storage

    var dataArr = localStorage.getItem("Users");
    //console.log(dataArr);
    dataArr = JSON.parse(dataArr);
    var reqdElm = dataArr[dataArr.length - 1];
    console.log(typeof reqdElm);
    //reqdElm = JSON.parse(reqdElm);
    //console.log(reqdElm);
    reqdElm["UserStats"] = finalArr;
    //console.log(reqdElm);
    dataArr[dataArr.length - 1] = reqdElm;
    var dataStr = JSON.stringify(dataArr);
    localStorage.setItem("Users", dataStr);
}

function sendDataForEvaluation() {
    var data = JSON.parse(localStorage.getItem('Users'));
    var currData = data[data.length - 1];

    currData = JSON.stringify(currData);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://localhost:3000/eval");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(currData);
    xhr.onload = function () {

        window.location = JSON.parse(xhr.response).redirectUrl;
    }

}

function getQuestions(questions) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/questions", false);
    xhr.onload = function () {
        questions = xhr.responseText;
    }
}

window.onload = function () {
    var QuizStartTime = new Date();
    var alreadyAsked = new Array();
    var xhr = new XMLHttpRequest();
    $('#successAlert').hide();

    xhr.onload = function () {
        var myQuestions = xhr.responseText;
        myQuestions = JSON.parse(myQuestions);
        var questionNo = generateRandomNo(alreadyAsked, myQuestions);
        var quizContainer = document.getElementById('quiz');
        var resultsContainer = document.getElementById('results');
        var submitButton = document.getElementById('submit');
        var ansObj = {};
        var timeArray = [];
        var ansArray = [];
        var UserStats = {};
        submitButton.disabled = true;

        submitButton.onclick = function () {
            for (var i = timeArray.length - 1; i >= 1; i--) {
                timeArray[i] = timeArray[i] - timeArray[i - 1];
            }
            
            saveToLocalStorage(alreadyAsked, timeArray, ansArray);
            $('#successAlert').show();
            window.setTimeout(function () {
                
                $(".alert").fadeTo(500, 0).slideUp(500, function () {
                    $(this).remove();
                });
                sendDataForEvaluation();
            }, 4000);
        }


        startExamTimer(1, 0, 0);

        displayQuestion(quizContainer, myQuestions, alreadyAsked, questionNo);

        document.getElementById('move').onclick = function () {
            ansArray.push(getAnswer(quizContainer, myQuestions));
            timeArray.push(captureTime(QuizStartTime, 1, 0, 0));
            //console.log(timeArray);


            move(myQuestions.length, alreadyAsked.length, submitButton);
            //Picking Next Question no.
            questionNo = generateRandomNo(alreadyAsked, myQuestions);
            //Displaying the Next Question
            displayQuestion(quizContainer, myQuestions, alreadyAsked, questionNo);

        }
    };
    xhr.open("GET", 'https://localhost:3000/questions');
    xhr.send();

} //Window.onload END
