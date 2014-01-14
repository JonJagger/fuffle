
newPid = function() {
  return Random.hexString(4);  
};

// - - - - - - - - - - - - - - - - - - - - - - - - 

var enableDisable = function(button) {
  button.enable = function() {
    this.removeAttr("disabled");
  };
  button.disable = function() {
    this.attr("disabled", "disabled");
  };
  return button;
};

// - - - - - - - - - - - - - - - - - - - - - - - - 

var page = {
  size:function() {
    return $("#size").val();
  },
  start:function() {
    return enableDisable($("#start"));    
  },
  pid:function(arg) {
    if (!arg) {
      return $("#pid").val();
    } else {
      $("#pid").val(arg);
    }
  },
  join:function() {
    return enableDisable($("#join"));
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.nib.events({"keyup #size": function() {
  var size = page.size();
  if (size !== "" && !isNaN(size)) {
    page.start().enable();
  } else {
    page.start().disable();
  }
}});

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.nib.events({"click #start":function () {
  var nib = { pid:newPid(), size:page.size() };
  Nibs.insert(nib);
  page.pid(nib.pid);
  page.join().enable();
}});

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.nib.events({"keyup #pid":function() {
  var pid = page.pid();  
  //var x = Nibs.find({});
  //alert(EJSON.stringify(x));  
  if (!Nibs.findOne({ pid:pid })) {
    page.join().disable();
  } else {
    // never gets to here
    page.join().enable();
  }
}});

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.nib.events({"click #join":function () {
  // Needs router.js
  //window.open("team/" + gid + "/" + color + "/" + game.mode, "_blank");  
}});

