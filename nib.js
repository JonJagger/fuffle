
Router.map(function() { 
 
  this.route('home', { path: '/' });
  
  this.route('home', { path: '/home/:qid',
    data: function() {
      return {
        qid: this.params.qid
      }
    }
  });

  this.route('reveal', { path: '/reveal/:qid',
    data: function() {
      return {
        qid: this.params.qid
      }
    }
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

var home = {    
  qid:function(arg) {
    if (!arg) {
      return $("#qid").val();
    } else {
      $("#qid").val(arg);
    }
  },
  qtext:function(arg) {
    $("#qtext").val(arg);
  },
  answer:function() { return enabled($("#answer")) },    
  reveal:function() { return enabled($("#reveal")) }
};

//==========================================================

if (Meteor.isClient) {
  
  Template.home.qtext = function() {    
    var question = Questions.findOne({ qid:this.qid });
    return question ? question.text : "";
  };
  
  // - - - - - - - - - - - - - - - - - - - - - - - -
  
  Template.home.validQid = function() {    
    return Questions.findOne({ qid:this.qid });
  };
  
  // - - - - - - - - - - - - - - - - - - - - - - - -
  
  Template.home.events({"click #question":function () {  
    var buttons = {
      ok:function() {
        var question = { qid:Random.hexString(6), text:$("#question_text").val() };
        Questions.insert(question);
        home.qid(question.qid);
        home.qtext(question.text);
        home.answer().enable();
        $(this).remove();
      },
      cancel:function() {
        $(this).remove();
      }
    };
    var html = "<textarea id='question_text'>enter it here</textarea>";
    //TODO: ok button enabled only if question entered
    var question = $('<div>')
        .html('<div class="dialog">' + html + '</div>')    
        .dialog({
          autoOpen: false,
          width: "400",
          height: "230",
          title: "question",
          modal: true,
          buttons: buttons
        });
    question.dialog('open');
    $("#question_text").select();
  }});
  
  // - - - - - - - - - - - - - - - - - - - - - - - -
  
  Template.home.events({"keyup #qid":function() {
    var question = Questions.findOne({ qid:home.qid() });    
    if (!question) {
      home.qtext("");
      home.answer().disable();
    } else {
      home.qtext(question.text);
      home.answer().enable();
    }
  }});
  
  // - - - - - - - - - - - - - - - - - - - - - - - - 
  
  Template.home.events({"click #answer":function () {    
    var buttons = {
      ok:function() {
        var answer = { qid:home.qid(), text:$("#answer_text").val() };
        Answers.insert(answer);
        home.answer().disable();
        home.reveal().enable();
        $(this).remove();
      },
      cancel:function() {
        $(this).remove();
      }
    };
    var html = "<textarea id='answer_text'>enter it here</textarea>";
    //TODO: ok button enabled only if question entered
    var answer = $('<div>')
        .html('<div class="dialog">' + html + '</div>')    
        .dialog({
          autoOpen: false,
          width: "400",
          height: "230",
          title: "answer",
          modal: true,
          buttons: buttons
        });
    answer.dialog('open');
    $("#answer_text").select();
  }});
  
  // - - - - - - - - - - - - - - - - - - - - - - - - 
  
  Template.home.events({"click #reveal":function () {
    window.open("/reveal/" + home.qid(), "_blank");  
  }});

  // - - - - - - - - - - - - - - - - - - - - - - - - 

  Template.question.text = function() {
    return Questions.findOne({ qid:this.qid }).text;
  };
  
  // - - - - - - - - - - - - - - - - - - - - - - - -
  
  Template.reveal.answers = function() {
    return Answers.find({ qid:this.qid });
  };

}
