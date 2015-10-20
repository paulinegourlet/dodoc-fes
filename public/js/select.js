jQuery(document).ready(function($) {

	var serverBaseUrl = document.domain;
	var domainUrl = window.location.host;
	var socket = io.connect();
	var sessionId = '';
	var time;
	var projet = app.projet;
	/**
	* Event
	*/
	initEvents();

	function initEvents(){
		addMedia();
		$(".montage-title input").focus();
		
		$(document).on('click',function(event){
			if($(event.target).parent().attr("class") == 'remove-media'){
				removeMedia($(event.target).parent());
			}
			if($(event.target).parent().attr("class") == 'montage-title'){
				//$(event.target).change(changeTitle);
				$(event.target).keypress(changeTitle);
				//changeTitle($(event.target).val());
			}
		});

		$(".montage .publish").on("click", sendPublication);
		addTextMontage();	
	}

	/* sockets */
	socket.on('connect', onSocketConnect);
	socket.on('error', onSocketError);
	socket.on('listMedias', ondisplayMedias);
	socket.on('displayNewImage', displayNewImage);
	socket.on('displayNewStopMotion', displayNewStopMotion);
	socket.on('displayNewVideo', displayNewVideo);
	socket.on('displayNewAudio', displayNewAudio);
	socket.on('displayMontage', displayMontage);

	/**
	* handlers
	*/
	/* sockets */

	function onSocketConnect() {
		sessionId = socket.io.engine.id;
		console.log('Connected ' + sessionId);
		socket.emit('newUserSelect', {id: sessionId, name: app.session, projet:projet});
	};

	function onSocketError(reason) {
		console.log('Unable to connect to server', reason);
	};

	function addMedia(){
		$(".button-add-media").on("click", function(){;
			var newContentToAdd = "<h3 class='popoverTitle'>Ajouter un média externe</h3><div class='choix-media'><div class='choix-texte'>TEXTE</div><div class='choix-local'>FICHIER LOCAL</div><div class='choix-url'>URL</div></div>";
			var closeAddProjectFunction = function() {
			};
			fillPopOver(newContentToAdd, $(this), 500, 200, closeAddProjectFunction);
			$(".choix-texte").on("click", function(){
				var newContentToAdd = "<h3 class='popoverTitle'>Ajouter un média externe</h3><div class='choix-media'><div class='choix-texte'>TEXTE</div><div class='choix-local'>FICHIER LOCAL</div><div class='choix-url'>URL</div></div><div class='add-text'><input class='add-text-titre' placeholder='Écris ton titre ici'></input><textarea class='add-text-content' placeholder='Écris ton texte ici'></textarea><input type='submit' class='submit-text'></input></div>";
				var closeAddProjectFunction = function() {
				};
				closePopover(closeAddProjectFunction);
				fillPopOver(newContentToAdd, $(this), 500, 500, closeAddProjectFunction);
				submitNewMedia($('input.submit-text'), 'newTextMedia', closeAddProjectFunction);
			});	
		});

	}

	function submitNewMedia($button, send, closeAddProjectFunction, oldSession){
		$button.on('click', function(){
			var newTitreMedia = $('input.add-text-titre').val();
			var newTextMedia = $('input.add-text-content').val();

			socket.emit(send, {session:app.session, projet:app.projet, titreText: newTitreMedia, textMedia: newTextMedia});

			closePopover(closeAddProjectFunction);
		})
	}

	function ondisplayMedias(array, json){
		$(".mediaContainer li").remove();
		var matchID = $(".mediaContainer .media").attr("id");
		for (var i = 0; i < array.length; i++) {
    	var extension = array[i].split('.').pop();
    	var identifiant =  array[i].replace("." + extension, "");
			if(extension == "jpg"){
				$('.mediaContainer').append("<li class='media images-bibli' id='"+ identifiant+"'><div class='mediaContent'><img src='https://"+domainUrl + "/" +app.session + "/"+ app.projet+"/"+array[i] + "' preload='none'></div></li>");
			}
			if(extension == "webm"){
				$('.mediaContainer').append("<li class='media videos-bibli' id='"+ identifiant+"'><div class='mediaContent'><video preload='none' controls poster='https://"+domainUrl + "/"+app.session + "/"+ app.projet+ "/"+identifiant +"-thumb.png'><source src='https://"+domainUrl + "/"+app.session +"/"+ app.projet+ "/" + array[i] + "'></video></div></li>");
			}
			if(extension == "mp4"){
				$('.mediaContainer').append("<li class='media stopmotion-bibli' id='"+ identifiant+"'><div class='mediaContent'><video preload='none' controls poster='https://"+domainUrl + "/"+app.session +"/"+ app.projet+ "/"+identifiant +"-thumb.png'><source src='https://"+domainUrl + "/"+app.session +"/"+ app.projet+ "/" + array[i] + "'></video></div></li>");
			}
			if(extension == "wav"){
				$('.mediaContainer').append("<li class='media sons-bibli' id='"+ identifiant+"'><div class='mediaContent'><audio src='https://"+domainUrl + "/"+app.session +"/"+ app.projet+ "/" + array[i] + "' preload='none' controls></div></li>");
			}
		}

		$.each(json["files"]["images"], function(i, val) {
			timestampToDate(val['name']);
			$("#" + val['name']).append("<h3 class='mediaTitre'>" +time+ "</h3>");
		});
		$.each(json["files"]["stopmotion"], function(i, val) {
			timestampToDate(val['name']);
			$("#" + val['name']).append("<h3 class='mediaTitre'>" +time + "</h3>");
		});
		$.each(json["files"]["videos"], function(i, val) {
			timestampToDate(val['name']);
			$("#" + val['name']).append("<h3 class='mediaTitre'>" +time + "</h3>");
		});
		$.each(json["files"]["audio"], function(i, val) {
			timestampToDate(val['name']);
			$("#" + val['name']).append("<h3 class='mediaTitre'>" +time+ "</h3>");
		});

		$(".media").on("mouseenter", function(){
			$(this).css("cursor", 'pointer');
		});

		$.each(json["files"]["images"], function(i, val) {
			if(val["titre"]){
				$("#" + val['name']).attr("data-image-titre", val['titre']);
			}
			if(val["description"]){
				$("#" + val['name']).attr("data-image-caption", val['description']);
			}
		});

		dragMedia();
		metaData();
	}

	function metaData(){
		$(".media").on("click", function(){
			var $this = $(this);
			var idImage = $this.attr("id");
			var imgURL = $(this).find("img").attr("src");
			var imageTitre = $(this).attr("data-image-titre");
			var imageDesc = $(this).attr("data-image-caption");
			var newContentToAdd = '<img src ="'+imgURL+'" alt="media"><input class="image-text" placeholder="Titre de l\'image"><input class="image-caption" placeholder="Légende de l\'image"><button class="saveCaption">Enregistrer</button>';
			var closeAddProjectFunction = function() {
			};
			fillPopOver(newContentToAdd, $(this), 700, 700, closeAddProjectFunction);
			$("input.image-text").val(imageTitre);
			$(".image-caption").val(imageDesc);
			$(".popoverContainer .saveCaption").on("click", function(){
				var titleImage = $(this).parent().children(".image-text").val();
				var descriptionImage = $(this).parent().children(".image-caption").val();
				$this.attr("data-image-titre", titleImage).attr("data-image-caption", descriptionImage);
				socket.emit("sendMetaData", {imageTitre : titleImage, imagedescription: descriptionImage, imageId:idImage, session:app.session, projet:app.projet});
				closePopover(closeAddProjectFunction);
			});
		})
	}

	function displayNewImage(images){
		timestampToDate(images.title);
	   $('.mediaContainer').append("<li class='media images-bibli' id='"+ images.title+"'><div class='mediaContent'><img src='https://"+domainUrl + "/" +app.session +"/"+ app.projet+ "/"+ images.file + "' preload='none'></div><h3 class='mediaTitre'>" +time+ "</h3></li>");
	}

	function displayNewStopMotion(stopmotion){
		timestampToDate(stopmotion.title);
	  $('.mediaContainer').append("<li class='media stopmotion-bibli' id='"+ stopmotion.title+"'><div class='mediaContent'><video controls preload='none' poster='https://"+domainUrl + "/"+app.session +"/"+ app.projet+ "/"+stopmotion.title +"-thumb.png'><source src='https://"+domainUrl + "/"+app.session +"/"+ app.projet+ "/" + stopmotion.file + "' type='video/webm'></video></div><h3 class='mediaTitre'>" +time+ "</h3></li>");
	}

	function displayNewVideo(videos){
		timestampToDate(videos.title);
	  $('.mediaContainer').append("<li class='media videos-bibli' id='"+ videos.title+"'><div class='mediaContent'><video controls preload='none' poster='https://"+domainUrl + "/"+app.session +"/"+ app.projet+ "/"+videos.title +"-thumb.png'><source src='https://"+domainUrl + "/"+app.session +"/"+ app.projet+ "/" + videos.file + "' type='video/webm'></video></div><h3 class='mediaTitre'>" +time+ "</h3></li>");
	}

	function displayNewAudio(audio){
		timestampToDate(audio.title);
 	  $('.mediaContainer').append("<li class='media sons-bibli' id='"+ audio.title+"''><div class='mediaContent'><audio src='https://"+domainUrl + "/"+app.session +"/"+ app.projet+ "/" + audio.file + "' preload='none' controls></div><h3 class='mediaTitre'>" +time+ "</h3></li>");
	}

	function displayMontage(html){
		html.replace("ui-draggable-dragging", "").replace("ui-sortable-helper", "");
		$(".montage-medias").html(html);
		$(".montage-content .ui-state-highlight").remove();
		$(".montage-content .montage-medias li").css({"position":"", "left": "", "top":"", "z-index":""});
		// socket.on("titreMontage", function(titre){
		// 	$(".montage-content .montage-title input").val(titre);
		// });
	}

	function pepDrag(cloneMedia){
		cloneMedia.pep({
		  droppable: '.block-content.active',
		  overlapFunction: false,
		  useCSSTranslation: false,
		  start: function(ev, obj){
		  	obj.$el.css("cursor", "drag");
		    obj.noCenter = false;
		  },
		  drag: function(ev, obj){
		  	obj.$el.css("cursor", "drag");
		  },
		  stop: function(ev, obj){
		  	var $parent = obj.activeDropRegions[0];
		  	var parentWidth = $parent.width();
		  	var removeMedia = "<div class='remove-media'><img src='/images/clear.svg'></div>";
		  	obj.$el.velocity({"width": parentWidth}, 'slow');
				$parent.append(obj.el).append(removeMedia);
				$(".buffer-media").children().remove();
				$(".buffer-media").css("z-index", -1);
				//$(".container-bibli .montage").scrollTop($parent.offset().top);
		  },
		  rest: function(ev, obj){
		  	handleCentering(ev, obj);
		  	obj.$el.css({'position':'inherit', "top":"inherit", "left":"inherit", "border":"none"});
		  	$(".block-content.active").removeClass('active');
		  	$(".montage-medias").append("<div class='block-content active'></div>");
		  	var montageContent = $(".montage-content").html();
		  	socket.emit("saveMontage", montageContent, app.session);
		  	//$(".montage").scrollTop($(".block-content.active").offset().top);
		  }
		});
	}

	function dragMedia(){
		$(".mediaContainer li").draggable({
				containment: '.montage-medias',
				cursor: 'move',
				helper: 'clone',
				scroll: true,
				connectToSortable: '.montage-medias',
				appendTo: '.montage-medias',
				start: function () {},
				stop: function (event, ui) {
				}
		}).mousedown(function () {});

		$(".montage-medias").sortable({
		    sort: function () {},
		    placeholder: 'ui-state-highlight',
		    receive: function () {},
		    update: function (event, ui) {}
		});

		$(".montage-medias").droppable({
	    drop: function (event, ui) {
	    	$(ui.draggable).children("h3").remove();
	    	$(ui.draggable)
	    	.append("<div class='remove-media'><img src='/images/clear.svg'></div>");
	    	var montageContent = $(".montage-medias").html();
		  	socket.emit("saveMontage", montageContent, app.session);
	    }
		});
	}

	function handleCentering(ev, obj){
	  console.log(obj.activeDropRegions.length);
	  if ( obj.activeDropRegions.length > 0 ) {
	    centerWithin(obj);
	  }
	}

	function centerWithin(obj){
	  var $parent = obj.activeDropRegions[0];
	  var pTop    = $parent.position().top;
	  var pLeft   = $parent.position().left;
	  var pHeight = $parent.outerHeight();
	  var pWidth  = $parent.outerWidth();

	  var oTop    = obj.$el.position().top;
	  var oLeft   = obj.$el.position().left;
	  var oHeight = obj.$el.outerHeight();
	  var oWidth  = obj.$el.outerWidth();

	  var pTop = $parent.position().top;
	  var pLeft = $parent.position().left;

	  var cTop    = pTop + (pHeight/2);
	  var cLeft   = pLeft + (pWidth/2);

	  if ( !obj.noCenter ) {
	    if ( !obj.shouldUseCSSTranslation() ) {
	      var moveTop = pTop;
	      var moveLeft = pLeft;
	      obj.$el.animate({ top: moveTop, left: moveLeft }, 50);
	    } else{
	      var moveTop   = pTop;
	      var moveLeft  = pLeft;
	      obj.moveToUsingTransforms( moveTop, moveLeft );
	    }

	    obj.noCenter = true;
	    return;
	  }

	  obj.noCenter = false;
	}

	function removeMedia(obj){
		obj.parent("li").remove();
		var montageContent = $(".montage-medias").html();
		socket.emit("saveMontage", montageContent, app.session);
	}

	function changeTitle(val){
		var montageTitre = $(".montage-title input").val();
		console.log(montageTitre);
		socket.emit("titleMontage", montageTitre, app.session);
	}

	function addTextMontage(){
		$(".add-text-montage").on("click", function(){
			$(".montage-medias").prepend("<li class='text-media'><textarea placeholder='Ajouter du texte'></textarea><button class='submit-text-montage'>Valider</button></li>");
			$(".submit-text-montage").on("click", function(){
				var textMontage = $(this).parent(".text-media").find("textarea").val();
				var $parent = $(this).parent(".text-media");
				$parent.find("textarea").remove();
				$parent.find(".submit-text-montage").remove();
				$parent
				.append('<p>'+textMontage+'</p>')
				.append("<div class='remove-media'><img src='/images/clear.svg'></div>");
				var montageContent = $(".montage-medias").html();
				socket.emit("saveMontage", montageContent, app.session);
			});
		});
	}

	function sendPublication(event){
		socket.emit("sendPublication", app.session);
		//window.location.href = "https://localhost:8080/select/"+app.session+"/publi";
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
		time = hours + ':' + minutes.substr(minutes.length-2);
		//console.log(time);
	}

});