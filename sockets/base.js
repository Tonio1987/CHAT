module.exports = function (io) { 
	var uuid = require('node-uuid');
	var listUsers = [];
	var id = 

	io.on('connection', function(socket){
		socket.on('chat_message', function(msg){
			console.log(socket.pseudo + ' me parle ! Il me dit : ' + msg);
			var ret = socket.pseudo+' : '+msg;
			socket.broadcast.emit('chat_message', ret);
		});

		socket.on('new_user', function(pseudo) {
			socket.user = createObjectUser(pseudo);
			listUsers.push(socket.user);
			socket.broadcast.emit('chat_message', 'Nouvel utilisateur connecte : '+socket.user.pseudo);
			socket.broadcast.emit('list_users', listUsers);
			socket.emit('list_users', listUsers);
			console.log('Nouvel utilisateur : '+socket.user.pseudo);
		});

		
		socket.on('disconnect', function(){
			console.log('user disconnected');
			removeItem(listUsers, socket.user);
			// var index = listUsers.indexOf(socket.pseudo);
			// listUsers.splice(index, 1);

			socket.broadcast.emit('chat_message', 'Utilisateur '+socket.user.pseudo+' deconnecte');
		});

		function createObjectUser(pseudo){
			var user = {id: uuid.v4(),
			pseudo: pseudo};
			return user;
		}

		function removeItem(array, item){
			console.log(array);
			console.log(item);
    			for (var i = array.length - 1; i >= 0; i--)
			        if (array[i].id === item.id) {
			            array.splice(i, 1);
			            break; // remove this line if there could be multiple matching elements
		        }
		}
	});
}
