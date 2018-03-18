var port = 8080;


var colors = require('colors');
var express = require('express');
var bodyparser = require('body-parser')
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


setup()

function setup(){

    var app = express();

    app.get('/', function (request, response) {
        response.redirect("./login");
    });

    app.get('/login', function (request, response) {
        response.sendFile(__dirname + '/login.html');
    });

    app.get('/market', function (request, response) {
        response.redirect('/logout')
    });

    app.get('/styles.css', function(req, res) {
        res.sendFile(__dirname + "/" + "styles.css");
    });
    app.use(bodyparser.urlencoded({
        extended: false,
    }));
    app.post('/home', handleLogin);

    app.get('/logout', function (request, response) {
        response.redirect("/login");
    });

    app.all("*", handle404);
    //app.use(errorHandler);

    var server = app.listen(port);
    console.log(("- Server listening on port: " + port).gray)
}

function handle404(request, response){
    response.sendStatus(404);
}

function handleLogin(request, response) {
    var username=request.body.username;
    var h1='<h1 style=\"color: #2e6c80;\">Welcome back, ' + username + '</h1>';
    var market = '<a href=\"/market\"><span class=\"go\">To market!</span> </a>';
    var logout = '<br/><a href=\"/logout\"> Logout</a>';
    response.send(h1+market+logout);
}