# SMIDGen

A web application that allows users to pull in tweets based on keywords, determine relavence of the given tweets, and use AI and machine
learning to recommend new keywords based on the tweets selected as relavant. Project owners will be able to create, delete, and rename projects, as well as manage access to projects by other users. 

# To get current state running (locally):
1. install node js https://nodejs.org/en/download/
2. command: git clone https://github.com/Sensify-Lab/SMIDGen
3. navigate to project folder
4. command: npm i http-server -g
5. command: http-server
6. Open a browser and type "localhost:8080"

# To get current state running (remotely):
## When logged into smidgen.cis.udel.edu do the following:
1. Clone the repository: `git clone https://github.com/Sensify-Lab/SMIDGen`
>***Note:*** you will need to use a [GitHub Personal Access Token](https://github.com/settings/tokens) for the password field to clone through SSH. Your account password will NOT work.
2. Create virtual environment: `python3 -m venv <env name>`
3. Activate virtual environment: `source <env name>/bin/activate`
4. Host server from project folder. `nohup node NAME_HERE.js &`

You can now access your server on the specified `IP:Port` of your project. For example:
http://smidgen.cis.udel.edu:3030/

If you want to stop the server, you run `kill PID_HERE`. To find your node server's PID either note the outputted PID when you ran the nohup command or run `ps aux|grep 'node'` and find your server in the list.



# Moving Forward
1. Write API to connect front end to firebase
2. Save results of twitter search in temporary cookie state so resulting .json file can be pushed onto firebase
3. Machine Learning to suggest new keywords to user

# Dependencies

Collabortweet: https://github.com/cbuntain/collabortweet

    "bluebird": "^3.4.7",
    "body-parser": "^1.15.2",
    "connect-flash": "^0.1.1",
    "cookie-parser": "^1.4.3",
    "core-js": "^3.18.2",
    "csv": "^5.3.2",
    "export-to-csv": "^0.2.1",
    "express": "^4.17.1",
    "express-session": "^1.14.2",
    "fs-extra": "^10.0.0",
    "fs-promise": "^1.0.0",
    "html": "^1.0.0",
    "klaw": "^4.0.1",
    "pandas": "0.0.3",
    "passport": "^0.3.2",
    "passport-local": "^1.0.0",
    "pug": "^3.0.0",
    "requests": "^0.3.0",
    "sqlite": "^2.2.4",
    "sqlite3": "^4.2.0"
    
Twitter Search: https://github.com/ckoepp/TwitterSearch

Bootstrap: https://getbootstrap.com

Firebase: https://console.firebase.google.com/project/smidgen-5f8b9/overview

Node.js: Not yet implemented

