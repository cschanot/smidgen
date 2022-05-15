
const express = require('express');
const path = require('path');
const fileURLToPath = require('url')

const app = express();
const port = 8081;

// CORS | needed to access the python API from a non-local source.
const cors = require('cors');
app.use(cors());

// Middleware for processing JSON objects.
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({
    extended: false
}));

// Firebase (https://firebase.google.com/docs/admin/setup#set-up-project-and-service-account)
const { initializeApp } = require('firebase-admin/app');
const { firestore } = require("firebase-admin");
var admin = require("firebase-admin");
// Generate file here -> https://console.firebase.google.com/u/1/project/smidgen-5f8b9/settings/serviceaccounts/adminsdk
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smidgen-5f8b9-default-rtdb.firebaseio.com"
});
const db = admin.firestore()


app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use( function ( req, res, next ) {
    const { url, path: routePath }  = req ;
    console.log( 'Request: Timestamp:', new Date().toLocaleString(), ', URL (' + url + '), PATH (' + routePath + ').' ) ;
    next();
});

app.get('/api/v1/now', (req, res) => {
    res.json({now: new Date().toString()});
});

app.get('/firebaseConfig', (req, res) => {
    res.status(403).end();
});

app.get('/config', (req, res) => {
    var config = require('./firebaseConfig.json');
    res.send(JSON.stringify(config));
})

//app.use(express.static(__dirname + '/node_modules/firestore/app/'));

app.post('/api/v1/login', jsonParser, function (req, res) {
    
});

app.post('/api/v1/signup', jsonParser, function (req, res) {
    console.log(req.body.uid)
    //db.collection('users').doc(req.body.uid.toString()).set();
})

// Project dashboard:
app.get('/projects', function(req, res){
    res.sendFile(path.join(__dirname+'/html/projects.html'))
});

// User access dashboard: 
app.get('/projects/access/:projectID', function(req, res){
    res.sendFile(path.join(__dirname+'/html/ManageAccess.html'))
})

// Load existing projects:
app.get('/loadProjects', (req, res) => {
    var projects = []
    db.collection('projects').get().then(function(result){
        result.forEach(doc => {
            var project_dic = {'id': doc.id, 'name': doc.data().name}
            console.log(project_dic)
            projects.push(project_dic)
        })
        console.log(projects)
        res.send(projects)
    })
})
// Create a project: 
app.post("/createProject",(req, res) => {
    console.log("Creating project: ", req.body)
    const new_project = db.collection('projects').doc(req.body.id) //Document id is always a string
    new_project.set({
        name:req.body.name
    })

    // db.collection('projects').doc(req.body.id).collection('tweets') //Notice that we can't create empty collections. So comment these two lines out
    // db.collection('projects').doc(req.body.id).collection('users')
})

//Rename a project:
app.post("/renameProject",(req, res) => {
    const curr_project = db.collection('projects').doc(req.body.id)
    curr_project.set({
        name:req.body.new_name
    })
})

//Delete a project:
app.post("/deleteProject",(req, res) => {
    db.collection('projects').doc(req.body.id).delete().then(function(){
    console.log(req.body.id + " deleted!");
    }).catch(function(error){
    console.log("Error removing doc: ", error)
    })
})

//Load existing user:
app.get('/loadUsers', (req, res) => {
    var project_id = req.get('Referrer').split('/').pop()
    var users_arr = []
    db.collection('projects').doc(project_id).collection('users').get().then(function(users){
        users.forEach(doc => {
            var user_dic = {'id': doc.id, 'name': doc.data().name, 'email': doc.data().email, 'role': doc.data().role}
            users_arr.push(user_dic)
        })
        console.log(users_arr)
        res.send(users_arr)
    })
})
// Add a user: 
app.post("/addUser", (req, res) => {
    var project_id = req.get('Referrer').split('/').pop()
    const new_user = db.collection('projects').doc(project_id).collection('users').doc(req.body.id.toString()).set({
    name: req.body.fullName,
    email: req.body.email,
    role: req.body.role
    })
})
//change user/admin
app.post('/changeUserRole', (req, res) => {
    
    var project_id = req.get('Referrer').split('/').pop()
    let documentRef = db.collection('projects').doc(project_id).collection('users').doc(req.body.id.toString());
    documentRef.update( {role: req.body.role}).then(() => {
        console.log('Successfully executed batch.',req.body.id,req.body.role);
        res.send("success")
    });   

})

// Delete a user:
app.post("/delUser", (req, res) => {
    var project_id = req.get('Referrer').split('/').pop()
    db.collection('projects').doc(project_id).collection('users').doc(req.body.id.toString()).delete().then(function(){
        console.log("User deleted!");
        }).catch(function(error){
        console.log("Error deleting user ", error)
    })
})

// Search page
app.get('/search', function (req, res) {
    res.sendFile(path.join(__dirname, '/html/search.html'));
});

// Auth page
app.get('/auth', function (req, res) {
    res.sendFile(path.join(__dirname, '/html/auth.html'));
});


// A middle ware for serving static files
app.use('/', express.static(path.join(__dirname, '')))

// Start server
app.listen(port, () => {
    console.log("Server running at:\u001b[1;36m http://127.0.0.1:" + port + "\u001b[0m");
});
