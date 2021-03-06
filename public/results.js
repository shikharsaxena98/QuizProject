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
        //console.log("Selection Bar Fill Up");
        //console.log(arr.length);
        //var nameArr = [];// not used
        //console.log('starting for loop');
        for (var i = 0; i < arr.length; i++) {
            var person = arr[i];
            if (person.UserStats !== undefined) {
                //console.log('filling selectionbar');
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

var data = ""; // global variable to contain fetchedata, to be used in showData
function fetchData(selectionBar) {
    //Get the data from Backend
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/getDatabase', true);
    xhr.send(null);

    xhr.onload = function () {
        data = xhr.responseText;
        completeSelectionBar(JSON.parse(data), selectionBar);
    }
    
}


function showData(arr, i, tableContainer) {
    console.log("Show Data");
    var person = arr[i];
    console.log(person.UserStats);
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

    fetchData(selectionBar);
    //console.log("arr is "+arr);
    //completeSelectionBar(, selectionBar);

    submitButton.onclick = function () {
        tableContainer.innerHTML = "";
        selectedId = getSelectedId(selectionBar);
        showData(JSON.parse(data), selectedId, tableContainer);
    }

}
