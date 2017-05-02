

var hostname   = document.location.hostname;

var socket_url   = 'http://'+hostname+':3000';
var sketchpad   = null;
var bg_col         = null;
var ans_val        = null;
var penSize       = 10;
// var ipad_id       = '';


// var data = null;

$(document).ready(function() {

      var socket = io.connect(socket_url);
      var ipad_container = $('.ipad');
      ipad_w   = ipad_container.width()*0.9;
      ipad_h   = ipad_container.height()*0.8;

      //init variable
      bg_col  = 1;
      ans_val = 1;

      $('.answer .choices').eq(0).addClass('selected');
      $('.color_sel .color').eq(0).addClass('selected');


      socket.on('disconnect', function() {
        // console.log('Got disconnect!');
        // console.log('disconnected');
        $('.connection .msg').html("Network disconnected<br/>Reconnecting.....");
        $('.connection').show();

      });

      socket.on('connect', function(socket){
        console.log('connected:', socket);
        $('.connection .msg').html("");
        $('.connection').hide();
      })

      //color select part START
      $('.color_sel .color').click(function(event){
          event.preventDefault();
          var elm = $(this);

          //add select class
          $('.color_sel .color').removeClass('selected');
          $(this).addClass('selected');

          //change background
          bg_col = $(this).attr('col');
          var new_bg = "url('./images/memo_bg"+bg_col+".png')";
          $('.sketchpad_container').css('background-image', new_bg);

      })
      //color select part END

      //answet select part START
      $('.answer .choices').click(function(event){
          event.preventDefault();
          var elm = $(this);

          //add select class
          $('.answer .choices').removeClass('selected');
          $(this).addClass('selected');

          ans_val = $(this).attr('ans');

        })

      //answet select part END

      var sketchpad_w = 640;
      var sketchpad_h = 640;

      sketchpad = new Sketchpad({
        element: '#sketchpad',
        width : sketchpad_w,
        height: sketchpad_h,
        penSize:penSize
      });



        $('.undo').click(function(){
            sketchpad.undo();
        })
        $('.redo').click(function(){
            sketchpad.redo();
        })

        var confirm_callback = null;
        function confirmBox(msg, callback){
            $('.quest').html(msg)
            confirm_callback = callback;
            $('.confirm').show();
        }

        $('.clear').click(function(event){
            event.preventDefault();
            // sketchpad.clearAll();
            confirmBox("Clear Answer?", function(){
                sketchpad.clearAll();
            })
        });

        $('.btn_confirm').click(function(){

            if(confirm_callback){
              if(typeof confirm_callback === "function"){
                confirm_callback();

                confirm_callback = null;
              }
            }

            $('.confirm').hide();

        })

        $('.btn_cancel').click(function(){
            $('.confirm').hide();
        })



        $('.submit').click(function(){
          var sketch_data = sketchpad.toObject();
          console.log(sketch_data);

            if(sketch_data.strokes.length==0){
              // alert('Please draw your memo!');
              confirmBox('Please draw your memo!', null);
              return;
            }


            confirmBox('Submit Answer?', function(){
                handleSubmit();
            });

            // console.log(data);
          /*  var answer = confirm("Submit Answer?")
            if (answer) {
                handleSubmit();
              }
          */



        });

        function handleSubmit(){
            var data = {};
            data.post  = sketchpad.toJSON();
            data.color = bg_col;
            data.cat    = ans_val;

            socket.emit('ipadSendPost', data);
            sketchpad.clearAll();
        }


        //when post send succcess
        /*
        socket.on('sendPostSuccess', function(data_back){
          if(data_back === data)
            alert('send post success');
        })
        */

    });


  function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    })
  };

  function cat_update(event){
      cat_val = $(event.target).val();
  }
  function color(event) {
      // sketchpad.color = $(event.target).val();
      bg_col =  $(event.target).val();
      $('#sketchpad').css('background-color', bg_col);
  }

$(window).on('resize', function() {
    sketchpad.reset();
});
