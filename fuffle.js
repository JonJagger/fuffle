
Router.map(function() { 
  this.route('ask', { path: '/' });  
  this.route('reply', { path: '/reply/:qid',
    data: function() { return { qid: this.params.qid } }
  });
  this.route('show', { path: '/show/:qid',
    data: function() { return { qid: this.params.qid } }
  });  
});

Questions = new Meteor.Collection('questions');
Answers   = new Meteor.Collection('answers');

if (Meteor.isClient) {

  Template.ask.instruction = function() {
    return ask.instruction;
  };
  Template.ask.events({"keyup .ask textarea":function() {
    ask.button().enableIf(ask.text() !== "");
  }});
  Template.ask.rendered = function() {
    $(".ask textarea").select();
  };
  Template.ask.events({"click .ask input":function () {
    var qid = Random.hexString(6);
    Questions.insert({ qid:qid, text:ask.text() });
    Router.go('/reply/' + qid);
  }});
    
  Template.reply.instruction = function() {
    return reply.instruction;
  };
  Template.reply.count = function() {
    return Answers.find({qid:this.qid}).count() + " given";
  };  
  Template.reply.rendered = function() {
    $(".reply textarea").select();
  };
  Template.reply.events({"click .reply input":function () {
    var text = reply.text();
    if (text !== reply.instruction && text !== "") {
      Answers.insert({ qid:this.qid, text:text });
    }
    Router.go('/show/' + this.qid);
  }});
    
  Template.question.text = function() {
    var question = Questions.findOne({ qid:this.qid });
    return question ? question.text : "";
  };
    
  Template.show.answers = function() {
    return Answers.find({ qid: this.qid });
  };

}

var ask = {    
  instruction:"your question",
  text:function() { return $(".ask textarea").val(); },
  button:function() { return enabled($(".ask input")); }
};

var reply = {
  instruction:"your answer",
  text:function() { return $(".reply textarea").val(); }
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

