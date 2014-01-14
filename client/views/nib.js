
newPid = function() {
  return Random.hexString(6);  
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
  var start = page.start();
  var size = page.size();  
  if (size !== "" && !isNaN(size)) {
    start.enable();
  } else {
    start.disable();
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
  var join = page.join();
  var pid = page.pid();  
  if (!Nibs.findOne({ pid:pid })) {
    join.disable();
  } else {
    join.enable();
  }
}});

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.nib.events({"click #join":function () {
  var pid = page.pid();
  window.open("board/" + pid, "_blank");  
}});

