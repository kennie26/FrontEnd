module.exports = function(io, GameQuestions) {
  //io
  io.on('connection', function (socket) {
    ///////////////////////////////////////
        // initial connection with clients
        // console.log("connection detected")
        // // send client a message
        // socket.emit('welcome-user', { msg: 'Welcome!' });
        // // recieve data from client
        // socket.on('thank-server', function (data) {
        //   console.log(data.msg);
        // });
    ///////////////////////////////////////

    socket.on('mc-picked-question', function(data){
      socket.selectedId = data.selection;
      console.log("MC selected question with id: " + socket.selectedId);
      socket.broadcast.emit('push-data', socket.selectedId);
      // GameQuestions.update({"_id": socket.selectedId}, {"mcPicked": true}, function(){console.log("update mongo lab")});
    });

  });
}