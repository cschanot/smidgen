// Temp
fetch('/ids')
    .then(function (response) {
        return response.text();
    }).then(function (text) {
        console.log('GET response text:');
        console.log(text); // Print the greeting as text
        document.getElementById('py2js').innerHTML = text;
    });

twttr.widgets.createTweet(
    '463440424141459456',
    document.getElementById('embed'), {
      theme: 'dark'
    }
  );