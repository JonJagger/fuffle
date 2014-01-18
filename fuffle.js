
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
  Template.ask.tip = function() {
    return "type in your question and hit enter";
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
  var badQidMessage = function(qid) {
    return "<div style='color:red;'>cant find question " + qid + "</div>";
  };
  Template.answer.rendered = function() {
    if (answerText() === "") {    
      $(".answer input[type=text]").select(); // for initial focus
    }
  };
  Template.answer.validQid = function() {
    return asked(this.qid);
  };
  Template.answer.invalidQid = function() {
    return !asked(this.qid);
  };
  Template.answer.tip = function() {
    return "type in your answer and hit enter";
  };
  Template.answer.badQidMessage = function() {
    return badQidMessage(this.qid);    
  };
  Template.answer.events({"keyup .answer input[type=text]":function(event) {
    if (event.which === 13) {
      if (answerText() !== "") {
        Answers.insert({qid:this.qid, text:answerText()});
      }
      Router.go('/show/' + this.qid);      
    }    
  }});  
  //- - - - - - - - - - - - - - - - - - - - - - - -    
  Template.count.soFar = function() {
    // in its own template so as to preserve
    // text input on parent template
    var n = Answers.find({qid:this.qid}).count();
    if (n === 0) {
      return "There are no answers so far."
    } else if (n === 1) {
      return "There is " + n + " answer so far.<br>" +
             "You'll see it once you've entered your answer.";             
    } else {
      return "There are " + n + " answers so far.<br>" +
             "You'll see them once you've entered your answer."
    }
  };
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
  var tr = function(name,value) {
    return "" +
      "<tr>" +
        "<td class='name'>" + name + "</td>" +
        "<td class='value'>" + value + "</td>" +
      "</tr>";
  };
  Template.show.validQid = function() {
    return asked(this.qid);
  }
  Template.show.invalidQid = function() {
    return !asked(this.qid);
  }
  Template.show.badQidMessage = function() {
    return badQidMessage(this.qid);
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
