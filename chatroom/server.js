var express = require('express');
var colors = require('colors');
var bodyparser = require('body-parser');
var pug = require('pug');
var anyDB = require('any-db');
var port = 8080;

setup();
dbconn = createDB();

function setup() {

    var app = express();


    app.use(bodyparser.urlencoded({
        extended: false,
    }));
    app.use(bodyparser.json());

    app.set('view engine', 'pug');
    app.set('views', './views')

    app.get('/', function (request, response) {
        response.redirect("./index");
    });

    app.get('/index', renderIndex);

    app.post('/createNewRoom', createNewRoom)

    app.get('/scripts.js', function(req, res) {
        res.sendFile(__dirname + "/" + "scripts.js");
    });

    app.all("*", handle404);

    var server = app.listen(port);
    console.log(("- Server listening on port: " + port).gray)
}

function logError(err) {
    if (err != null) {
        console.log(err.red)
    }
}

function createDB() {
    var conn = anyDB.createConnection('sqlite3://chatroom.db');
    conn.query('' +
        'CREATE TABLE rooms (' +
        '  room TEXT PRIMARY KEY)', function (err, data) {
            logError(err);
        }
    );
    conn.query('' +
        'CREATE TABLE message (' +
        '  id INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '  room TEXT,' +
        '  nickname TEXT,' +
        '  body TEXT,' +
        '  time INTEGER，' +
        '  FOREIGN KEY （room) REFERENCES rooms(room) ' +
        ')', function (err, data) {
            logError(err);
        }
    );
    return conn;
}

// renderIndex
function renderIndex(request, response) {
    response.render('index', {});
}

function handle404(request, response){
    response.sendStatus(404);
}

function generateRoomIdentifier() {
    // make a list of legal characters
    // we're intentionally excluding 0, O, I, and 1 for readability
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    var result = '';
    for (var i = 0; i < 6; i++)
        result += chars.charAt(Math.floor(Math.random() * chars.length));

    return result;
}

function generateRoomIDDB() {

}
function createNewRoom(request, response) {
    var roomId = generateRoomIdentifier();
    console.log(request.green);
    dbconn.query('INSERT INTO rooms VALUES($1)', [roomId], function(err, data) {
        logError(err);
        if (err != null) {
            createNewRoom(request, response);
        } else {
            console.log(request.green);
            var nickname = request.body.nickname;
            response.redirect(response.render('chatroom', {
                roomName: roomId,
                nickname: nickname
            }))
        }
    });
}