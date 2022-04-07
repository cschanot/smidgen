// Required Modules
const express = require('express');
const path = require('path');
const app = express();
const port = 3030;

// Middleware for processing JSON objects.
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({
    extended: false
}));

// PythonShell Imports
let PythonShellLibrary = require('python-shell');
let {PythonShell} = PythonShellLibrary;

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

app.get('/results', function (req, res) {
    res.sendFile(path.join(__dirname, '/templates/results.html'));
});

// 'PythonShell' Implementation
app.post('/results', function (req, res) {

    // 'spawn' Implementation.
    const {
        spawn
    } = require("child_process");

    //Debugging
    //console.log("req body S: ",req.body["tweet"]);
    //console.log("req body M: ",req.body["query_array[]"]);

    // If single-query
    if (req.body["tweet"]) {
        console.log(req.body["tweet"]);

        // PythonShell Implementation //

        // Python options used when the call is made.
        let options = {
            mode: 'text',
            pythonOptions: ['-u'],
            args: ['S', req.body["tweet"]]
        };

        // Run script w/single-query option.
        PythonShell.run('full_archive.py', options, function (err, results)
        {
            if (err) throw err;

            // PythonShell returns 'results' as an array.
            for(let i = 0; i < results.length; i++){
                // Showing array in console.
                console.log(results[i]);
                // Appending breaks for readability. // This is still serverside, so things like document.getElementById will not work. //
                results[i] += '<br>';
            }
            // Send results to /results
            res.send(JSON.stringify(results));
        })
    }

    // If multi-query
    if (req.body["query_array[]"]) {
        console.log(req.body["query_array[]"]);

        // PythonShell Implementation //

        // Python options used when the call is made.
        let options = {
            mode: 'text',
            pythonOptions: ['-u'],
            args: ['M', req.body["query_array[]"]]
        };

        // Run script w/multi-query option.
        PythonShell.run('full_archive.py', options, function (err, results)
        {
            if (err) throw err;

            // PythonShell returns 'results' as an array.
            for(let i = 0; i < results.length; i++){
                // Showing array in console.
                console.log(results[i]);
                // Appending breaks for readability. // This is still serverside, so things like document.getElementById will not work. //
                results[i] += '<br>';
            }
            // Send results to /results
            res.send(JSON.stringify(results));
        })
    }
});

// Child process created when post is sent from index page. -> When the user submits a single or multi-query.
/* 'exec' Implementation
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
            res.send('stdout: ' + stdout);
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
*/

// Child process created when post is sent from index page. -> When the user submits a single or multi-query.
/* 'spawn' Implementation
app.post('/results', function (req, res) {

    // 'spawn' Implementation.
    const {
        spawn
    } = require("child_process");

    //Debugging
    //console.log("req body S: ",req.body["tweet"]);
    //console.log("req body M: ",req.body["query_array[]"]);

    // If single-query
    if (req.body["tweet"]) {
        console.log(req.body["tweet"]);
        // spawn(command, [param1, ... ,paramN])
        // full_archive.py 'S' req.body["tweet"] || Calls the script, with:
        // sys.argv[1] being 'S' for single query.
        // sys.argv[2] being req.body["tweet"] for the user input query.
        
        const tweet_out = spawn('python', ['full_archive.py', 'S', req.body["tweet"]]);
        tweet_out.stdout.on("data", (data) => {
            // If it's not converted to string, it downlods to output to your PC.
            // Format is a node.js buffer.
            data = data.toString();
            //console.log("output type: ", typeof output);
            console.log(data);
            res.send(data);
        });

        tweet_out.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        tweet_out.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }

    // If multi-query
    if (req.body["query_array[]"]) {
        console.log(req.body["query_array[]"]);

        const tweet_out = spawn('python', ['-u full_archive.py', 'M', req.body["query_array[]"]]);
        tweet_out.stdout.on("data", function (data) {
            data = data.toString();
            //console.log("MULTI res.send CALLED");
            res.send(data);
            console.log(data);
        });

        tweet_out.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        tweet_out.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }
});
*/

// Start server
app.listen(port, () => {
    console.log("Server running at:\u001b[1;36m http://127.0.0.1:" + port + "\u001b[0m");
});