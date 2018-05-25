var $socket = io.connect('https://multilingual-chat.herokuapp.com/');

var $nickname;
var $room;
var $language;

//ON ADMIN MESSAGE RECEIVED
$socket.on('adminMessage', function (messages) {
    //TODO
    //RETRIEVE THE CORRECT LANGUAGE MESSAGE
    var li = jQuery('<li class="left"></li>');
    li.text('Admin : '+messages[$language]);

    //DISPLAY IT
    $('#messages').append(li);
});

//ON NEW MESSAGE RECEIVED
$socket.on('newMessage', function (messages, from) {
    var li;

    //TODO
    //TEST IF OWN MESSAGE
    if(from != $nickname)
        li = jQuery('<li class="left"></li>');
    else
        li = jQuery('<li class="right"></li>');

    //RETRIEVE THE CORRECT LANGUAGE MESSAGE
    li.text(from+' : '+messages[$language]);

    //DISPLAY IT
    $('#messages').append(li);

});

//ON LEFT MESSAGE RECEIVED
$socket.on('leftMessage', function (messages) {
    //TODO
    //RETRIEVE THE CORRECT LANGUAGE MESSAGE
    var li = jQuery('<li class="right red"></li>');
    li.text('Admin : '+messages[$language]);

    //DISPLAY IT
    $('#messages').append(li);
});
//ON JOIN MESSAGE RECEIVED
$socket.on('joinMessage', function (messages) {
    //TODO
    //RETRIEVE THE CORRECT LANGUAGE MESSAGE
    var li = jQuery('<li class="right green"></li>');
    li.text('Admin : '+messages[$language]);

    //DISPLAY IT
    $('#messages').append(li);
});
//ON UPDATE USERS LIST MESSAGE RECEIVED
$socket.on('updateUserList', function (users) {

    var usersList = jQuery('<ul></ul>');

    //TODO
    //LOOP IN USERS LIST & DISPLAY IT
    users.forEach(function (user)
    {
        usersList.append(jQuery('<li></li>').text(user.nickname));
    });

    $('#users').replaceWith(usersList);

});

$(document).ready(function ()
{
    //TODO
    //STORE THE URL VALUES
    var url = new URL(window.location.href);
    $nickname = url.searchParams.get('nickname');
    $room = url.searchParams.get('room');
    $language = url.searchParams.get('language');

    //TODO
    //JOIN THE ROOM
    $socket.emit('join',$nickname, $room, $language);

    $('#message-form').submit(function (e) {
        e.preventDefault();
        sendMessage();
    });
});

//SEND MESSAGE METHOD
function sendMessage()
{
    //TODO
    //STORE MESSAGE VALUE
    var $message = $('input[name="message"]').val();

    if ($message.length > 0) {

        //RESET MESSAGE INPUT
        $('input[name="message"]').val('');
        //SEND MESSAGE TO SOCKET :
        //PARAMS : methodName, nickname, room, language, message
        $socket.emit('sendMessage', $nickname, $room, $language, $message);
    }
}