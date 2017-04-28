// Global
  var questions;
  var keyboardValues = {
    32  : 'space',
    48  : 0,
    49  : 1,
    50  : 2,
    51  : 3,
    52  : 4,
    53  : 5,
    54  : 6,
    55  : 7,
    56  : 8,
    57  : 9,
    98  : 'b',
    110 : 'n',
    113 : 'q',
    97  : 'a',
    46  : 'period'
  }
  var counterWords = {
    1 : "ONE",
    2 : "TWO",
    3 : "THREE",
    4 : "FOUR",
    5 : "FIVE",
    6 : "SIX",
    7 : "SEVEN",
    8 : "EIGHT",
    9 : "NINE",
    10: "TEN"
  }
  var giftCounter;
  var showEndGame = false;

// Functions
  var MC_Actions = {


    hideLandingPage: function (e){
        var val = e.which;
      // $(document).on("keypress", function(val){
        if (val === 32){
          $(".mc_board_header").hide();
          $("#host").fadeIn().show();
        }

      // });
    },

    reEnterPage: function (){

    },

    giftCounter: function (socket, e) {
      socket.on("giftCounter update", function(data){
        giftCounter = data;
        $("#num-counter").html(counterWords[giftCounter]);
          var val = e.which;
          if (val === 113 & giftCounter < 10){
            giftCounter++
            socket.emit('giftCounter change', giftCounter);
            $("#num-counter").html(counterWords[giftCounter]);
          };
          if (val === 97 & giftCounter > 0){
            giftCounter--
            $("#num-counter").html(counterWords[giftCounter]);
            socket.emit('giftCounter change', giftCounter);
          };
      });

    },

    getQuestions: function (socket){
      socket.emit('host getlist');
      socket.on('host getlist', function(data){
        questions = data.questions;
        qstatus = data.qstatus;
        for(q in qstatus){
          temp_qs = qstatus[q]["status"];
          $('.question_mc_box[data-qid="'+q+'"] > .status').attr("status", temp_qs);
        }
      })
    },

    questionActiveReq: function (socket, e){
        socket.emit('requesting validation for question');
        socket.on('status validator data', function(data, array){
          var permission = data;
          if (permission=== true) {
            var val = e.which;
            console.log(val);
            var question_id = '';
            if (val === 49 || val === 50 || val === 51 || val === 52 || val === 53 || val === 54 || val === 55 || val === 56 || val === 57){
              question_id = keyboardValues[val];
              var question = $(".question_mc_box[data-qid='" +question_id+"']").find(".status");
              var question_status = question.attr("status");
              if(question_status == "0"){
                socket.emit('question active request', question_id);
                console.log(question_id);
                $(".question_mc_box[data-qid='" +question_id+"']").addClass('mc-circle');
              };
            };
          } else if (array.includes(1)) {
            var num = array.indexOf(1)
            var num = num + 1
            $(".question_mc_box[data-qid='" +num+"']").addClass('mc-circle');
            $("#show_mc_question").attr("src", questions[num]["question"]);
          };
          delete e.which;
          // console.log(val)
        });
    },

    questionActivated: function (socket){
      socket.on('active question', function(question_id){
        $("#show_mc_question").attr("src", questions[question_id]["question"]);
        $('.question_mc_box[data-qid="'+question_id+'"] > .status').attr("status", "1");
        $("#question_content").fadeIn();
      });
    },

    pauseBingo: function (e){
      var val = e.which;
        if (val === 98) {
          $("#show_mc_question").attr("src", "img/bingo_time.png");
        };
      // });
    },

    pauseSelectQ: function (e){
        var val = e.which;

        if (val === 110) {
          $("#show_mc_question").attr("src", "img/whats_next.png");

        };
    },

    endQuestion: function (socket, e){
        var val = e.which;
        if (val === 46) {
          // socket.emit('question active request');
          socket.emit('end question');
          // console.log("ending question with:  "+val);
        };
    },

    answerEight: function (e){
        var val = e.which;
        if (val === 48) {
          $("#show_mc_question").attr("src", "img/mc/question-list/q8-answer.png");
        };
    },

    answerNine: function (e){
        var val = e.which;
        if (val === 45) {
          $("#show_mc_question").attr("src", "img/mc/question-list/q9-answer.png");
        };
    },

    questionFinished: function (socket){
      socket.on('question status updated', function(data, id){
        if (data.status == 2){
          var qstatus = data.status;
          var qid = id;
          $('.question_mc_box[data-qid="'+qid+'"] > .status').attr("status", qstatus);
          $('.question_mc_box[data-qid="'+qid+'"]').removeClass("mc-circle");
        };
      });
    },

    getWinnerArray : function (socket) {
    // socket.emit("get winner array");
      socket.on("send winner array", function(data){
       $('#list-winners ul').html("")
        for(var i = 0; i < data.length; i++){
          // console.log(Object.values(data[i]).join(""))
          var name= (Object.values(data[i])).join('');
          $('#list-winners ul').append('<li>'+name+'</li>')
        }
          
      });
      
    },
    gameEnd: function (socket, e){
      var val = e.which
      if (val === 92) {
        if (showEndGame === false) {
          $("footer.mc_board_header").show();
          $("#host").hide();
          showEndGame = true;
          // console.log("ending game");
          socket.emit("mc ends game now");
        }
        // } else if (showEndGame === true) {
        //   $("footer.mc_board_header").hide();
        //   $("#host").show();
        //   showEndGame = false;
        // }
      }
    },


    initGame          : function (){
      $(function () {
        $("#host").hide();
        $("footer.mc_board_header").hide();
        // $(".mc-circle").hide();
        var socket        = io();
        $(document).off().on("keypress", function(e) {
          MC_Actions.getQuestions(socket)
          MC_Actions.hideLandingPage(e);
          MC_Actions.giftCounter(socket, e);
          MC_Actions.questionActiveReq(socket, e);
          MC_Actions.answerEight(e);
          MC_Actions.answerNine(e);
          MC_Actions.questionActivated(socket, e);
          MC_Actions.endQuestion(socket, e);
          MC_Actions.pauseBingo(e);
          MC_Actions.pauseSelectQ(e);
          MC_Actions.questionFinished(socket);
          MC_Actions.getWinnerArray(socket);
          MC_Actions.gameEnd(socket, e);
        });
      });
    }
  }

// START
  MC_Actions.initGame();
