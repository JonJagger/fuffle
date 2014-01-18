
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

  Template.ask.events({"keyup .ask textarea":function() {
    ask.button().enableIf(ask.text() !== "");
  }});
  Template.ask.rendered = function() {
    $(".ask textarea").select();
  };
  Template.ask.events({"click .ask input":function () {
    var qid = Random.hexString(6);
    Questions.insert({ qid:qid, text:ask.text() });
    Router.go('/answer/' + qid);
  }});
    
  Template.answer.rendered = function() {
    $(".answer textarea").select(); // focus
  };
  Template.answer.events({"click .answer input":function () {
    var text = answer.text();
    if (text !== "") {
      Answers.insert({ qid:this.qid, text:text });
    }
    Router.go('/show/' + this.qid);
  }});
    
  Template.question.text = function() {
    var question = Questions.findOne({ qid:this.qid });
    var text = question ? question.text : "";
    if (text.charAt(text.length - 1) !== "?")
      text += "?";
    return text;
  };
    
  Template.stats.count = function() {
    return Answers.find({qid:this.qid}).count();
  };  
  Template.show.answers = function() {    
    var html = "";
    var chunks = Answers.find({ qid: this.qid }).fetch().chunk(5);    
    html += "<table>";
    for (var i = 0; i !== chunks.length; i++) {
      var chunk = chunks[i];
      html += "<tr>";
      for (var j = 0; j !== chunk.length; j++) {
        html += "<td class='one-answer'>" + chunk[j].text + "</td>";
      }
      html += "</tr>";
    }
    html += "</table>";
    return html;
  };

}

Array.prototype.chunk = function(size) {
  var result = [ ];
  for (var i = 0; i < this.length; i += size) {
      result.push(this.slice(i, i + size));
  }
  return result;
};

var ask = {    
  text:function() { return $(".ask textarea").val(); },
  button:function() { return enabled($(".ask input")); }
};

var answer = {
  text:function() { return $(".answer textarea").val(); }
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

