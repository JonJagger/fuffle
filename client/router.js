
Router.map(function() { 
  this.route('home',   { path: '/' });  
  
  this.route('reveal', {
    path: '/reveal/:qid',
    data: function() { return { gid: this.params.gid }}
  });
  
});
