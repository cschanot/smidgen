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

// Function that chains the following: Flask API ----> Twitter API ----> Return Tweet Data
function checkTweet() {

  const inputArray = []
  var serializedData = "tweet=";

  // Grab all inputs from all fields
  var input = document.getElementsByName('tweet');
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

  console.log("searializedData",serializedData);
  // Hide the results DIV to start and set default color.
  $("#result").css("color", "black");
  $('#result').hide();

  // If the query is empty, prompt the user. Otherwise continue.
  //if (inputFormatted == null || inputFormatted == "") {
  if ($('#tweet').val() == null || $('#tweet').val() == "") {
    $('#result').show();
    $("#result").html("Required Field.").css("color", "red");
  } else {
    $.ajax({
      type: "POST",
      url: "http://192.168.1.248:6970/twapi",
      //data: inputFormatted,
      //data: $('#tweet').serialize(),
      data: serializedData,
      dataType: "html",
      cache: false,
      success: function (result) {
        // Remove outside quotes.
        result = result.replace(/(^"|"$)/g, '')
        
        $('#resultTitle').show();
        $('#result').show();
        $("#result").html(result);
      },
      error: function (textStatus, errorThrown) {
        $('#result').show();
        $("#result").html(textStatus + " " + errorThrown);
      }
    });
  }
}

// When the user hits enter, simulate form submission which calls checkTweet();
$('#tweet').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
    $(".query_button").click();
  }
});

// Prevent the page from reloading when the user submits with the enter key.
$("#tweet_in").submit(function(e) {
  e.preventDefault();
});