
Router.map(function() { 
  this.route('fuffle', { path: '/' });  
  this.route('fuffle', { path: '/:qid',
    data: function() { return { qid: this.params.qid } }
  });
});

Questions = new Meteor.Collection('questions');
// Questions.insert({ qid:"138ef8", text:"what is 9 * 6" });

Answers = new Meteor.Collection('answers');
// Answers.insert({ qid:"138ef8", text:"42" });
// Answers.insert({ qid:"138ef8", text:"54" });

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

if (Meteor.isClient) {
  
  Template.fuffle.askedQuestion = function() {
    return asked(this.qid);
  };
  Template.fuffle.notAskedQuestion = function() {
    return !asked(this.qid);
  };
    
  Template.askQuestion.instruction = function() {
    return askQuestion.instruction;
  };
  Template.askQuestion.events({"keyup .ask-question textarea":function() {
    askQuestion.button().enableIf(askQuestion.text() !== "");
  }});
  Template.askQuestion.events({"click .ask-question input":function () {
    var qid = Random.hexString(6);
    Questions.insert({ qid:qid, text:askQuestion.text() });
    window.location.href = '/' + qid;
  }});
  Template.askQuestion.rendered = function() {
    $(".ask-question textarea").select();
  };
  
  Template.question.text = function() {    
    return Questions.findOne({ qid:this.qid }).text;
  };
  
  Template.answer.text = function() {
    return answered() ? answer.text() : answer.instruction;
  };
  Template.answer.isTextReadonly = function() {
    return answered() ? "readonly" : "";
  };
  Template.answer.isButtonDisabled = function() {
    return answered() ? "disabled='disabled'" : "";
  };
  Template.answer.events({"click .answer input":function () {
    var text = answer.text();
    if (text !== answer.instruction && text !== "") {
      Answers.insert({ qid:this.qid, text:text });
    }
    Session.set("answered", true);
  }});
  Template.answer.rendered = function() {
    if (answer.text() === answer.instruction) {
      $(".answer textarea").select();
    }
  };
  
  Template.countInfo.text = function() {
    var n = Answers.find({qid:this.qid}).count();
    if (asked(this.qid)) {      
      return n + " " + plural("answer",n) + "...";
    } else {
      return "";
    }
  };
  
  Template.answerQuestion.allAnswers = function() {
    return Answers.find({ qid: this.qid });
  };
  Template.answerQuestion.display = function() {
    return answered() ? "block" : "none";
  };

}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var enabled = function(button) {
  button.enableIf = function(condition) {
    if (condition) {
       this.removeAttr("disabled");
    } else {
      this.attr("disabled", "disabled");
    }
  };
  return button;
};

var askQuestion = {    
  instruction:"your question",
  text:function() { return $(".ask-question textarea").val(); },
  button:function() { return enabled($(".ask-question input")); }
};

var asked = function(qid) {
  return Questions.findOne({ qid:qid });
};

var answer = {
  instruction:"your answer",
  text:function() { return $(".answer textarea").val(); }
};

var answered = function() {
  return Session.get("answered") === true;
};

var plural = function(word,n) {
  return word + (n !== 1 ? "s" : "");  
};
