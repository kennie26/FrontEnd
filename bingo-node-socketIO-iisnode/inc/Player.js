// Constructor
function Player() {
  this.players_list = {
    // "p1": {
    //   "player_id": "p1",
    //   "player_name": "Table 1",
    //   "token": "abc",
    //   "socket_id": null,
    //   "history": null
    // },
    // "p2": {
    //   "player_id": "p2",
    //   "player_name": "Table 2",
    //   "token": "abc",
    //   "socket_id": null,
    //   "history": null
    // },
    // "p3": {
    //   "player_id": "p3",
    //   "player_name": "Table 3",
    //   "token": "abc",
    //   "socket_id": null,
    //   "history": null
    // }
  };
  for (i = 0; i<=70; i++) {
    this.players_list[i] = {
      "player_id": i,
      "player_name": "",
      "socket_id": null,
      "history": null}
  }

  function getRandomBoard(){
    var history_temp = {
      1: {answer:null,status:0,position:0},
      2: {answer:null,status:0,position:0},
      3: {answer:null,status:0,position:0},
      4: {answer:null,status:0,position:0},
      5: {answer:null,status:0,position:0},
      6: {answer:null,status:0,position:0},
      7: {answer:null,status:0,position:0},
      8: {answer:null,status:0,position:0},
      9: {answer:null,status:0,position:0}
    };

    var position_arr = [1,2,3,4,5,6,7,8,9];
    var result = history_temp;
    var i=1;
    // console.log(position);
    // console.log(position[1]);
    while(position_arr.length > 0){
      var j = Math.floor((Math.random() * position_arr.length));
      result[i]['position'] = position_arr[j];

      position_arr.splice(j, 1);
      i++;
    }

    // console.log(result);
    return result;
  }
  //genRandomBoard
  for (item in this.players_list) {
    temp = getRandomBoard();
    // console.log(temp);
    // console.log(this.players_list);
    // console.log(item);
    // console.log("####################");
    this.players_list[item]["history"] = temp;
    // console.log(this.players_list[item]["history"]);
  }

}
// class methods
Player.prototype.getList = function() {
  return this.players_list;
};
Player.prototype.getHistory = function(player_id) {
  return this.players_list[player_id]["history"];
};
Player.prototype.getInfo = function(player_id) {
  return this.players_list[player_id];
};
Player.prototype.getBindedSocket = function(player_id) {
  return this.players_list[player_id]["socket_id"];
};
Player.prototype.bindSocket = function(player_id, socket_id) {
  this.players_list[player_id]["socket_id"] = socket_id;
};
Player.prototype.unbindSocket = function(player_id) {
  this.players_list[player_id]["socket_id"] = null;
};
Player.prototype.updateAnswer = function(player_id, question_id, answer) {
  this.players_list[player_id]["history"][question_id]["answer"] = answer;
};
//login
Player.prototype.login = function(player_id, socket_id, kick_current_user) {

    var players = this.getList();

    if(typeof player_id === "undefined" || player_id == ""){
      return {"success":false, "error_msg":"Player ID incorrect"};

    }else if(typeof players[player_id] === "undefined"){
      return {"success":false, "error_msg":"Player ID incorrect"};

    }else if(this.getBindedSocket(player_id) !== null){
      if (kick_current_user){
        var prev_socket_id = this.getBindedSocket(player_id);
        this.bindSocket(player_id, socket_id);
        return {"success":true, "error_msg":"", "player_info": this.getInfo(player_id), "player_history": this.getHistory(player_id), "prev_socket_id" : prev_socket_id};
      }else {
        return {"success":false, "error_msg":"Player has already logged in"};
      }
    }else{
      //Login Success
        // if (kick_current_user){
        //   var prev_socket_id = this.getBindedSocket(player_id);
          this.bindSocket(player_id, socket_id);
          return {"success":true, "error_msg":"", "player_info": this.getInfo(player_id), "player_history": this.getHistory(player_id), "prev_socket_id" : prev_socket_id};
        // }else {
        //   return {"success":false, "error_msg":"Please has already logged in"};
        // }
    }
};




// export the class
module.exports = Player;
