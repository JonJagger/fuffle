
newPid = function() {
  return Random.hexString(4);  
};

// - - - - - - - - - - - - - - - - - - - - - - - - 

var page = {  
  pid:function(arg) {
    if (!arg) {
      return $("#pid").val();
    } else {
      $("#pid").val(arg);
    }
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.nib.events({"click #start":function () {
  var nib = { pid:newPid(), size:"6" };
  Nibs.insert(nib);
  page.pid(nib.pid);
  //page.join().enable();
}});

