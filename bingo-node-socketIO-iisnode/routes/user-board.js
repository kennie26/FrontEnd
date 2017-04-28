module.exports = function(app) {

  // app.get('/', function(req,res,next){
  //   res.redirect('/user-board');
  // });

  app.get('/user-board', function(req, res, next){
    res.render('user-board');
  });

}
