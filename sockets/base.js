module.exports = function (io) { 
	var uuid = require('node-uuid');
	var listUsers = [];

	io.sockets.on('connection', function(socket){
		
		socket.on('new_user', function(pseudo) {
			socket.user = createObjectUser(pseudo);
			listUsers.push(socket.user);

			socket.broadcast.emit('chat_message', 'Nouvel utilisateur connecte : '+socket.user.pseudo);
			socket.broadcast.emit('list_users', listUsers);
			socket.emit('list_users', listUsers);

			console.log('### - Nouvel utilisateur : '+socket.user.pseudo);
		});

		socket.on('chat_message', function(pseudo, msg){
			console.log('### - '+socket.user.pseudo + ' : ' + msg);
			socket.broadcast.emit('chat_message', socket.user.pseudo, msg);
		});
		
		socket.on('code_message', function(pseudo, code){
			console.log('### - User '+socket.user.pseudo+' sendong code');
			socket.broadcast.emit('code_message', socket.user.pseudo, code);
		});

		
		socket.on('error', function(obj){
			console.log('error detected');
			console.log("error : "+obj);
		});

		
		socket.on('disconnect', function(){
			removeItem(listUsers, socket.user);
			socket.broadcast.emit('list_users', listUsers);
			socket.broadcast.emit('chat_message', 'Utilisateur '+socket.user.pseudo+' deconnecte');
			console.log("### - Socket user disconnected: "+socket.user.pseudo);
		});


		// Add user
		function createObjectUser(pseudo){
			var user = {id: uuid.v4(),
			pseudo: pseudo};
			return user;
		}
		
		// Remove user
		function removeItem(array, item){
			for (var i = array.length - 1; i >= 0; i--)
			        if (array[i].id === item.id) {
			            array.splice(i, 1);
		        	    break; // remove this line if there could be multiple matching elements
		       	}
		}
	});
}
