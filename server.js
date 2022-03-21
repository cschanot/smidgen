const express = require('express');
const path = require('path');
const app = express();
const port = 3030;

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
app.use(require('body-parser').urlencoded({
    extended: false
}));

app.set('view engine', 'jade');

// Directory for JS/CSS
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

/*
app.get('/firebaseConfig.js', (req, res) => {
    res.status(403).end();
});
*/

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

// Home '/' is index.html.
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/templates/index.html'));
});

//app.get('/', express.static(path.join(__dirname, '')))

// Exec call made when post is sent from index page. -> When the user submits a single or multi-query.
app.post('/result', function (req, res) {
    console.log(req.body)
    // res.send(req.body);
    const {
        exec
    } = require("child_process");
    
    // If single-query
    if (req.body["tweet"]) {
        console.log(req.body["tweet"])
        // Call python script with sys.argv[1] being "S" for single-query.
        // sys.argv[2] here is the user input string.
        // full_archive.py then calls the single_query function with user input.
        let execcmd = "python full_archive.py S " + req.body["tweet"];
        exec(execcmd, (error, stdout, stderr) => {
            res.send('stdout: '+ stdout);
            console.log('stderr:' + stderr);
            console.log('error:' + error);
        });
    }
    // If multi-query
    if (req.body["result_array[]"]) {
        console.log(req.body["result_array[]"])
        // Call python script with sys.argv[1] being "M" for multi-query
        // sys.argv[2] here is the user input array.
        // full_archive.py then calls the multi_query function with user input array.
        // UNTESTED
        let execcmd = "python full_archive.py M " + req.body["result_array[]"];
        exec(execcmd, (error, stdout, stderr) => {
            res.send(`stdout: ${stdout}`);
            console.log(`stdout: ${stdout}`);
            console.log('stderr:' + stderr);
            console.log('error:' + error);
        });
    }
});

// Start server
app.listen(port, () => {
    //console.log('Server running on port http://127.0.0.1:' + port);
    console.log( "Server running at:\u001b[1;36m http://127.0.0.1:"+ port + "\u001b[0m" );
});