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

function Yeet_Word(tweet_word) {
  console.log(tweet_word)
  //alert(tweet_word);
  previous_query = document.getElementById("tweet").value;
  new_query = previous_query + ' ' + tweet_word;
  console.log(new_query)
  document.getElementById("tweet").value = new_query;
}

function tweet_input() {

}
var count = 0;
/*
var tweet_input = document.createElement("form");
tweet_input.setAttribute("class", "tweet_input");
tweet_input.setAttribute("id", "tweet_input");
tweet_input.setAttribute("value", "tweet_input");
*/

/*
function extra_query()
{
  count++
  var tweet_label = '<label for="tweet">Tweet (' += count += ')</label>';
  var tweet_input = '<input type="text" name="result_array[]" value="" /><br>';

  document.getElementById('tweet_in').insertAdjacentHTML("beforeend", tweet_label);
  document.getElementById('tweet_in').insertAdjacentHTML("beforeend", tweet_input);
  count++;
}
*/

document.getElementById("add_tweet_query_button").onclick = function() {
  //var label = document.createElement("div");
  var input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("name", "result_array[]");
  input.setAttribute("value", "");
  input.setAttribute("id", "multi_tweet");
  //label.setAttribute("value", "Tweet:")
  //label.appendChild(input);
  document.getElementById("multi_query").appendChild(input);
  return false;
};