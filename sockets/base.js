module.exports = function (io) { 
	// io stuff here... io.on('conection..... 

	io.on('connection', function(socket){
		socket.on('chat message', function(msg){
			console.log(socket.pseudo + ' me parle ! Il me dit : ' + msg);
			var ret = socket.pseudo+' : '+msg;
			socket.broadcast.emit('chat message', ret);
		});

		socket.on('petit_nouveau', function(pseudo) {
			socket.pseudo = pseudo;
			socket.broadcast.emit('chat message', 'Nouvel utilisateur connecte : '+socket.pseudo);
			console.log('Nouvel utilisateur : '+socket.pseudo);
		});

	/*	
		socket.on('disconnect', function(){
			console.log('user disconnected');
			socket.broadcast.emit('chat message', 'Utilisateur '+socket.pseudo+' deconnecte');
		});
	*/
	});


}
