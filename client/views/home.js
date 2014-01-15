
newQid = function() {
  // could iterate 1000 times looking for qid with
  // lowest entropy, eg AAABBB
  return Random.hexString(6);  
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
  answer:function() {
    return enabled($("#answer"));
  },
  reveal:function() {
    return enabled($("#reveal"));
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.home.events({"click #question":function () {
  var question = { qid:newQid(), text:"" };
  Questions.insert(question);
  home.qid(question.qid);
  home.answer().enable();
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
  var question = home.question();
  var answer = home.answer();
  if (home.qid() === "") {
    answer.disable();
  } else if (!Questions.findOne({ qid:home.qid() })) {
    answer.disable();
  } else {
    //TODO: show question text 
    answer.enable();
  }
}});

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.home.events({"click #answer":function () {
  // jQuery dialog. Modal.
  // if answered
  //   home.answer().disable();
  //   home.reveal().enable();
}});

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.home.events({"click #reveal":function () {
  //window.open("reveal/" + home.qid (), "_blank");  
}});