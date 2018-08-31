/*
function fetchData() {
    var arr = [];
    arr = localStorage.getItem("Users");
    //console.log(arr);
    arr = JSON.parse(arr);
    //console.log("Fetch Done");
    return arr;
}
*/
function completeSelectionBar(arr, selectionBar) {
    if (arr != null) {
        console.log("Selection Bar Fill Up");
        //  console.log(arr);
        var nameArr = [];
        for (var i = 0; i < arr.length; i++) {
            var person = arr[i];
            if (person.UserStats !== undefined) {
                selectionBar.innerHTML += "<option value=" + i + ">" + person.UserCredentials.username + "</option>";
            }
        }
    }

}

function getSelectedId(selectionBar) {
    //returns id of Person whose data is to be shown
    var id = selectionBar.value;
    return id;
}

function fetchData() {
    var data="";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/getDatabase',true);
    
    xhr.onload = function () {
        data = xhr.responseText;
        //console.log(data);
        //console.log(typeof data);
    }
    xhr.send(null);

    
    return JSON.parse(data);
}

function showData(arr, i, tableContainer) {
    console.log("Show Data");
    var person = arr[i];
    //console.log(person.UserStats);
    var QuesArr = person.UserStats;

    for (var i = 0; i < person.UserStats.length; i++) {
        tableContainer.innerHTML += "<tr><th>" + QuesArr[i].QuestionNo + "</th><th>" + QuesArr[i].TimeTaken + "</th><th>" + QuesArr[i].UserAnswer + "</th></tr>";
    }
}

window.onload = function () {
    var arr = [];
    var selectionBar = document.getElementById("ids");
    var tableContainer = document.getElementById("bodyOfTable");
    var submitButton = document.getElementById("submit");   
    var selectedId;

    arr = fetchData();
    console.log("arr is "+arr);
    completeSelectionBar(arr, selectionBar);

    submitButton.onclick = function () {
        tableContainer.innerHTML = "";
        selectedId = getSelectedId(selectionBar);
        showData(arr, selectedId, tableContainer);
    }

}
