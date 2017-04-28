module.exports = function(io){
  var PlayerClass = require('./inc/Player.js');
  var QuestionClass = require('./inc/Question.js');

  var socket_ids = Array();

  var Player = new PlayerClass();
  var players = Player.getList();
  var players_history = Array();
  var Question = new QuestionClass();
  var questions = Question.getList();
  var activing = {"question_id": null,"expiryTime": null};
  var winner = [];
  var giftCounter = "10";
  var question_ID = "";
  var gameEND = false;
  // console.log(http);
  // console.log(io);

  // console.log(players);
  // console.log(questions);

  io.on('connection', function(socket){

  	var socket_id = socket.id;
  	console.log(socket.id + ': connected');

    socket.emit('get player id', "player id");

    socket.on("send player id", function(pID) {
      // console.log("sadfsdfasdfa")

      if(Player.getInfo(pID)["player_name"]){
        console.log(pID)

        socket.emit('rejoin', "Rejoin the game");
      }

    });


    socket.on("mc ends game now", function() {
      console.log("game ending");
      socket.broadcast.emit("end game");
      gameEND = true;
    });
  	// Player login authentication
  	socket.on('login', function(player_id, kick_current_user){
      if (gameEND) {
          socket.emit("end game");
        }else{
  	  var playerLogin = Player.login(player_id, socket_id, kick_current_user);
  	  if(!playerLogin.success){
  	  	// Login fail and return the error message
        //changed to show kill previous session alert
  	  	socket.emit('login fail', playerLogin.error_msg);
  	  }else{
  	  	// Login Success
  	  	// if(typeof socket_ids[socket_id] === "undefined"){

        console.log(playerLogin)
        io.to(playerLogin.prev_socket_id).emit('kicked out',playerLogin.prev_socket_id);
  		  socket_ids[socket_id] = {"socket_id":socket_id, "player_id": player_id};
  		  // };
  		  var questions_status = Question.getStatus();
  		// pass Player info, history, question status after login success
  	  	socket.emit('login success', {"player_name": playerLogin.player_info.player_name, "player_history": playerLogin.player_history, "questions_status": questions_status, "questions": Question.getList(), "bingo": Player.getInfo(player_id)["bingo"]});

      }
        }
  	});

    socket.on('check name', function(player_id){
      if(!Player.getInfo(player_id)["player_name"]){
        socket.emit('has name', false)
      }else {
        socket.emit('has name', true);
      }
    })

    socket.on('name', function(player_id, name){
      // console.log(name)
      Player.getInfo(player_id)["player_name"] = name;
    })

    socket.on('update player question status', function(player_id, q_id, status){
      if(status != undefined){
        Player.getInfo(player_id)["history"][q_id.toString()]["status"] = status
        // console.log(Player.getInfo(player_id)["history"])
      }
    })

  	// Player disconnect and unbind socket id from the player
  	socket.on('disconnect', function(){
  	  var socket_id = socket.id;
  	  // console.log(socket_ids);
  	 //  if(typeof socket_ids[socket_id] !== "undefined"){
  		// var player_id = socket_ids[socket_id]['player_id'];
  		// Player.unbindSocket(player_id);
  	 //  }
  	  console.log(socket_id + ': disconnected');
      // socket.emit('disconnected end question');
      // socket.socket.reconnect();

  	});

  	// Player Submit the answer
  	socket.on('update answer', function(question_id, value){
  	  var socket_id = socket.id,
          result = false;
  	    if(typeof socket_ids[socket_id] !== "undefined"){
  	  	  var questions_status = Question.getStatus();
  			//Check question status is active
  	  		if(questions_status[question_id]["status"] == 1){
  				// console.log(socket_ids);
  				var player_id = socket_ids[socket_id]['player_id'];
          if ( value == Question.questions[question_id]["correct_answer"]) {
            result = true;
          };

  				Player.updateAnswer(player_id, question_id, result);
          // console.log(Player.getHistory(player_id))
          io.emit("check bingo board", Player.getHistory(player_id), player_id)
  				// console.log(Player.getHistory(player_id));
  			}else{
  				// console.log("Cannot submit answer, expiried");
  			}
  	    }
  	});

  	// Host get info
  	socket.on('host getlist', function(){
  	  socket.emit('host getlist', {"questions":questions,"qstatus":Question.getStatus()});
      socket.emit('giftCounter update', giftCounter);
      // var winnerArray = [{1:"asd"},{5:"asda"},{6:"fasfsda"},{4:"asfd"}];
      // socket.emit("send winner array", winnerArray);
  	});

    socket.on('giftCounter change', function(data){
      giftCounter = data;
    })



    socket.on('requesting validation for question', function(){
      var array = [];
      // var permission = false;
      for (var x in Question.questions) {
        // console.log(Question.questions[""+x]["status"])
        array.push(Question.questions[""+x]["status"])
        // console.log(array);
      }
      // console.log(array);
      // console.log(!array.includes(1));
      if (!array.includes(1)){
        permission = true;
        // console.log("this is active: "+permission);
      } else {
        permission = false;
        // console.log("this is not active: "+permission);
      }
      // console.log(permission);
      socket.emit('status validator data', permission, array);
    })
        // console.log(Question.questions["1"]["status"]);
  	// Host request to active a question
  	socket.on('question active request', function(question_id){
      question_ID = question_id;
  		if(activing.question_id == null){
  		  activing = Question.activeQuestion(question_id);
  		  // var expTime = activing.expiryTime.getTime();
        // console.log(expTime);
  		  socket.emit('active question', question_id);
  		  io.emit('question status updated', Question.questions[question_id], question_id);
  		}
  	});
    socket.on('end question', function(){
          // console.log("Finish Question: " + question_ID);
          Question.finishQuestion(question_ID);
          activing = {"question_id": null,"expiryTime": null};
          io.emit('question status updated', Question.questions[question_ID], question_ID);
        });

    //Players alert host when win  Bingo
    socket.on("player wins bingo", function(player_id){
      //Set the maximum limit for the game
      // io.emit("end game");
      // console.log(player_id)
      var name = Player.getInfo(player_id)["player_name"],
          object = {},
          player_has_won = false;
      // if (winner.length <= 2) {
         for(var i = 0; i < winner.length; i++){
          console.log(winner);
          for(var key in winner[i]){
            if(player_id == key){
              player_has_won = true;
              console.log(key)
            }
          }
        }
        console.log(player_has_won);
        if(!player_has_won && name != undefined && name != null){
          object[player_id] = name;
          winner.push(object);
          socket.broadcast.emit("send winner array", winner)
          console.log(winner);
          Player.getInfo(player_id)["bingo"] = true;
          // winner.length == 2 ? io.emit("end game") : null;
          // socket.emit("send winner array", winner)
        }
      // }
      //  else {
      //   io.emit("end game");
      // }
    })


    socket.on("end server", function(){
      socket_ids = Array();
      Player = new PlayerClass();
      players = Player.getList();
      players_history = Array();
      Question = new QuestionClass();
      questions = Question.getList();
      activing = {"question_id": null,"expiryTime": null};
      winner = [];
      giftCounter = "10";
      question_ID = "";
      gameEND = false;
      console.log("restart")
    })

    socket.on("mc ends", function(){
      io.emit("end game");
    })
  });
}
