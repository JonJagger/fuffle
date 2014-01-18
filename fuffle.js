
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

  var askedText = function() {
    return $(".ask input[type=text]").val();
  };
  Template.ask.rendered = function() {
    $(".ask input[type=text]").select();
  };
  Template.ask.events({"keyup .ask input[type=text]":function(event) {
    var qid = Random.hexString(6);
    if (askedText() !== "" && event.which === 13) {      
      Questions.insert({ qid:qid, text:askedText() });
      Router.go('/answer/' + qid);      
    }    
  }});
    
  var answerText = function() {
    return $(".answer input[type=text]").val();
  };  
  Template.answer.rendered = function() {
    $(".answer input[type=text]").select(); // for focus
  };  
  Template.answer.events({"keyup .answer input[type=text]":function(event) {
    if (event.which === 13) {
      if (answerText() !== "") {
        Answers.insert({ qid:this.qid, text:answerText() });
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
    
  var answers = function(qid) {
    return Answers.find({ qid:qid }).map(function(answer) {
      return answer.text;
    });        
  };
  Template.show.stats = function() {
    return "n=" + answers(this.qid).length;
  };
  Template.show.answers = function() {
    var html = "";
    _.each(answers(this.qid), function(answer) {
      html += "<div class='one'>" + answer + "</div>";
    });
    return html;    
  };

}
