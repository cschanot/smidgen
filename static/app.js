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
  console.log(previous_query)
  return document.getElementById("tweet").innerHTML.value = new_query;
  } 
