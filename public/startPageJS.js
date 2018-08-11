
function getData(){
    if(localStorage.getItem("Users")===null){
        var arr=new Array();
        localStorage.setItem("Users",JSON.stringify(arr));
    }
    var newUser={};
    var obj={};
    obj["username"]=document.getElementById("UserName").value;
    obj["UserMobile"]=document.getElementById("UserMobile").value;
    obj["email"]=document.getElementById("email").value;
    newUser["UserCredentials"]=obj;
    var users=[];
    users=JSON.parse(localStorage.getItem("Users"));
    users.push(JSON.stringify(newUser));
    localStorage.setItem("Users",JSON.stringify(users));
}

