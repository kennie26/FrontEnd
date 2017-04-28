$(function () {
  var socket = io();

  var player_id = getParameterByName('t');
  var token = getParameterByName('tokenplayer');
  var bingo = false;
  var player_name;
  $('#p').val(player_id);

  if(player_id != ""){
    // Submit the login by GET Parameter
    socket.emit('check name', player_id)
  }


  socket.on("get player id", function(data) {
    console.log(data);
    socket.emit("send player id", player_id);
  });

  socket.on("has name", function(has_name){
    if(!has_name){
      $("#naming .small-btn").click(function(){
        var name = $("#naming input").val();
        if(name != "" && name != null) {
          socket.emit('name', player_id, name);
          socket.emit('login', player_id);
          $("#naming").fadeOut().addClass("hidden");
          $("#start").fadeIn().removeClass("hidden");
        }
      })
    } else {
      socket.emit('login', player_id);
      $("#naming").addClass("hidden");
      $("#start").removeClass("hidden");
    }
  })

  // Show error when login fail
  //changed to alert page
  socket.on('login fail', function(msg){
    // console.log('fail')
    // console.log("login fail: " + msg);
    // alert("login fail " + msg);
    // $('#notification').html('').append('<span>'+msg+'</span>');
    // $('#login').fadeIn();
    // $(".start").fadeOut().addClass("hidden");
      $('#notification').fadeIn().removeClass("hidden").css("display","flex");
      $("#notification .small-btn.confirm").click(function(){
        socket.emit('login', player_id, true);
      })
      $("#notification .small-btn.reject").click(function(){
          $('#notification').fadeOut().addClass("hidden");
      })
  });

  socket.on('rejoin', function(msg){
    // console.log('fail')
    // console.log("login fail: " + msg);
    alert("Welcome to the game, you are connecting to the Bingo now OR you have temporarily lost connection in which case, please REFRESH** page");
    // $('#notification').html('').append('<span>'+msg+'</span>');
    // $('#login').fadeIn();
    // $(".start").fadeOut().addClass("hidden");
      // $('#header').fadeIn().removeClass("hidden");
      // $('#notification').fadeIn().removeClass("hidden").css("display","flex");
      // $("#notification .small-btn.confirm").click(function(){
      //   socket.emit('login', player_id, true);
      // })
      // $("#notification .small-btn.reject").click(function(){
      //     $('#notification').fadeOut().addClass("hidden");
      //     $('#header').fadeIn().addClass("hidden");
      // })
  });



  socket.on('kicked out', function(msg){
    // console.log("login fail: " + msg);
    // $('#notification').html('').append('<span>'+msg+'</span>');
    // $('#login').fadeIn();
    // $(".start").fadeOut().addClass("hidden");
      $("header").fadeIn().removeClass("hidden")
      $('#notification').fadeIn().removeClass("hidden").css("display","flex");
      $("#notification .small-btn.confirm").css("display","none");
      $("#notification .small-btn.reject").css("display","none");
      $('#notification').find("div p").text("You have been kicked out.")
  });

  // $('form').submit(function(){
  //   // Submit the login by FORM
  //   socket.emit('login', $('#p').val(), $('#t').val());
  //   return false;
  // });

  // Login success, show the player history.
  socket.on('login success', function(data){
    // var player_history = Object.values(data.player_history);
    $('#notification').fadeOut().addClass("hidden");
    var player_history = [];
    for (var key in data.player_history) {
        player_history.push(data.player_history[key])
    }
    $(".background2").fadeIn().removeClass("hidden");
    if(data.player_name) {
      $(".start.border").click(function(e){
        e.preventDefault();
        player_name = data.player_name
        $(".player-name").text(data.player_name);
        console.log(data.player_history);
        console.log(data.questions_status);

        // TODO: gen board order by position
        $("header").fadeOut().addClass("hidden");
        $("#play").fadeIn().removeClass("hidden");
        $(".background3").removeClass("hidden");
        //generate board order by position
        for (var i = 0; i< player_history.length; i++) {
          // debugger
          $(".question-box:nth-child(" + player_history[i]["position"] + ")").attr("data-qid", i+1).children().text(i+1).attr("status", player_history[i].status)
          if(data.status == 1){
            $("li[data-qid='" + (parseInt(i)+1) + "']").addClass("circle")
          }
          if (player_history[i]["answer"] == true){
            $(".question-box[data-qid='" + parseInt(i+1) + "']").attr("bingo", true);
          }
        }
        if (data["bingo"]){
          bingo = true;
          $(".message img").attr("src","../img/user/bingo.png");
          $(".message p").text('Call out "Bingo" now!');
        }
        for (var key in data["questions_status"]){
          // debugger
          if(data["questions_status"][key]["status"] == 1){
            $(".question").addClass("playing").find(".question-box[data-qid='" + key + "']").addClass("circle");
            $(".answer").attr("data-qid", key)
            printQuestionOptions(data["questions"][key]["answers"]);
          }
        }
        // player_history.map( function(data, id){
        //   $(".question-box:nth-child(" + data["position"] + ")").attr("data-qid", id+1).children().text(id+1).attr("status", data.status)
        //   if(data.status == 1){
        //     console.log($("li[data-qid='" + parseInt(id)+1 + "']"))
        //     $("li[data-qid='" + (parseInt(id)+1) + "']").addClass("circle")
        //   }
        //   if (data["answer"] == true){
        //     $(".question-box[data-qid='" + parseInt(id+1) + "']").attr("bingo", true);
        //   }
        // })
      })
    }
  });

  // A question started or finished
  socket.on('question status updated', function(data, id){
    var options = data.answers,
        options_values = [],
        options_keys;

          $('.question-box[data-qid="'+ id +'"] > .status').attr("status", data.status);
          $(".answer").attr("data-qid", id)
          // console.log(data);
          //if a question is being activated
          if (data.status == "1" && !bingo){
            socket.emit("update player question status", player_id, id, 1)
            //reset options
            $(".options").html("");
            $(".question").addClass("playing").find(".question-box[data-qid='" + id + "']").addClass("circle");
            printQuestionOptions(options)
            $(".message img").attr("src", "../img/user/start2.png");
            $(".message p").text("Win this challenge for " + player_name + " by completing a row, column, or diagonal.")
            // for (var key in options) {
            //   options_values.push(options[key])
            // }
            // for(var i = 0; i < options_values.length; i++){
            //   var str = "<div><input type='radio' name='answer' id='answer_" + options_values[i] + "' value='" + options_values[i] + "'/><label for='answer_" + options_values[i] + "' class='flex-align-center'><img src='../img/2x" + options_values[i] + ".png'</label></div>"
            //   $(".options").append(str);
            // }
            // // options_values.map(function(value, id){
            // //   var str = "<div><input type='radio' name='answer' id='answer_" + value + "' value='" + value + "'/><label for='answer_" + value + "' class='flex-align-center'><img src='../img/2x" + value + ".png'</label></div>"
            // //   $(".options").append(str);
            // // });
            // $(".answer").fadeIn().removeClass("hidden");
            //if a question is finished
          } else if ( data.status == "2"){
            socket.emit("update player question status", player_id, id, 2)
            //hide the buttons
            $(".question").removeClass("playing").find(".question-box[data-qid='" + id + "']").removeClass("circle");
            var player_answer = $("input:checked").val();
            $(".answer").fadeOut().addClass("hidden").find(".options").html("");
            $(".answer").attr("data-qid", "");
            //Circle the question no. if players answer it right
              if ( player_answer == data.correct_answer){
                $(".question-box[data-qid='" + id + "']").attr("bingo", true);
                if (!bingo){
                  $(".message img").attr("src","../img/user/correct.png");
                  $(".message p").text("The number matches!");
                }
              }else{
                if(!bingo){
                  $(".message img").attr("src","../img/user/wrong.png");
                  $(".message p").text("Looks like your table just missed a shot.");
                }
              }
            }
  });

  //Check players' bingo board
  socket.on("check bingo board", function(data, id){
    if(id == player_id){
      var player_history = [],
          board = new Array;
      for (var key in data) {
        var item = {}
        item[data[key]["position"]] = data[key]["answer"];
        board.push(item);
      }

      //get player's board order and answers
      // player_history.map(function(data, id){
      //   var item = {}
      //   item[data["position"]] = data["answer"];
      //   board.push(item);
      // })
      //sort the order by position
      board.sort(function(a, b){
        return Object.keys(a)[0] - Object.keys(b)[0]
      })
      // //convert object to series
      // player_history = [];
      for(var key in board ){
        player_history.push(board[key][parseInt(key)+1])
      }
      // console.log(board)
      // board.map(function(data, id){
      //   player_history.push(Object.values(data)[0])
      // })
      //check tic tac toe
      // console.log("player his: "+ calculateWinner(player_history))

      if (calculateWinner(player_history)){
        $(".message img").attr("src","../img/user/bingo.png");
        $(".message p").text('Call out "Bingo" now!');
        socket.emit("player wins bingo", player_id)
        bingo = true;
      }
    }
  })

  //When the game ends
  socket.on("end game", function(){

    // alert("game end")
    $(".end").text("Enjoy the prize and let's get crazy tonight!");
    $(".start").hide().addClass("hidden");
    $("#play").fadeOut().addClass("hidden");
    $("header").fadeIn().removeClass("hidden").css("display","flex");
  })

  // Submit a answer
  $('.submit').on("click", function(){
    if(!$(this).parents(".answer").hasClass("hidden")){
      if ($("input:checked").length > 0){
        var value = $("input:checked").val();
        var question_id = $(".answer").attr("data-qid");
        socket.emit('update answer', question_id, value);
      }
      $(".answer").fadeOut().addClass("hidden");
    }
  });
});

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] == true && squares[a] === squares[b] && squares[a] === squares[c]) {
      return true;
    }
  }
  return null;
}

function printQuestionOptions(data){
  var options_values = [];
  for (var key in data) {
      options_values.push(data[key])
  }
  for(var i = 0; i < options_values.length; i++){
    var str = "<div><input type='radio' name='answer' id='answer_" + options_values[i] + "' value='" + options_values[i] + "'/><label for='answer_" + options_values[i] + "' class='flex-align-center'><img src='../img/2x" + options_values[i] + ".png'</label></div>"
    $(".options").append(str);
  }
  $(".answer").fadeIn().removeClass("hidden");
}
