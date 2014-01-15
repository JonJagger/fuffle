
newQid = function() {
  // could iterate 1000 times looking for qid with
  // lowest entropy, eg AAABBB
  return Random.hexString(6);  
};

findQuestion = function(qid) {
  return Questions.findOne({ qid:qid });
};

// - - - - - - - - - - - - - - - - - - - - - - - - 

var enabled = function(button) {
  button.enable = function() {
    this.removeAttr("disabled");
  };
  button.disable = function() {
    this.attr("disabled", "disabled");
  };
  return button;
};

// - - - - - - - - - - - - - - - - - - - - - - - - 

var home = {
  question:function() {
    return enabled($("#question"));
  },
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
  answer:function() {
    return enabled($("#answer"));
  },
  reveal:function() {
    return enabled($("#reveal"));
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.home.qtext = function() {
  var question = findQuestion(this.qid);
  return question ? question.text : "";
};

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.home.validQid = function() {
  return findQuestion(this.qid);  
};

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.home.events({"click #question":function () {  
  var buttons = {
    ok:function() {
      var question = { qid:newQid(), text:$("#question_text").val() };
      Questions.insert(question);
      home.qid(question.qid);
      home.qtext(question.text);
      home.answer().enable();      
      $(this).dialog('close');      
    },
    cancel:function() {
      $(this).dialog('close');            
    }
  };
  var html = "<textarea id='question_text'>enter it here</textarea>";
  //TODO: ok button enabled only if question entered
  var ask = $('<div>')
      .html('<div class="dialog">' + html + '</div>')    
      .dialog({
        autoOpen: false,
        width: "400",
        height: "230",
        title: "question",
        modal: true,
        buttons: buttons
      });
  ask.dialog('open');
  $("#question_text").select();
  
  
  
  //TODO: jQuery dialog. Modal.
  // if asked
  //   get qid and text from dialog
  //   insert Question in mongo
  //   paste qid into page
  //   paste text into page
  //   enable answer button
}});

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.home.events({"keyup #qid":function() {
  var question = findQuestion(home.qid());  
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
  var answer = { qid:home.qid(), text:"127" };
  Answers.insert(answer);
  //home.answer().disable();  // TEMP... TO SEE MULTIPLE
  home.reveal().enable();
  // jQuery dialog. Modal.
  // if answered
  //   home.answer().disable();
  //   home.reveal().enable();
}});

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.home.events({"click #reveal":function () {
  window.open("/reveal/" + home.qid(), "_blank");  
}});