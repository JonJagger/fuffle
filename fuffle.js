
Router.map(function() { 
  this.route('fuffle', { path: '/' });  
  this.route('fuffle', { path: '/:qid',
    data: function() { return { qid: this.params.qid } }
  });
});

Questions = new Meteor.Collection('questions');
Answers   = new Meteor.Collection('answers');

if (Meteor.isClient) {
  
  function asked(qid) {
    return Questions.findOne({ qid:qid });
  };
  function answered() {
    return Session.get("answered") === true;
  };
  
  Template.fuffle.noQuestion = function() {
    return !asked(this.qid);
  };
  Template.fuffle.notAnswered = function() {
    return asked(this.qid) && !answered();
  };
  Template.fuffle.answered = function() {
    return asked(this.qid) && answered();
  };
    
  Template.getQuestion.instruction = function() {
    return getQuestion.instruction;
  };
  Template.getQuestion.events({"keyup .get-question textarea":function() {
    getQuestion.button().enableIf(getQuestion.text() !== "");
  }});
  Template.getQuestion.events({"click .get-question input":function () {
    var qid = Random.hexString(6);
    Questions.insert({ qid:qid, text:getQuestion.text() });
    window.location.href = '/' + qid;
  }});
  Template.getQuestion.rendered = function() {
    $(".get-question textarea").select();
  };
  
  Template.showQuestion.text = function() {    
    return Questions.findOne({ qid:this.qid }).text;
  };
  
  Template.getAnswer.instruction = function() {
    return getAnswer.instruction;
  };
  Template.getAnswer.count = function() {
    var n = Answers.find({qid:this.qid}).count();
    return n + " given";    
  };  
  Template.getAnswer.events({"click .get-answer input":function () {
    var text = getAnswer.text();
    if (text !== getAnswer.instruction && text !== "") {
      Answers.insert({ qid:this.qid, text:text });
    }
    Session.set("answered", true);
  }});
  Template.getAnswer.rendered = function() {
    $(".get-answer textarea").select();
  };
    
  Template.showAll.answers = function() {
    return Answers.find({ qid: this.qid });
  };

}

var getQuestion = {    
  instruction:"your question",
  text:function() { return $(".get-question textarea").val(); },
  button:function() { return enabled($(".get-question input")); }
};

var getAnswer = {
  instruction:"your answer",
  text:function() { return $(".get-answer textarea").val(); }
};

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

