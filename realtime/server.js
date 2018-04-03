var http = require('http'); // this is new
var express = require('express');
var colors = require('colors');
var bodyparser = require('body-parser');
var pug = require('pug');
var anyDB = require('any-db');

var port = 8080;

var app = express();
var server = http.createServer(app); // this is new

// add socket.io
var io = require('socket.io').listen(server);
// changed from *app*.listen(8080);
server.listen(8080);
console.log(("- Server listening on port: " + port).gray);

setup(app);
dbconn = createDB();

function setup(app) {
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

    app.get('/scripts.js', function(req, res) {
        res.sendFile(__dirname + "/" + "scripts.js");
    });

    app.get('/styles.css', function(req, res) {
        res.sendFile(__dirname + "/" + "styles.css");
    });

    app.all('/chatroom/*', invalidRoom)
    app.all("*", handle404);

}


// socket io
io.sockets.on('connection', function(socket){
    // clients emit this when they join new rooms
    socket.on('join', function(roomId, nickname, callback){
        socket.join(roomId); // this is a socket.io method
        socket.nickname = nickname; // yay JavaScript! see below
        socket.roomId = roomId;
        console.log(socket.nickname);
        console.log(socket.roomId);

        var members = getMembers(roomId);
        io.sockets.in(roomId).emit('newMember', members, nickname);
        // get a list of messages currently in the room, then send it back
        dbconn.query(getMessageQuery,
            [roomId], function (err, result) {
                logError(err);
                if (err != null) {
                    callback([]);
                } else {
                    var messages = result.rows;
                    callback(messages);
                }
            });
    });

    // this gets emitted if a user changes their nickname
    socket.on('nickname', function(nickname, callback){
        var old_nickname = socket.nickname;
        socket.nickname = nickname;
        //broadcast update to room! (see below)
        var roomId = Object.keys(io.sockets.adapter.sids[socket.id])[1];
        var members = getMembers(roomId);
        io.sockets.in(roomId).emit('nicknameChanged', members, old_nickname, nickname);
        callback(nickname);

    });

    // the client emits this when they want to send a message
    socket.on('message', function(message){
        // process an incoming message (don't forget to broadcast it to everyone!)

        var roomId = Object.keys(io.sockets.adapter.sids[socket.id])[1];
        var nickname = socket.nickname;
        var d = new Date();
        var time = d.getTime();
        console.log([roomId, nickname, message, time]);
        dbconn.query(storeMessageQuery,
            [null, roomId, nickname, message, time], function(err, data) {
                logError(err);
                if (err == undefined) {
                    console.log("message inserted.")
                }
            });

        // then send the message to users!
        io.sockets.in(roomId).emit('message', nickname, message, time);

    });

    // the client disconnected/closed their browser window
    socket.on('disconnect', function(){
        console.log('Got disconnect!');
        // // Leave the room!
        // var roomId = Object.keys(io.sockets.adapter.sids[socket.id])[1];
        var roomId = socket.roomId;
        if (roomId != undefined && roomId != '') {
            var members = getMembers(roomId);
            io.sockets.in(roomId).emit('memberLeave', members, socket.nickname);
            socket.leave(roomId);
        }
    });

    // an error occured with sockets
    socket.on('error', function(){
        // Don't forget to handle errors!
        // Maybe you can try to notify users that an error occured and log the error as well.
        console.log('error occured!');
    });

});

function getMembers(roomId) {
    var members = [];
    var room = io.sockets.adapter.rooms[roomId];
    if (room == undefined) {
        return members;
    }
    var clients = room.sockets;
    for(var clientId in clients) {
        var clientSocket = io.sockets.connected[clientId];
        members.push(clientSocket.nickname);
    }
    console.log(members);
    return members;
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
var getMessageQuery = '' +
    'SELECT nickname, body, time' +
    ' FROM messages' +
    ' WHERE room=$1' +
    ' ORDER BY time ASC';

var storeMessageQuery ='' +
    'INSERT INTO messages ' +
    'VALUES($1, $2, $3, $4, $5)';

