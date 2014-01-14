
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

Template.nib.events({"click #start":function () {
  var nib = { pid:newPid(), size:"6" };
  Nibs.insert(nib);
  page.pid(nib.pid);
  page.join().enable();
}});

