const express = require('express');
const path = require('path');
const app = express();

// view engine setup
app.use(require('body-parser').urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Directory for JS/CSS
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index', jsonParser, function (req, res) {
    res.sendFile(path.join(__dirname, '/templates/index.html'));
});

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

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/templates/index.html'));
  });

app.post('/papi', function(req, res) {
    console.log(req.body)
    res.send(req.body);
    const { exec } = require("child_process");
    if (req.body["tweet"]) {
    console.log(req.body["tweet"]) 
    let execcmd = "python3 full_archive.py S " + req.body["tweet"];
    exec(execcmd, (error, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
});
    }
    if (req.body["result_array[]"]) {
    console.log(req.body["result_array[]"]) 
     let execcmd = "python3 full_archive.py M " + req.body["result_array[]"];
     exec(execcmd, (error, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
});
    }
});


module.exports = app;
