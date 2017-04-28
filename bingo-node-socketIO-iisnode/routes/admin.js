module.exports = function(app) {


  app.get('/admin', function(req, res, next){
    res.render('admin');
  });

}
