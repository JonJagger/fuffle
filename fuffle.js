
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
  
  Template.fuffle.allAnswers = function() {
    return Answers.find({ qid: this.qid });
  };
  Template.fuffle.display = function() {
    return answered() ? "block" : "none";
  };
  Template.fuffle.rendered = function() {
    if (question.text() === question.instruction) {
      $(".question textarea").select();
    } else {
      $(".answer textarea").select();      
    }
  };
  
  Template.question.readonly = function() {
    return asked(this.qid) ? "readonly" : "";     
  };
  Template.question.text = function() {    
    var one = Questions.findOne({ qid:this.qid });
    return one ? one.text : question.instruction;
  };
  Template.question.disabled = function() {
    var yes = "disabled='disabled'";
    var no = "";
    return (asked(this.qid) || question.text() !== "") ? yes : no; 
  };
  Template.question.events({"keyup .question textarea":function() {
    if (!asked(this.qid) && question.text() !== "") {
      question.button().enable();
    } else {
      question.button().disable();
    }
  }});
  Template.question.events({"click .question input":function () {  
    var one = { qid:Random.hexString(6), text:question.text() };
    Questions.insert(one);
    window.location.href = '/' + one.qid;
  }});

  
  Template.answer.readonly = function() {
    return answered() ? "readonly" : "";
  };
  Template.answer.text = function() {
    if (!asked(this.qid)) {
      return "";
    } else if (!answered()) {
      return answer.instruction;
    } else {
      return "";
    }
  };
  Template.answer.disabled = function() {
    var disable = "disabled='disabled'";
    if (!asked(this.qid)) {
      return disable;
    } else if (!answered()) {
      return "";
    } else {
      return disable;      
    }
  };  
  Template.answer.events({"click .answer input":function () {
    var text = answer.text();
    var one = { qid:this.qid, text:text };
    if (text !== answer.instruction && text !== "") {
      Answers.insert(one);
      answer.text("");
      answer.button().disable();
    }
    Session.set("answered", "true");
  }});
  
  Template.countInfo.text = function() {
    var n = Answers.find({qid:this.qid}).count();
    if (asked(this.qid)) {      
      return n + " " + plural("answer",n) + "...";
    } else {
      return "";
    }
  };
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var enabled = function(button) {
  button.enable = function() {
    this.removeAttr("disabled");
  };
  button.disable = function() {
    this.attr("disabled", "disabled");
  };
  return button;
};

var question = {    
  text:function() {
    return $(".question textarea").val();
  },
  instruction:"your question here",
  button:function() {
    return enabled($(".question input"));
  }
};

var asked = function(qid) {
  return Questions.findOne({ qid:qid });
};

var answer = {
  text:function(arg) {
    var node = $(".answer textarea");
    if (arg !== undefined) { node.val(arg); }
    return node.val();
  },
  instruction:"your answer here",  
  button:function() {
    return enabled($(".answer input"));
  } 
};

var answered = function() {
  return Session.get("answered") === "true";
};

var plural = function(word,n) {
  return word + (n !== 1 ? "s" : "");  
};



