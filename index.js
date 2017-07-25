var express= require("express");
var app= express();

var server=app.listen(3000, ()=>{console.log("'server started at 3000'")});
var io= require("socket.io")(server);


app.get('/', (req, res)=> {
  res.sendFile(__dirname + '/index.html');
});

// empty array used to store connected users
var usernames = {};


//socket on,event emitter 
io.sockets.on('connection', function (socket) {

        //on emit of sendmessage get message as data and update the chat with 
		//username and message sent by user by emiting chat
	socket.on('sendmessage', function (data) {
	//	console.log('message received in server by '+socket.username+' as '+data);
		io.sockets.emit('chat', socket.username, data);
	});

	// when the client emits newuser with name as paramater
	// store the username in the socket 
	// add the user along with is name to userlist
	// emit chat to update the user in list along with parameters
	// tell all users that newuser joined
	// update the list of users 
	socket.on('newuser', function(username){
		
		socket.username = username;
		usernames[username] = username;
		socket.emit('chat', 'SERVER', 'you have connected');
		socket.broadcast.emit('newu',username + ' has connected');
		io.sockets.emit('updateusers', usernames);
	});

	// when the user disconnects update it
	// remove the username from usernames list
	// update list of users in chat
	// broadcast that this user has left
	socket.on('disconnect', function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('chat',socket.username + ' has disconnected reason unknown');
	});
})
