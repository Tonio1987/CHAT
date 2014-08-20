module.exports = function (io) { 
	var uuid = require('node-uuid');
	var listUsers = [];

	io.sockets.on('connection', function(socket){
		socket.on('chat_message', function(msg){
			console.log(socket.user.pseudo + ' me parle ! Il me dit : ' + msg);
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

		socket.on('error', function(obj){
			console.log('error detected');
			console.log("error : "+obj);
			// console.log("Socket user id : "+socket.user.id);
			// removeItem(listUsers, socket.user);

			// socket.broadcast.emit('chat_message', 'Utilisateur '+socket.user.pseudo+' deconnecte');
		});

		
		socket.on('disconnect', function(){
			console.log('user disconnected');
			console.log("Socket user : "+socket.user);
			// console.log("Socket user id : "+socket.user.id);
			// removeItem(listUsers, socket.user);

			// socket.broadcast.emit('chat_message', 'Utilisateur '+socket.user.pseudo+' deconnecte');
		});

		function createObjectUser(pseudo){
			var user = {id: uuid.v4(),
			pseudo: pseudo};
			return user;
		}

		function removeItem(array, item){
			console.log("Array : "+array);
			console.log("Item : "+item);
    			for (var i = array.length - 1; i >= 0; i--)
			        if (array[i].id === item.id) {
			            array.splice(i, 1);
			            break; // remove this line if there could be multiple matching elements
		        }
		}
	});
}
