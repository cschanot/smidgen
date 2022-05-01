// Required Modules
const express = require('express');
const path = require('path');
const app = express();
const port = 3030;

// CORS | needed to access the API from a non-local source.
const cors = require('cors');
app.use(cors());

// Middleware for processing JSON objects.
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({
    extended: false
}));

// Directory where my JS/CSS resides -- This and specific import formatting is needed to properly import JS/CSS using node/express.
// TLDR: we're adding the /static dirctory so now when doing imports, node looks in this directory
// Therefore with src we only need to concat the rest of the path.
// IE: src="/embed.js || This then loads /static/embed.js
// We could for example change the below to '/static/' and then we would import with src="embed.js" since the static directory already has the trailing "/"
app.use(express.static(__dirname + '/static'));

// Ran every time a request is made to express. Simply for testing.
app.use(function (req, res, next) {
    const {
        url,
        path: routePath
    } = req;
    console.log('Request: Timestamp:', new Date().toLocaleString(), ', URL (' + url + '), PATH (' + routePath + ').');
    next();
});

//Runs below command when specified path is accessed. "127.0.0.1:8080/api/v1/now" will run -> res.json({now: new Date().toString()});
app.get('/api/v1/now', (req, res) => {
    res.json({
        now: new Date().toString()
    });
});

// Home '/' is index.html.
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/templates/index.html'));
});

// Make index.html available at the spcified path.
app.get('/index', jsonParser, function (req, res) {
    res.sendFile(path.join(__dirname, '/templates/index.html'));
});

// Make auth.html available at the spcified path.
app.get('/auth', jsonParser, function (req, res) {
    res.sendFile(path.join(__dirname, '/templates/auth.html'));
    /*
    let uid = req.body.uid;
    db.collection('projects').doc('default_new').collection('users').doc(uid).set({
        role: 'user'
    }).then(() => {
        console.log('New user logged');
    }).catch(err => {
        console.error("Error logging new user", err);
    })
    */
})


// Start server
app.listen(port, () => {
    console.log("Server running at:\u001b[1;36m http://127.0.0.1:" + port + "\u001b[0m");
});