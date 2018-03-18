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

    app.get('/hotChatrooms', getHotChatrooms);

    app.get('/createNewRoom', createNewRoom);

    //app.post('/chatroom', tmp)
    app.post('/chatroom/:roomId([ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6})', enterRoom);

    app.get('/:roomId([ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6})/messages', getMessages);

    app.post('/:roomId([ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6})/sendMessage', sendMessage);

    app.get('/scripts.js', function(req, res) {
        res.sendFile(__dirname + "/" + "scripts.js");
    });

    app.get('/styles.css', function(req, res) {
        res.sendFile(__dirname + "/" + "styles.css");
    });

    app.all('/chatroom/*', invalidRoom)
    app.all("*", handle404);


    var server = app.listen(port);
    console.log(("- Server listening on port: " + port).gray)
}

function logError(err) {
    if (err != undefined) {
        console.log(err);
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
        'CREATE TABLE messages (' +
        '  id INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '  room TEXT,' +
        '  nickname TEXT,' +
        '  body TEXT,' +
        '  time INTEGER, ' +
        '  FOREIGN KEY (room) REFERENCES rooms(room) ' +
        ')', function (err, data) {
            logError(err);
        }
    );
    return conn;
}

// handle 404
function invalidRoom(request, response) {
    response.render('invalidRoom', {});
}
function handle404(request, response){
    response.sendStatus(404);
}

// renderIndex
function renderIndex(request, response) {
    response.render('index', {});
}

function getHotChatrooms(request, response) {
    var sql = '' +
        'SELECT COUNT(body) as num, room ' +
        ' FROM messages' +
        ' GROUP BY room' +
        ' ORDER BY COUNT(body) DESC';
    dbconn.query(sql, function (err, result) {
        logError(err);
        if (err != null) {
            response.json([]);
        } else {
            var rows = result.rows;
            console.log(rows);
            //rows = rows.filter(item => item.num > 0);
            rows = rows.slice(0, 20);
            response.json(rows);
        }
    })
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

function createNewRoom(request, response) {
    var roomId = generateRoomIdentifier();
    dbconn.query('INSERT INTO rooms VALUES($1)', [roomId], function(err, data) {
        logError(err);
        if (err != null) {
            createNewRoom(request, response);
        } else {
            console.log(("New room ID:" + roomId).green);
            response.send(roomId);
        }
    });
}

function enterRoom(request, response) {
    var roomId = request.params.roomId;
    var nickname = request.body.nickname;
    response.render('chatroom', {
                roomId: roomId,
                nickname: nickname
            }, function(err, html){
                logError(err);
                console.log(("redirecting to chatroom" + roomId).gray);
                response.send(html);
            });
}

//chatroom
function getMessages(request, response) {
    var roomId = request.params.roomId;
    dbconn.query('' +
        'SELECT nickname, body, time' +
        ' FROM messages' +
        ' WHERE room=$1' +
        ' ORDER BY time ASC',
        [roomId], function (err, result) {
            logError(err);
            if (err != null) {
                response.json([]);
            } else {
                var messages = result.rows;
                console.log(messages);
                console.log(typeof(messages));
                response.json(messages);
            }
        })
}

function sendMessage(request, response) {
    var roomId = request.params.roomId;
    var nickname = request.body.nickname;
    var message = request.body.content;
    var d = new Date();
    var time = d.getTime();
    console.log([roomId, nickname, message, time]);
    dbconn.query('' +
        'INSERT INTO messages ' +
        'VALUES($1, $2, $3, $4, $5)',
        [null, roomId, nickname, message, time], function(err, data) {
            logError(err);
            if (err != undefined) {
                response.send(err);
            } else {
                console.log("message inserted.")
                response.send("ok");
            }
        })
}