var socket_handler = function (io) { 
	var uuid = require('node-uuid');
	var listUsers = [];

	io.sockets.on('connection', function(socket){
		
		socket.on('new_user', function(pseudo) {
			createObjectUser(pseudo);

			socket.broadcast.emit('chat_message', 'SERVER', 'Nouvel utilisateur connecte : '+socket.user.pseudo);
			socket.broadcast.emit('list_users', listUsers);
			socket.emit('list_users', listUsers);

			console.log('### - Nouvel utilisateur : '+socket.user.pseudo+' [ OK ]');
		});

		socket.on('chat_message', function(pseudo, msg){
			if(socket.user != undefined && socket.user != null){
				console.log('### - '+socket.user.pseudo+ ' : ' + msg + " [ OK ]");
				socket.broadcast.emit('chat_message', socket.user.pseudo, msg);
			}else{
				createObjectUser(pseudo);
				socket.broadcast.emit('chat_message', 'SERVER', 'Nouvel utilisateur connecte : '+socket.user.pseudo);
				socket.broadcast.emit('list_users', listUsers);
				socket.emit('list_users', listUsers);
				console.log('### - '+socket.user.pseudo + ' : ' + msg + " [ OK ]");
				socket.broadcast.emit('chat_message', socket.user.pseudo, msg);
		
			}
		});
		
		socket.on('code_message', function(pseudo, code){
			if(socket.user != undefined && socket.user != null){
				console.log('### - User '+socket.user.pseudo+' sendong code [ OK ]');
				socket.broadcast.emit('code_message', socket.user.pseudo, code);
			}else{
				createObjectUser(pseudo);
				socket.broadcast.emit('chat_message', 'SERVER', 'Nouvel utilisateur connecte : '+socket.user.pseudo);
				socket.broadcast.emit('list_users', listUsers);
				socket.emit('list_users', listUsers);
				console.log('### - User '+socket.user.pseudo+' sendong code [ OK ]');
				socket.broadcast.emit('code_message', socket.user.pseudo, code);
			}
		});

		
		socket.on('error', function(obj){
			console.log('error detected');
			console.log("error : "+obj);
		});

		
		socket.on('user_disconnect', function(pseudo){
			if(socket.user != undefined && socket.user != null){
				removeUser(listUsers, socket.user);
				socket.broadcast.emit('list_users', listUsers);
				socket.broadcast.emit('chat_message', 'SERVER', 'Utilisateur '+socket.user.pseudo+' deconnecte');
				console.log('### - Socket user disconnected : '+socket.user.pseudo+' [ OK ]');
			}else{
				console.log("### Old session trying to disconnect ... [ ABORT ]");
			}
		});


		// Create user
		function createObjectUser(pseudo){
			var user = {id: uuid.v4(),
			pseudo: pseudo};
			socket.user = user;
			listUsers.push(socket.user);
		}
		
		// Remove user
		function removeUser(array, item){
			for (var i = array.length - 1; i >= 0; i--)
			        if (array[i].id === item.id) {
			            array.splice(i, 1);
		        	    break; // remove this line if there could be multiple matching elements
		       	}
		}

	});
}

module.exports = socket_handler;
