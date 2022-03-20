/*
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, onValue, update } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import {firebaseConfig} from "./firebaseConfig.js";
*/

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import {fileURLToPath} from 'url';

/*
const defaultApp = initializeApp(firebaseConfig);
const db = getDatabase(defaultApp);
const auth = getAuth(defaultApp);
*/

const app = express();
const port = 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


var jsonParser = bodyParser.json()

// Directory for JS/CSS
app.use(express.static(__dirname + '/static'));

// Ran every time a request is made to express.
app.use( function ( req, res, next ) {
    const { url, path: routePath }  = req ;
    console.log( 'Request: Timestamp:', new Date().toLocaleString(), ', URL (' + url + '), PATH (' + routePath + ').' ) ;
    next();
});

//Runs below command when specified path is accessed. "127.0.0.1:8080/api/v1/now" will run -> res.json({now: new Date().toString()});
app.get('/api/v1/now', (req, res) => {
    res.json({now: new Date().toString()});
});

/*
app.get('/firebaseConfig.js', (req, res) => {
    res.status(403).end();
});
*/

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

//app.get('/', express.static(path.join(__dirname, '')))

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

app.listen(port, () => {
    console.log('Server running on port http://127.0.0.1:'+port);
});