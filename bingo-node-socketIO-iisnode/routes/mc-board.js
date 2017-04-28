module.exports = function(app) {

  function findQuestions(req,res,next){
    // GameQuestions.find(function(err,data){
    //   if(err){
    //     res.send(err);
    //   };
    //   // console.log(data[1]._id)
    //   req.questions = data;
    //   next();
    // });
  };

  function renderMcBoard(req,res){
    res.render('mc-board', {
      questions: req.questions
    });
  };

  app.get('/mc-board', renderMcBoard);

}
