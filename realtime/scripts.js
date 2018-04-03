function createChatroomList(data) {
    return '<li class="list-group-item">' +
        '<span class="badge">' + data.num + '</span>' +
        '<span>' + data.room + '</span>' +
        '</li>';
}
function requestChatrooms() {
    $('#invalid').hide();
    $.get('/hotChatrooms', function (data, status) {
        if (status ==="success") {
            for (var i=0; i < data.length; i++) {
                $('ul#chatrooms').append(createChatroomList(data[i]));
            }
        } else {
            console.log(status);
        }
    })
}

function promptUserName() {
    var nickname = prompt("Please enter your name:", "Harry Potter");
    $('input#nickname').attr("value", nickname);
    return nickname;
}

function submitRoom(roomId) {
    var person = promptUserName();
    if (person == null || person == "") {
        return;
    }
    var new_action = '/chatroom/' + roomId;
    $('form#enter-chatroom').attr('action', new_action);
    $('form#enter-chatroom').submit();
}

function createNewRoom() {
    $.get('/createNewRoom', function(res){
        submitRoom(res);
    });
}

function enterRoom() {
    var roomId = $('input#roomId')[0].value;
    console.log("roomId: " + roomId);
    if (roomId ===  "") {
        $('#invalid').text("Please Input room ID!").show().fadeOut(3*1000);
        return;
    }
    submitRoom(roomId);
}

var socket = io.connect();

// fired when the page has loaded
$(document).ready(function(){
    // handle incoming messages
    socket.on('message', function(nickname, message, time){
        // display a newly-arrived message
        var new_message = new Object;
        new_message.nickname = nickname;
        new_message.body = message;
        $('ul#messages').append(createMessage(new_message));
        $("#chatroom-body").scrollTop($("#chatroom-body")[0].scrollHeight);
    });

    // handle room membership changes
    // you may want to consider having separate handlers for members joining, leaving, and changing their nickname
    socket.on('newMember', function(members, nickname){
        // display the new member list
        $('ul#members')[0].innerHTML = "";
        for (var i = 0; i < members.length; i++) {
            $('ul#members').append(createMember(members[i]));
        }
        // TODO: add info of new member;
        var message = '<strong class="welcome">' + nickname + '</strong>' + ' joined chatroom.';
        $('ul#system-messages').append(createSystemMessage(message));
    });

    socket.on('nicknameChanged', function(members, old_nickname, new_nickname) {
        $('ul#members')[0].innerHTML = "";
        for (var i = 0; i < members.length; i++) {
            $('ul#members').append(createMember(members[i]));
        }
        // TODO: add info of nickname change;
        var message = '<strong class="welcome">' + old_nickname + '</strong>' +
            ' changed name to ' + '<strong class="welcome">' + new_nickname + '</strong>.';
        console.log(message);
        $('ul#system-messages').append(createSystemMessage(message));
    });

    socket.on('memberLeave', function(members, nickname) {
        $('ul#members')[0].innerHTML = "";
        for (var i = 0; i < members.length; i++) {
            $('ul#members').append(createMember(members[i]));
        }
        // TODO: add info of nickname change;
        var message = '<strong class="welcome">' + nickname + '</strong>'+ ' left chatroom.';
        $('ul#system-messages').append(createSystemMessage(message));
    });

    $('#empty-message').hide();
    // get the nickname
    //var nickname = promptUserName();

    // join the room
    socket.emit('join', meta('roomId'), meta('nickname'), function(messages){
        // process the list of messages the server sent back
        $('ul#messages')[0].innerHTML='';
        for(var i = 0; i < messages.length; i++) {
            $('ul#messages').append(createMessage(messages[i]));
        }
        $("#chatroom-body").scrollTop($("#chatroom-body")[0].scrollHeight);
    });
});

function meta(name) {
    var tag = document.querySelector('meta[name=' + name + ']');
    if (tag != null)
        return tag.content;
    return '';
}

function createMessage(message) {
    var author = message.nickname;
    var content = message.body;
    return '<li class="list-group-item">' +
        '<strong class="welcome">' +
        author + ': </strong>' + content + '</li>';
}

function createSystemMessage(message) {
    return '<li class="list-group-item">' +
         message + '</li>';
}

function sendMessage() {
    var content = $('#new-message')[0].value;
    if (content === "") {
        $('#empty-message').text("Message Empty!").show().fadeOut(3000);
        return
    }
    var nickname = meta('nickname');
    var roomId = meta('roomId');
    socket.emit('message', content);
    $('#new-message').val("");
}

function createMember(member) {
    return '<li class="list-group-item">' +
        member + '</li>';
}

function changeNickname() {
    var new_nickname = prompt("Please enter your new nickname:");
    socket.emit('nickname', new_nickname, function(nickname){
        $("meta[name='nickname']").attr('content', new_nickname);
        $("#title-nickname")[0].innerText = nickname;
    });
}