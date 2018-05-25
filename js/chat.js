var $socket = io.connect('https://multilingual-chat.herokuapp.com/');

var $nickname;
var $room;
var $language;

//ON ADMIN MESSAGE RECEIVED
$socket.on('adminMessage', function (messages) {
    var li = $('<li class="message-center"></li>');
    li.text('Server: ' + messages[$language]);

    //DISPLAY IT
    $('#messages').append(li);
});

//ON NEW MESSAGE RECEIVED
$socket.on('newMessage', function (messages, from) {
    var li = $('<li></li>');

    if (from !== $nickname)
        li.addClass('message-left');
    else
        li.addClass('message-right');

    //RETRIEVE THE CORRECT LANGUAGE MESSAGE
    li.text(from + ' : ' + messages[$language]);

    //DISPLAY IT
    $('#messages').append(li);

});

//ON LEFT MESSAGE RECEIVED
$socket.on('leftMessage', function (messages) {
    var li = $('<li class="message-center red"></li>');
    li.text('Server: ' + messages[$language]);

    //DISPLAY IT
    $('#messages').append(li);
});
//ON JOIN MESSAGE RECEIVED
$socket.on('joinMessage', function (messages) {
    var li = $('<li class="message-center green"></li>');
    li.text('Server : ' + messages[$language]);

    //DISPLAY IT
    $('#messages').append(li);
});
//ON UPDATE USERS LIST MESSAGE RECEIVED
$socket.on('updateUserList', function (users) {
    var usersList = $('<ul></ul>');

    users.forEach(function (user) {
        usersList.append($('<li></li>').html(user.nickname+" <span>"+user.language.slice(3,5)+"</span>"));
    });

    $('#users').html(usersList);

});

$(document).ready(function () {
    var url = new URL(window.location.href);
    $nickname = url.searchParams.get('nickname');
    $room = url.searchParams.get('room');
    $language = url.searchParams.get('language');

    $socket.emit('join', $nickname, $room, $language);

    $('#message-form').submit(function (e) {
        e.preventDefault();
        sendMessage();
    });

    $('#color-picker li').click(function (e) {
        var color = $(e.target).attr('data-color');
        if (color === 'white') {
            $('.chat-sidebar h3').css('color', 'black');
        } else {
            $('.chat-sidebar h3').css('color', 'white');
        }
        $('.chat-sidebar').css('background', color);
    })
});

//SEND MESSAGE METHOD
function sendMessage() {
    var $input = $('input[name="message"]');
    var $message = $input.val();

    if ($message.length > 0) {

        //RESET MESSAGE INPUT
        $input.val('');
        //SEND MESSAGE TO SOCKET :
        //PARAMS : methodName, nickname, room, language, message
        $socket.emit('sendMessage', $nickname, $room, $language, $message);
    }
}