
Router.map(function() { 
  this.route('nib', { path: '/' });  
  this.route('nib', { path: '/:qid',
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
  
  Template.nib.rendered = function() {
    if (question.text() === question.instruction) {
      $(".question textarea").select();
    } else {
      $(".answer textarea").select();      
    }
  };
  
  Template.question.readonly = function() {
    return valid(this.qid) ? "readonly" : "";     
  };
  Template.question.text = function() {    
    var one = Questions.findOne({ qid:this.qid });
    return one ? one.text : question.instruction;
  };
  Template.question.disabled = function() {
    return (valid(this.qid) || question.text() !== "") ? "disabled='disabled'" : ""; 
  };
  Template.question.events({"keyup .question textarea":function() {
    if (!valid(this.qid) && question.text() !== "") {
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
    if (!valid(this.qid)) {
      return "";
    } else if (answered()) {
      return "";
    } else {
      return answer.instruction;
    }
  };
  Template.answer.disabled = function() {
    return valid(this.qid) ? "" : "disabled='disabled'";
  };  
  Template.answer.events({"click .answer input":function () {
    var text = answer.text();
    var one = { qid:this.qid, text:text };
    if (text !== "") {
      Answers.insert(one);
      answer.text("");
      answer.button().disable();
    }
    Session.set("answered", "true");
  }});
 
  Template.nib.allAnswers = function() {
    return Answers.find({ qid: this.qid });
  };
  Template.nib.display = function() {
    return answered() ? "block" : "none";
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
  instruction:"type the question here",
  button:function() {
    return enabled($(".question input"));
  }
};

var answer = {
  text:function(arg) {
    var node = $(".answer textarea");
    if (arg !== undefined) { node.val(arg); }
    return node.val();
  },
  instruction:"type your answer here",  
  button:function() {
    return enabled($(".answer input"));
  } 
};

var answered = function() {
  return Session.get("answered") === "true";
};

var valid = function(qid) {
  return Questions.findOne({ qid:qid });
};

