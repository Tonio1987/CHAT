module.exports = function (io) { 

	var listUsers = [];

	io.on('connection', function(socket){
		socket.on('chat_message', function(msg){
			console.log(socket.pseudo + ' me parle ! Il me dit : ' + msg);
			var ret = socket.pseudo+' : '+msg;
			socket.broadcast.emit('chat_message', ret);
		});

		socket.on('new_user', function(pseudo) {
			socket.pseudo = pseudo;
			listUsers.push(pseudo);
			socket.broadcast.emit('chat_message', 'Nouvel utilisateur connecte : '+socket.pseudo);
			socket.broadcast.emit('list_users', listUsers);
			socket.emit('list_users', listUsers);
			console.log('Nouvel utilisateur : '+socket.pseudo);
		});

		
		socket.on('disconnect', function(){
			console.log('user disconnected');
			var index = listUsers.indexOf(socket.pseudo);
			listUsers.splice(index, 1);
			socket.broadcast.emit('chat_message', 'Utilisateur '+socket.pseudo+' deconnecte');
		});
	
	});


}
