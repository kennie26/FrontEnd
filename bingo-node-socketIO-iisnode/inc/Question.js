// Constructor
function Question() {
  this.questions = {
    "1": {
      "question": "img/mc/question-list/q1.png",
      "answers": {"Yes":"Yes","No":"No"},
      "correct_answer": "Yes",
      "limit": 5,
      "expiry": 0,
      "status": 0,
    },
    "2": {
      "question": "img/mc/question-list/q2.png",
      "answer_txt": "<p>Yes / No</p>",
      "answers": {"Yes":"Yes","No":"No"},
      "correct_answer": "Yes",
      "limit": 5,
      "expiry": 0,
      "status": 0,
    },
    "3": {
      "question": "img/mc/question-list/q3.png",
      "answer_txt": "<p>A. dummy text</p><p>B. dummy text</p><p>C. dummy text</p>",
      "answers": {"Yes":"Yes","No":"No"},
      "correct_answer": "Yes",
      "limit": 5,
      "expiry": 0,
      "status": 0,
    },
    "4": {
      "question": "img/mc/question-list/q4.png",
      "answer_txt": "<p>Yes / No</p>",
      "answers": {"Yes":"Yes","No":"No"},
      "correct_answer": "Yes",
      "limit": 5,
      "expiry": 0,
      "status": 0,
    },
    "5": {
      "question": "img/mc/question-list/q5.png",
      "answer_txt": "<p>A. dummy text</p><p>B. dummy text</p><p>C. dummy text</p>",
      "answers": {"Yes":"Yes","No":"No"},
      "correct_answer": "Yes",
      "limit": 5,
      "expiry": 0,
      "status": 0,
    },
    "6": {
      "question": "img/mc/question-list/q6.png",
      "answer_txt": "<p>Yes / No</p>",
      "answers": {"Yes":"Yes","No":"No"},
      "correct_answer": "Yes",
      "limit": 5,
      "expiry": 0,
      "status": 0,
    },
    "7": {
      "question": "img/mc/question-list/q7.png",
      "answer_txt": "<p>A. dummy text</p><p>B. dummy text</p><p>C. dummy text</p>",
      "answers": {"Yes":"Yes","No":"No"},
      "correct_answer": "Yes",
      "limit": 5,
      "expiry": 0,
      "status": 0,
    },
    "8": {
      "question": "img/mc/question-list/q8.png",
      "answer_txt": "<p>Yes / No</p>",
      "answers": {"A":"A","B":"B","C":"C","D":"D"},
      "correct_answer": "B",
      "limit": 5,
      "expiry": 0,
      "status": 0,
    },
    "9": {
      "question": "img/mc/question-list/q9.png",
      "answer_txt": "<p>A. dummy text</p><p>B. dummy text</p><p>C. dummy text</p>",
      "answers": {"A":"A","B":"B","C":"C","D":"D"},
      "correct_answer": "C",
      "limit": 5,
      "expiry": 0,
      "status": 0,
    }
  };
  this.tempInfo = {"1":{"question":"","answer_txt":"","answers":""},"2":{"question":"","answer_txt":"","answers":""},"3":{"question":"","answer_txt":"","answers":""},"4":{"question":"","answer_txt":"","answers":""},"5":{"question":"","answer_txt":"","answers":""},"6":{"question":"","answer_txt":"","answers":""},"7":{"question":"","answer_txt":"","answers":""},"8":{"question":"","answer_txt":"","answers":""},"9":{"question":"","answer_txt":"","answers":""}};
  this.tempStatus = {"1":{"limit":"","expiry":"","status":""},"2":{"limit":"","expiry":"","status":""},"3":{"limit":"","expiry":"","status":""},"4":{"limit":"","expiry":"","status":""},"5":{"limit":"","expiry":"","status":""},"6":{"limit":"","expiry":"","status":""},"7":{"limit":"","expiry":"","status":""},"8":{"limit":"","expiry":"","status":""},"9":{"limit":"","expiry":"","status":""}};
}
// class methods
Question.prototype.getList = function() {
  var qinfo = this.tempInfo;
  for (item in this.questions) {
    qinfo[item]["question"] = this.questions[item]["question"];
    qinfo[item]["answer_txt"] = this.questions[item]["answer_txt"];
    qinfo[item]["answers"] = this.questions[item]["answers"];
  }
  return qinfo;
};

Question.prototype.getStatus = function() {
  var qstatus = this.tempStatus;
  for (item in this.questions) {
    qstatus[item]["limit"] = this.questions[item]["limit"];
    qstatus[item]["expiry"] = this.questions[item]["expiry"];
    qstatus[item]["status"] = this.questions[item]["status"];
  }
  return qstatus;
};

Question.prototype.activeQuestion = function(question_id) {
    // var seconds = this.questions[question_id]["limit"];
    // var expiryTime = new Date(new Date().getTime() + seconds * 1000);

  // console.log(question_id);
    this.questions[question_id]["status"] = 1;
    // this.questions[question_id]["expiry"] = expiryTime;

    // return {"question_id": question_id,"expiryTime":expiryTime};
    return {"question_id": question_id};

    // console.log(this.questions);
};

Question.prototype.finishQuestion = function(question_id) {

  // console.log(question_id);
    this.questions[question_id]["status"] = 2;
    this.questions[question_id]["expiry"] = 0;


    // console.log(this.questions);
};
// export the class
module.exports = Question;
