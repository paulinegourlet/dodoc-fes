jQuery(document).ready(function($) {

	var serverBaseUrl = document.domain;
	var domainUrl = window.location.href;
	var host = window.location.host;
	var socket = io.connect();
	var sessionId = '';
	var time;
	console.log(host);
	/**
	* Events
	*/
	/* sockets */
	socket.on('connect', onSocketConnect);
	socket.on('error', onSocketError);
	socket.on('listMedias', ondisplayMedias);
	socket.on('displayNewImage', displayNewImage);
	socket.on('displayNewStopMotion', displayNewStopMotion);
	socket.on('displayNewVideo', displayNewVideo);
	socket.on('displayNewAudio', displayNewAudio);


	//socket.emit('newUserSelect', {id: socket.io.engine.id, name: app.session});
	//ondisplayMedias();

	/**
	* handlers
	*/
	/* sockets */


	function onSocketConnect() {
		sessionId = socket.io.engine.id;
		console.log('Connected ' + sessionId);
		socket.emit('newUserSelect', {id: sessionId, name: app.session});
	};
	function onSocketError(reason) {
		console.log('Unable to connect to server', reason);
	};

	function ondisplayMedias(array, json){
		for (var i = 0; i < array.length; i++) {    	
    	var extension = array[i].split('.').pop();
    	var identifiant =  array[i].replace("." + extension, "");
    	timestampToDate(parseFloat(identifiant));
			if(extension == "jpg"){
				$('.container-flux .content ul').prepend("<li class='images-bibli' id='"+ identifiant+"'' ><img src='https://"+host+"/" + app.session + "/" + array[i] + "'><h3 class='mediaTitre'>" +time+ "</h3></li>");
			}
			if(extension == "mp4" || extension == "webm"){
				$('.container-flux .content ul').prepend("<li class='videos-bibli' id='"+ identifiant+"'' ><video src='https://"+host+"/" + app.session + "/" + array[i] + "' controls preload='none'><h3 class='mediaTitre'>" +time+ "</h3></li>");
			}
			if(extension == "wav"){
				$('.container-flux .content ul').prepend("<li class='sons-bibli' id='"+ identifiant+"'' ><audio src='https://"+host+"/" + app.session + "/" + array[i] + "' controls preload='none'><h3 class='mediaTitre'>" +time+ "</h3></li>");
			}
		}
	}
	// function ondisplayMedias(){
	// 	$.getJSON("https://"+host+"/" + app.session + "/" + app.session + ".json", function( json ) {
	// 	  $.each( json["files"], function( i, item ) {
	// 	  	// timestampToDate(parseFloat(item.name));
	// 	  	console.log(item);
	// 	  	// $('.container-flux .content ul').prepend("<li class='images-bibli' id='"+ item.name+"'' ><img src='https://"+host+"/" + app.session + "/" + item.name + ".jpg'><h3 class='mediaTitre'>" +time+ "</h3></li>");
 //      });
 //     //  $.each( json["files"]["videos"], function( i, item ) {
	// 	  	// timestampToDate(parseFloat(item.name));
	// 	  	// $('.container-flux .content ul').prepend("<li class='videos-bibli' id='"+ item.name+"'' ><video src='https://"+host+"/" + app.session + "/" + item.name + ".webm' controls preload='none'></video><h3 class='mediaTitre'>" +time+ "</h3></li>");
 //     //  });
	// 	});
	// }

	function displayNewImage(req){
		var identifiant = req.name;
		timestampToDate(identifiant);
		if(req.extension == "jpg"){
			$('.container-flux .content ul').prepend("<li class='images-bibli' id='"+ req.title+"'' ><img src='https://"+host+"/" + app.session + "/" + req.file + "'><h3 class='mediaTitre'>" +time+ "</h3></li>");
		}
	}

	function displayNewStopMotion(req){
		var identifiant = req.name;
		timestampToDate(identifiant);
		if(req.extension == "mp4"){
			$('.container-flux .content ul').prepend("<li class='motion-bibli' id='"+ req.title+"'' ><video src='https://"+host+"/" + app.session + "/" + req.file + "' controls preload='none'><h3 class='mediaTitre'>" +time+ "</h3></li>");
		}
	}

	function displayNewVideo(req){
		var identifiant = req.name;
		timestampToDate(identifiant);
		if(req.extension == "webm"){
			$('.container-flux .content ul').prepend("<li class='video-bibli' id='"+ req.title+"'' ><video src='https://"+host+"/" + app.session + "/" + req.file + "' controls preload='none'><h3 class='mediaTitre'>" +time+ "</h3></li>");
		}
	}

	function displayNewAudio(req){
		var identifiant = req.name;
		timestampToDate(identifiant);
		if(req.extension == "wav"){
			$('.container-flux .content ul').prepend("<li class='audio-bibli' id='"+ req.title+"'' ><audio src='https://"+host+"/" + app.session + "/" + req.file + "' controls preload='none'><h3 class='mediaTitre'>" +time+ "</h3></li>");
		}
	}


	function timestampToDate(timestamp){
    var date = new Date(timestamp);
		// hours part from the timestamp
		var hours = date.getHours();
		// minutes part from the timestamp
		var minutes = "0" + date.getMinutes();
		// seconds part from the timestamp
		var seconds = "0" + date.getSeconds();

		// will display time in 10:30:23 format
		time = hours + 'h' + minutes.substr(minutes.length-2);
		//console.log(time);
	}
});