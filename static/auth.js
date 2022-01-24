// Firebase Sign-Up Function

// TODO: Display errors to user such as ->
// 1. Email already taken
// 2. Passwork too weak (Firebase requires [recommends?] 6 characters)
// 3. Login/Logout elements flashing for a second as firebase reauthenticates a user on refresh.
// https://stackoverflow.com/questions/60156164/how-to-stop-firebase-re-auth-on-every-page-reload-in-a-react-app

// For now errors are displayed in console only (CTRL+Shift+i)
const loginForm = document.querySelector('#login-form');
const signupForm = document.querySelector('#signup-form');
const logoutNav = document.getElementById("logout-nav");

// Firebase log-in function

// TODO: Display errors to user such as ->
// 1. Only display ("Invalid Login") for security reasons?

// For now errors are displayed in console only (CTRL+Shift+i)
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Grab input from user.
        let userEmail = document.getElementById("user-email").value;
        let userPassword = document.getElementById("user-password").value;

        // Sign in user with firebase.
        firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
            .then((userCredential) => {

                // Signed in
                window.location = 'index.html';
                const user = userCredential.user;
                console.log(user);
                loginForm.reset();
            }).catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong email or password.');
                } else {
                    alert(errorMessage);
                }
            });
    })
};

// New user sign-up
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const auth = firebase.auth();

        var userEmail = document.getElementById("signup-email").value;
        var userPassword = document.getElementById("signup-password").value;
        var confirmPass = document.getElementById("signup-confirm-pass").value;
        if (userPassword === confirmPass) {
            auth.createUserWithEmailAndPassword(userEmail, userPassword)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    document.getElementById('login-nav').style.display = 'none';
                    document.getElementById('logout-nav').style.display = 'block';

                    // Create a collection that is linked to the unique user ID that is logged in.
                    return db.collection('users').doc(userCredential.user.uid).set({
                            email: userEmail
                        }).then(() => {
                            // Debugging code, remove from production.
                            console.log("Document written with ID: ", userCredential.user.uid);

                            signupForm.reset();
                            window.location = 'index.html';
                        })
                        .catch((error) => {
                            console.error("Error adding document: ", error);
                        })
                });
        } else {
            document.getElementById("pass-match-alert").style.display = "block";
            // Change this later, alerts are terrible.
            window.alert("Passwords must match!");
        }
    })
}


// Real Time Listener (Logout)
if (logoutNav) {
    logoutNav.addEventListener("click", (e) => {
        e.preventDefault();
        firebase.auth().signOut();
        document.getElementById('login-nav').style.display = 'block';
        document.getElementById('logout-nav').style.display = 'none';
        window.location = 'auth.html';
        //console.log("LOGOUT BUTTON CLICKED");
    })
}

function showSignUpForm() {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

function showLoginForm() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Banner on main page was built oddly, so I had to make a funtion specifically
// for it to hide the login button while someone is already logged in.
// >> Bootstrap blocking class changes with !important?
/*
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        // Grab documents to hide/show.
        var login = document.getElementById('loginNav');

        // Hide login button when logged in.
        login.classList.remove("nav-item");
        login.style.display = 'none';
    } else {
        // Grab documents to hide/show.
        var logout = document.getElementById('logoutNav');
        var monthView = document.getElementById('monthView');
        var dayView = document.getElementById('dayView');

        // Hide logout button when not logged in.
        logout.classList.remove("nav-item");
        logout.style.display = 'none';

        // Hide month/day nav items when not logged in.
        monthView.classList.remove("nav-item");
        monthView.style.display = 'none';
        dayView.classList.remove("nav-item");
        dayView.style.display = 'none';
    }
});*/
