// Navbanner show ul on click
$(document).ready(function () {
    $(".menu-icon").on("click", function () {
        $("nav ul").toggleClass("showing");
    });
});

// Scrolling effect for navbar
$(window).on("scroll", function () {
    if ($(window).scrollTop()) {
        $('nav').addClass('black');
    } else {
        $('nav').removeClass('black');
    }
})

var dynaplus = document.getElementById("add_tweet_query_button");
if (dynaplus) {
    // Dynamically add extra query spaces for a multi-query.
    document.getElementById("add_tweet_query_button").onclick = function () {
        var label = document.createElement("div");
        var input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("name", "tweet");
        input.setAttribute("value", "");
        input.setAttribute("id", "tweet");
        label.setAttribute("value", "Tweet:")
        label.appendChild(input);
        document.getElementById("multi_query").appendChild(label);
        return false;
    };
}

// Function that chains the following: Flask API ----> Twitter API ----> Return Tweet Data
function checkTweet() {
    var user = firebase.auth().currentUser;
    if (user) {
        console.log("User", user.uid, "signed in");
    } else {
        console.log("No user logged in.")
        $("#error_test").html("Error: Must be logged in.").css("color", "red");
        return;
    }

    const inputArray = []
    var serializedData = "tweet=";

    // Grab all inputs from all fields
    var input = document.getElementsByName('tweet');
    var resultDiv = document.getElementById('result');
    var saveButton = document.getElementById('save_results_btn');

    // Put values into an array
    for (var i = 0; i < input.length; i++) {
        inputArray.push(input[i].value)
        console.log(input[i].value);
    }

    // Join the values into a single comma separated string.
    input = inputArray.join(",");

    // Serialize data for AJAX
    serializedData += input;
    console.log(serializedData);

    console.log("searializedData", serializedData);
    // Hide the results DIV to start and set default color.
    $("#result").css("color", "black");
    resultDiv.style.visibility = "hidden";
    saveButton.style.visibility = "hidden";

    // If the query is empty, prompt the user. Otherwise continue.
    //if (inputFormatted == null || inputFormatted == "") {
    if ($('#tweet').val() == null || $('#tweet').val() == "") {
        resultDiv.style.visibility = "visible";
        $("#result").html("Required Field.").css("color", "red");
    } else {
        $.ajax({
            type: "POST",
            // UDEL url:
            url: "http://smidgen.cis.udel.edu:6970/twapi",
            //data: inputFormatted,
            //data: $('#tweet').serialize(),
            data: serializedData,
            dataType: "html",
            cache: false,
            success: function (result) {
                // Remove outside quotes.
                result = result.replace(/(^"|"$)/g, '')
                //console.log("result from ajax: ", result);

                //$('#resultTitle').show();
                resultDiv.style.visibility = "visible";
                $("#result").html(result);
                saveButton.style.visibility = "visible";
                stickyHeader();
            },
            error: function (textStatus, errorThrown) {
                resultDiv.style.visibility = "visible";
                $("#result").html(textStatus + " " + errorThrown);
            }
        });
    }
}

// Function to clear loaded data when the user wants to refresh the data.
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// Save Query Results
/*
    db.collection("projects").doc(projID).collection("tweets").doc(key).set({
        KEY: VALUE,
    })
*/
function saveQueryData() {
    var user = firebase.auth().currentUser;
    if (user) {
        console.log("User", user.uid, "signed in");
    } else {
        console.log("No user logged in.")
        $("#error_test").html("Error: Must be logged in.").css("color", "red");
        return;
    }

    // Used to grab data from URL (Project ID)
    let params = new URLSearchParams(location.search);
    projID = params.get('projectid');

    // Grab ProjID from URL, if there is no ProjID notify the user and exit the save function.
    if (projID == null) {
        $("#error_test").html("Error: No project selected.").css("color", "red");
        return;
    }
    console.log("projID: ", projID);

    // Grab all tables -- table[0] is query results, table[1] is saved data loaded from DB
    dataTable = document.getElementsByTagName('table');
    tweetTable = dataTable[0];
    console.log(dataTable.length);

    var mp = new Map()
    // Grab all table rows [Tweet ID - Tweet Text]
    var allTRs = tweetTable.getElementsByTagName('tr');
    for (var trCounter = 0; trCounter < allTRs.length; trCounter++) {

        // Grab all th (1) within the row (Tweet ID)
        var allTHsInTR = allTRs[trCounter].getElementsByTagName('th');
        // Grab all td (1) within the row (Tweet Text)
        var allTDsInTR = allTRs[trCounter].getElementsByTagName('td');

        if (allTDsInTR.length) {
            //console.log("TH[0]",allTHsInTR[0].innerHTML)
            //console.log("TD[0]",allTDsInTR[0].innerHTML)
            //Map TweetID:TweetText
            mp.set(allTHsInTR[0].innerHTML, allTDsInTR[0].innerHTML)
        }
    }

    // Useless for now, just testing.
    for (let i = 0; i < dataTable.length; i++) {
        dataTable[i].setAttribute("id", "tweet_data");
    }

    // Iterate through each key (tweet ID) and value (tweet text) pair and save to the database
    mp.forEach(function (value, key) {
        // Key value test
        console.log(key + " = " + value);

        db.collection("projects").doc(projID).collection("tweets").doc(key).set({
                text: value,
                id: key
            })
            .then(() => {
                console.log("Tweet saved.");
            })
            .catch((error) => {
                console.error("Error saving tweet: ", error);
            });
    })
}

// Load exisiting tweet data the user has saved to the database.
function loadData() {
    var user = firebase.auth().currentUser;
    if (user) {
        console.log("User", user.uid, "signed in");
    } else {
        console.log("No user logged in.")
        $("#error_test").html("Error: Must be logged in.").css("color", "red");
        return;
    }
    // Clear previous data.
    var loadData = document.getElementById('saved_data')
    removeAllChildNodes(loadData);
    loadData.style.visibility = "visible";

    // Grab ProjID from URL, if there is no ProjID notify the user and exit the load function.
    let params = new URLSearchParams(location.search);
    projID = params.get('projectid');
    if (projID == null) {
        $("#error_test").html("Error: No project selected.").css("color", "red");
        return;
    }

    // ---- Table Layout ----
    // tr:Table Row, th:Table Header, td:Table Data
    // <table>
    //   <tr>
    //     <th>TweetID</th>
    //     <td>TweetText</td>
    //   </tr>
    // </table>

    // Create table to append data to.
    var table = document.createElement("table");

    // Setting header labels.
    var tr = document.createElement("tr");
    var th = document.createElement("th");

    // Create row, attach "Tweet ID" header, append to row.
    table.appendChild(tr);
    th.textContent = "Tweet ID";
    th.setAttribute("id", "sticky");
    tr.appendChild(th);

    // Create another header, attach "Tweet ID" to header, append to row.
    var th = document.createElement("th");
    th.textContent = "Tweet Text";
    th.setAttribute("id", "sticky");
    tr.appendChild(th);

    //Append above to a the table.
    table.appendChild(tr);

    // Grab saved data based on currenlty selected project (projID), dynammically create a table for the data.
    db.collection("projects").doc(projID).collection("tweets").get().then(function (result) {
        result.forEach(doc => {
            // Create table elements.
            var tr = document.createElement("tr");
            var th = document.createElement("th");
            var td = document.createElement("td");
            // Append table row.
            table.appendChild(tr);
            // Set data and append to the appended row.
            th.textContent = doc.data().id;
            tr.appendChild(th);
            td.textContent = doc.data().text
            tr.appendChild(td);
            // Repeat until all tweets are loaded.
        })
    })
    // Append the final results to the data div.
    loadData.appendChild(table);
};

function stickyHeader(){
    //var tbody = document.getElementsByTagName("tbody");
    //console.log(typeof tbody);
    // Setting header labels.
    var tr = document.createElement("tr");
    var th = document.createElement("th");

    // Create row, attach "Tweet ID" header, append to row.
    th.textContent = "Tweet ID";
    th.setAttribute("id", "sticky");
    tr.appendChild(th);

    // Create another header, attach "Tweet ID" to header, append to row.
    var th = document.createElement("th");
    th.textContent = "Tweet Text";
    th.setAttribute("id", "sticky");
    tr.appendChild(th);

    //Append above to a the table.
    $(tr).insertBefore('table > tbody > tr:first');
    //tbody.appendChild(tr);
}

// When the user hits enter, simulate form submission which calls checkTweet();
$('#tweet').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        $(".query_button").click();
    }
});

// Prevent the page from reloading when the user submits with the enter key.
$("#tweet_in").submit(function (e) {
    e.preventDefault();
});