var hostname   = document.location.hostname;
var socket_url   = 'http://'+hostname+':3000';
var board_id = '';

var num_a =0;
var num_b =0;
var num_c =0;

var post_num = 0;
var penSize =10;
var getallMemo = false;

$(document).ready(function() {
      // console.log('doc ready');
      var socket = io.connect(socket_url);

      var w = $(window).width();
      var h = $(window).height();

      board_id = guid();

      // alert('width, height: '+w+' '+ h);

      // console.log(w,h)

      $('body').on('click', '.btn_close',  function(event){
          event.preventDefault();
          var post_id = $(this).attr('post');
          // console.log('del post: ', post_id);
          // $('#'+post).remove();

          socket.emit('boardDelMemo', post_id);

      });



      socket.on('boardDelMemoSuccess', function(post_id){
        //  console.log('boardDelMemoSuccess post_id:', post_id);
        $('#'+post_id).append('<div class="delete"></div>');
        setTimeout(function() {
          $('#'+post_id).remove();
        }, 200);

      });


      $('body').on('mouseover click', '.post',  function(event){
          event.preventDefault();
          $('.post').removeClass('topPost');
          $(this).addClass('topPost');
      })



      socket.on('disconnect', function() {
        // console.log('Got disconnect!');
        console.log('disconnected');
        //perform cleraup and get all post again
        $('.post').remove();
        getallMemo = false;

        // $('.status').html('disconnected');
        $('.status').show();

      });

      socket.on('connect', function(){
        console.log('connected');
        socket.emit('boardGetAllMemo');

        $('.status').hide();
      })

      //get curr board when connect
      //emit get all post here
      socket.on('boardGetAllMemoReturn', function(data){
          // console.log(data);

          //if get memo before , ignroe the return message
          if(getallMemo){
            return;
          }

          //add memo to board
          for (var i = 0; i < data.length; i++) {
            // if(i>=50)
              // break;
            var memo = data[i];

            // var position  = memo.style||'top:50%;left:50%';
            var post_id   = memo.id;
            var color = memo.color;

            //update display pensize
            var setting = JSON.parse(memo.content);
            createMemo(setting, post_id, color, memo, false );
          }
          getallMemo = true;
      });

      //receive new memo
      socket.on('serverNewPost', function(data){
          console.log('serverNewPost receive: ', data);
          // update_broad(data.cat, data.color, data.post , data.id)
          var setting = JSON.parse(data.post);
          createMemo(setting, data.id, data.color, data, true );
      });



      //recceive board update


      socket.on('boardSaveMemoStyleSuccess', function(data){
        // console.log('boardSaveMemoStyleSuccess: ', data);

        if(data.board_id != board_id){
          // alert('post update!');
            var post_id = data.post_id;
            var style = 'top:'+data.pos.posy+'px;'+'left:'+data.pos.posx+'px;';
            style += 'transform: rotate('+data.pos.rotate+'deg); transform-origin: 50% 50% 0px;';

            $('#'+post_id).attr('style', style);

            // console.log('update post: ', data);
        }
      })


      function createMemo(post_content, post_id, color, post, animate ){

        // console.log(post);

        var animate_class = animate?'new':'';

        var memo_name = 'memo_'+post_id;


        var style = 'top:'+post.posy+'px;'+'left:'+post.posx+'px;';
        style += 'transform: rotate('+post.rotate+'deg); transform-origin: 50% 50% 0px;';

        // console.log(style);
        //transform: rotate(5deg); transform-origin: 50% 50% 0px;

        var post_template = '<div class="post '+animate_class+' color'+color+'" id="'+post_id+'" style="'+style+'" rotate="'+post.rotate+'"><canvas id="'+memo_name+'" class="post_content" ></canvas><a href="#" class="btn_close" post="'+post_id+'"><img src="images/btn_close.png" /></a></div>';

        $('.broad').append(post_template);
        $( "#"+post_id ).draggable({
          stop: function() {
            // var style = $(this).attr('style');

            // var pos = style.indexOf('transform:');
            // //temp delete tranform style
            // if(pos >-1){
            //   style = style.substring(0,pos);
            // }


            var pos = $(this).offset();
            var rotate = parseInt($(this).attr('rotate'));

            var w = $(this).width();
            var h = $(this).height();


            var pos_data = {};
            // pos_data.posy = pos.top  - Math.cos(rotate) * w/2;
            // pos_data.posx = pos.left - Math.sin(rotate) * h/2;

            pos_data.posy = pos.top;
            pos_data.posx = pos.left;
            pos_data.rotate = rotate;

            console.log(pos, rotate, w, h, pos_data);


            saveMemoPos(post_id, pos_data);
          }
        });

        var setting = post_content;
        setting.element = '#'+memo_name;
        setting.readOnly = true;
        for (var i = 0; i < setting.strokes.length; i++) {
          var stroke = setting.strokes[i]
          stroke.size = penSize;
        }

        // console.log(setting);
        var sketch = new Sketchpad(setting);
        if(animate)
          sketch.animate(8);

        // var ran_angle = getRandomInt(-5,5);
        // console.log('#'+post_id,' random:', ran_angle);

        //random rotate setting
        // $("#"+post_id ).rotate({angle: 5 });

      }




      function saveMemoPos(post_id, pos_data){
        // var style = elm.attr('style');
        var data = {};
        data.post_id  = post_id;
        data.pos      = pos_data;
        data.board_id = board_id;

        // console.log('style on position:', style);
        socket.emit('boardSaveMemoStyle',data);
      }


      //uilites functions

      function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
        })
      };



      function debug(string){
            $('.debug').append(string+'<br />');
      }


});
