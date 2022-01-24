// Temp
twttr.widgets.createTweet(
  '463440424141459456',
  document.getElementById('embed'), {
    theme: 'dark'
  }
);

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