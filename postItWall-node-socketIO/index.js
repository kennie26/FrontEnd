var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('post.db');



// to do:
// arrange memo position in server

var num_a =0;
var num_b =0;
var num_c =0;
var limit =27; //post limit 28



app.get('/app*', function(req, res){
  // console.log('app get :', req.originalUrl);
  res.sendFile(__dirname+ req.originalUrl)
})



io.on('connection', function(socket){

	console.log('user connected');

    socket.on('disconnect', function(){
  	  console.log('user disconnected');
  	});

    /*
    	socket.on('chat message', function(msg){
    	  io.emit('chat message', msg);
    	  console.log('message: ' + msg);
    	});
    */

//============== ipad ACTION START ==================================================
    //when receive new posts
    socket.on('ipadSendPost', function(data){

      io.sockets.emit ('sendPostSuccess', data);
          // console.log('receive data:', data);
          console.log('receive data  data: ', data);

          var cat      = data.cat;
          var position = '';
          var posy =0;
          var posx =0;
          var ran_angle = getRandomInt(-5,5);

          //cal post position
          var top_start = 260;

          var memo_w = 310;
          var memo_h = 310;
          var left_start = 0;
          var curr_num = 0;

          var position ='';
          if(cat ==1 ){
             left_start = 136;
             curr_num = num_a;
              num_a++;

          }else if (cat ==2) {
              left_start = 2067;
              curr_num = num_b;
              num_b++;

          }else if (cat ==3) {
              left_start = 3961;
              curr_num = num_c;
              num_c++;
          }

          posy  =  top_start + Math.floor(curr_num/4)* (memo_h + 100); //117
          posx  =  left_start  + (curr_num%4 )* (memo_w + 120);//134

          // position = 'left:'+left+'px;';
          // position += 'top:'+top+'px';

          num_a =  num_a<=limit ? num_a:0;
          num_b =  num_b<=limit ? num_b:0;
          num_c =  num_c<=limit ? num_c:0;

          data.posx = posx;
          data.posy = posy;
          data.rotate = ran_angle;

          console.log(data);

          //save post to db
          saveTodb(data, function(id){
            console.log('send to board id:', id);
              data.id = id;
              io.sockets.emit('serverNewPost', data);
          })
    })

//============== ipad ACTION END ==================================================

//============== board action START ===============================================
    socket.on('boardGetAllMemo' , function(){
      //get all memo in db;
      var query = "SELECT * FROM `posts` WHERE enable = 0 ORDER BY time ASC;";

      db.serialize(function() {
        var stmt = db.prepare(query);

        db.all(query, function(error , res){
          // console.log('error:', error,'  res:', res);
            io.sockets.emit ('boardGetAllMemoReturn', res);
        });

      })

    })

    socket.on('boardDelMemo', function(post_id){
      console.log('del post :', post_id);
      var query = "UPDATE `posts` SET enable=1 WHERE id = '"+post_id+"';";

      db.serialize(function(){
        db.run(query, function(error){
            console.log('error: ', error);

            if(error === null){
                console.log('emit del success: ', post_id);
                io.sockets.emit('boardDelMemoSuccess', post_id);
            }
        })
      })
    })

    socket.on('boardSaveMemoStyle', function(data){

      console.log('boardSaveMemoStyle data:', data);
      // return;

      var query = "UPDATE `posts` SET posx='"+data.pos.posx+"', posy='"+data.pos.posy+"' WHERE id = '"+data.post_id+"';";
      console.log(query);

      db.serialize(function(){
        db.run(query, function(error){
            console.log('error: ', error);

            if(error === null){
                io.sockets.emit('boardSaveMemoStyleSuccess', data);
            }

        })
      });


    })

//============== board action END ==============================================



});



function saveTodb(post, callback){
  var query = "INSERT INTO `posts` (cat, color, content, posx, posy, rotate, enable) VALUES ('"+post.cat+"','"+post.color+"','"+post.post+"','"+post.posx+"','"+post.posy+"','"+post.rotate+"' , 0)";

    db.serialize(function() {
            // console.log(query);
            var stmt = db.prepare(query);
            stmt.run();

            var last_id =-1;
            db.get('select seq from sqlite_sequence where name="posts"', function(error, res){
                console.log('Db last id: ', res, 'error:' ,error);
                last_id = res.seq;

                if(callback && typeof callback === 'function'){
                      callback(last_id);
                }

            })
            //.finalize(); run when you use loop
    });
  // db.close();
}



function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

http.listen(3000, function(){
    console.log('listening on *:3000');
});
