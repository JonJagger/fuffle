
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
  Template.ask.instruction = function() {
    return "enter your question and hit enter";
  };  
  Template.ask.events({"keyup .ask input[type=text]":function(event) {
    var qid = Random.hexString(6);
    if (askedText() !== "" && event.which === 13) {      
      Questions.insert({ qid:qid, text:askedText() });
      Router.go('/answer/' + qid);      
    }    
  }});
  //- - - - - - - - - - - - - - - - - - - - - - - -
  var answerText = function() {
    return $(".answer input[type=text]").val();
  };
  var asked = function(qid) {
    return Questions.findOne({qid:qid});
  };
  Template.answer.rendered = function() {
    $(".answer input[type=text]").select(); // for focus
  };
  Template.answer.instruction = function() {
    return asked(this.qid) ?
      "enter your answer and hit enter" :
      "can't find question " + this.qid;
  };
  Template.answer.readonly = function() {
    return asked(this.qid) ? "" : "readonly";
  };
  Template.answer.events({"keyup .answer input[type=text]":function(event) {
    if (event.which === 13) {
      if (answerText() !== "" && answerText() !== Template.answer.instruction()) {
        Answers.insert({qid:this.qid, text:answerText()});
      }
      Router.go('/show/' + this.qid);      
    }    
  }});  
  //- - - - - - - - - - - - - - - - - - - - - - - -    
  Template.question.text = function() {
    var question = Questions.findOne({ qid:this.qid });
    var text = question ? question.text : "";
    if (text.charAt(text.length - 1) !== "?")
      text += "?";
    return text;
  };
  //- - - - - - - - - - - - - - - - - - - - - - - -    
  var isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }  
  var allAnswers = function(qid) {
    return Answers.find({qid:qid}).map(function(answer) {
      return answer.text;
    });        
  };
  var numeric = function(answers) {
    var numbers = _.filter(answers, function(answer) {
      return isNumber(answer);
    });
    return _.map(numbers, function(number) {
      return parseFloat(number);
    });
  };
  var tr = function(title,value) {
    return "" +
      "<tr>" +
        "<td class='stat'>" + title + "</td>" +
        "<td>" + value + "</td>" +
      "</tr>";
  };
  Template.show.stats = function() {
    var html = "";
    var answers = allAnswers(this.qid);
    html += "<table>";
    html += tr("answers", answers.length);
    var numbers = numeric(answers);
    if (numbers.length !== 0) {
      if (numbers.length !== answers.length) {
        html += tr("numbers", numbers.length);
      }
      html += tr("min", _.min(numbers));
      html += tr("max", _.max(numbers));
      html += tr("mean", jStat.mean(numbers).toFixed(2));
      html += tr("std.dev", jStat.stdev(numbers).toFixed(2));
    }
    html += "</table>";
    return html;
  };
  Template.show.answers = function() {
    return Answers.find({qid:this.qid});
  };
}
