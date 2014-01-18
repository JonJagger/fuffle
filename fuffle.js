
Router.map(function() { 
  this.route('ask', { path: '/' });  
  this.route('answer', { path: '/answer/:qid',
    data: function() { return { qid: this.params.qid } }
  });
  this.route('show', { path: '/show/:qid',
    data: function() { return { qid: this.params.qid } }
  });  
});

Questions = new Meteor.Collection('questions');
Answers   = new Meteor.Collection('answers');

if (Meteor.isClient) {

  Template.ask.rendered = function() {
    $(".ask input[type=text]").select();
  };
  Template.ask.events({"keyup .ask input[type=text]":function(event) {
    var qid = Random.hexString(6);
    if (asked() !== "" && event.which === 13) {      
      Questions.insert({ qid:qid, text:asked() });
      Router.go('/answer/' + qid);      
    }    
  }});
    
  Template.answer.rendered = function() {
    $(".answer input[type=text]").select(); // for focus
  };  
  Template.answer.events({"keyup .answer input[type=text]":function(event) {
    if (event.which === 13) {
      if (answered() !== "") {
        Answers.insert({ qid:this.qid, text:answered() });
      }
      Router.go('/show/' + this.qid);      
    }    
  }});  
    
  Template.question.text = function() {
    var question = Questions.findOne({ qid:this.qid });
    var text = question ? question.text : "";
    if (text.charAt(text.length - 1) !== "?")
      text += "?";
    return text;
  };
    
  Template.show.stats = function() {
    return "n=" + Answers.find({qid:this.qid}).count();
  };
  Template.show.answers = function() {
    var html = "";
    var all = Answers.find({ qid: this.qid }).fetch();    
    _.each(all, function(answer) {
      html += "<div class='one'>" + answer.text + "</div>";
    });
    return html;    
  };

} // if (Meteor.isClient) {

if (Meteor.isServer) {

  var qid = "123456";
  Questions.remove({qid:qid});
  Questions.insert({qid:qid, text:"Estimate"});
  Answers.remove({qid:qid});
  _.times(250, function(n) {
    Answers.insert({qid:qid, text:n});
  });
}

var asked = function() {
  return $(".ask input[type=text]").val(); 
};

var answered = function() {
  return $(".answer input[type=text]").val(); 
};
