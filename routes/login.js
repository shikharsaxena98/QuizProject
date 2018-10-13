var path=require('path');
var fs=require('fs');
exports.userLoginForm=function (req, res) {
    //res.send("Hello");
    res.sendFile(path.resolve(__dirname+'/../public/startQuizPage.html'));
};

exports.adminLoginForm= function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../public/login.html'));
};

exports.adminLoginSubmit=function (req, res) {
    console.log("Autheticates");
    res.redirect('/results');
};

exports.showResults=function (request, response) {
    console.log("Autheticated");
    response.sendFile(path.resolve(__dirname + '/../public/results.html'));
};

exports.getDatabaseFromServer=function (req, res) {
    var data = fs.readFileSync('db/database.json', 'utf-8');
    res.send(data);
};