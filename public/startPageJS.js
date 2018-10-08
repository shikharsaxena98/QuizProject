var isAuthorized;

function getData() {
    if (localStorage.getItem("Users") === null) {
        var arr = new Array();
        localStorage.setItem("Users", JSON.stringify(arr));
    }
    var newUser = {};
    var obj = {
        'username': '',
        'email': ''
    };
    if (document.getElementById("UserName").value != null) {
        obj["username"] = document.getElementById("UserName").value;
    }
    if (document.getElementById("UserName").value != null) {
        obj["email"] = document.getElementById("email").value;
    }

    newUser["UserCredentials"] = obj;
    var users = [];
    users = JSON.parse(localStorage.getItem("Users"));
    users.push(newUser);

    /*
    var xhr=new XMLHttpRequest();   
    xhr.open('POST','https://localhost:3000/login',true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(JSON.stringify(users));
    */
    localStorage.setItem("Users", JSON.stringify(users));
    window.location.href = "https://localhost:3000/frontend.html";
}

function onSignIn(googleUser) {
    console.log('Signed in.');
    var profile = googleUser.getBasicProfile();
    var newUser = {};
    var obj = {};
    obj["username"] = profile.getName();
    //obj["UserMobile"]=document.getElementById("UserMobile").value;
    obj["email"] = profile.getEmail();
    newUser["UserCredentials"] = obj;

    var users = [];
    if (localStorage.getItem("Users") != null) {
        users = JSON.parse(localStorage.getItem("Users"));
    }


    users.push(JSON.stringify(newUser));
    localStorage.setItem("Users", JSON.stringify(users));
    signOut();
    window.location.href = "https://localhost:3000/quizPage";
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}
function checkLogIn() {
    var GoogleAuth = gapi.auth2.getAuthInstance();
    if (GoogleAuth.isSignedIn.Aia.value) {
        signOut();
    }
}
window.onload = function () {
    var submitButton = document.getElementById("Start");
    var confirmSubmitButtonModal = document.getElementById("confirmStartQuiz");
    confirmSubmitButtonModal.onclick = function () {
        getData();
    }
}
