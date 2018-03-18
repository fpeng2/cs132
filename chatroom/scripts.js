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

var nInterval = undefined;
var delay = 5;

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

function getMessages() {
    var roomId = meta('roomId');
    $.get('/'+roomId+'/messages', function (data, status) {
        if (status === "success") {
            $('ul#messages')[0].innerHTML='';

            for(var i = 0; i < data.length; i++) {
                $('ul#messages').append(createMessage(data[i]));
            }
        } else {
            console.log("Received error:" + status);
        }
        $("#chatroom-body").scrollTop($("#chatroom-body")[0].scrollHeight);
    })
}

function initMessages() {
    getMessages();
    nInterval = setInterval(getMessages, delay * 1000);
    $('#empty-message').hide();
}

function sendMessage() {
    var content = $('#new-message')[0].value;
    if (content === "") {
        $('#empty-message').text("Message Empty!").show().fadeOut(3000);
        return
    }
    var nickname = meta('nickname');
    var roomId = meta('roomId');
    $.post('/'+roomId+'/sendMessage', {
        nickname: nickname,
        content: content
    }, function (data) {
        if (data == "ok") {
            $('#new-message').val("");
            clearInterval(nInterval);
            initMessages();
        } else {
            $('span#info').text("Failed to send message!").show();
        }
    }).fail(function() {
        $('span#info').text("Failed to send message!").show();
    })
}
