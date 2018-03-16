function promptUserName() {
    var nickname = prompt("Please enter your name:", "Harry Potter");
    return nickname;
}

function createNewRoom() {
    var nickname=promptUserName();
    console.log(nickname);
    $.post('/createNewRoom', {
        nickname: nickname
    }, function(res){
        console.log(res.blue)
    });
}

function enterRoom() {
    var roomNumber = $('#roomNumber')[0].value;
    var nickname=promptUserName();
    $.post('/enterRoom', {
        nickname: nickname,
        roomNumber: roomNumber,
    }, function(res) {

    })

}