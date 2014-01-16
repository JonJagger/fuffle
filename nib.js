
Router.map(function() { 
 
  this.route('home', { path: '/' });  

  this.route('home', { path: '/:qid',
    data: function() { return { qid: this.params.qid } }
  });

});

//==========================================================

Questions = new Meteor.Collection('questions');
// Questions.insert({ qid: "138ef8", text: "what is 9 * 6"  });

Answers = new Meteor.Collection('answers');
// Answers.insert({ qid: "138ef8", text: "42"  });

//==========================================================

var enabled = function(button) {
  button.enable = function() {
    this.removeAttr("disabled");
  };
  button.disable = function() {
    this.attr("disabled", "disabled");
  };
  return button;
};

//==========================================================

var question = {    
  id:function(arg) {
    var node = $(".question #id"); 
    if (arg) { node.val(arg); }
    return node.val();
  },
  text:function(arg) {
    var node = $(".question #text"); 
    if (arg !== undefined) { node.val(arg); }
    return node.val();
  },
  button:function() {
    return enabled($(".question #button"))
  }
};

var answer = {
  text:function(arg) {
    var node = $(".answer #text");
    if (arg !== undefined) { node.val(arg); }
    return node.val();
  },
  button:function() {
    return enabled($(".answer #button"))
  },    
};

//==========================================================

if (Meteor.isClient) {
  
  Template.answer.validQid = function() {    
    return Questions.findOne({ qid:this.qid });
  };
  
  Template.question.text = function() {    
    var one = Questions.findOne({ qid:this.qid });
    return one ? one.text : "";
  };
  
  Template.question.events({"keyup .question #text":function() {
    if (question.text() !== "") {
      question.button().enable();
    } else {
      question.button().disable();
    }
  }});
  
  Template.question.events({"click .question #button":function () {  
    var one = { qid:Random.hexString(6), text:question.text() };
    Questions.insert(one);
    question.id(one.qid);
    answer.button().enable();
  }});
  
  Template.question.events({"keyup .question #id":function() {
    var one = Questions.findOne({ qid:question.id() });    
    if (!one) {
      question.text("");
      answer.button().disable();
    } else {
      question.text(one.text);
      answer.button().enable();
    }
  }});
  
  Template.answer.events({"click .answer #button":function () {
    var text = answer.text();
    if (text !== "") {
      var one = { qid:question.id(), text:text };
      Answers.insert(one);
      answer.text("");
    }
    alert("reveal all answers");
  }});
  
}
