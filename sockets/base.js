module.exports = function (io) { 
	// io stuff here... io.on('conection..... 

	io.on('connection', function(socket){
		socket.on('chat message', function(msg){
			 
			// io.get('pseudo', function (error, pseudo) {
			// });
			console.log(socket.pseudo + ' me parle ! Il me dit : ' + msg);
			socket.broadcast.emit('chat message', socket.pseudo+" : "+msg);
	
		});

		socket.on('disconnect', function(){
			console.log('user disconnected');
			socket.broadcast.emit('chat message', 'Utilisateur '+socket.pseudo+' deconnecte');
		});

		socket.on('petit_nouveau', function(pseudo) {
			socket.pseudo = pseudo;
			socket.broadcast.emit('chat message', 'Nouvel utilisateur connecte : '+socket.pseudo);
			console.log('Nouvel utilisateur : '+socket.pseudo);
		});
	});
}
