const navHTML = `<div class="header-footer">
<ul class="nav">
    <li>
    <a class="nav" href='../index_welcome.html')>Home</a>
    <a class="nav" href='../html/project_dashboard.html'>Dashboard</a>
    <a class="nav" href='../html/index_login.html')>Login</a>
    <a class="nav" href='../html/index_signup.html')>Sign Up</a>
</li>
</ul>
</div>`

function loadNavBar() {
    var elements = Array.from(document.getElementsByClassName("navbar-placeholder"));
    elements.forEach((div) => {
        div.innerHTML = navHTML;
    });
        
}
loadNavBar();