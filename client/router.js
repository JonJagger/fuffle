
Router.map(function() { 
  this.route('home',   { path: '/' });  
  
  this.route('reveal', {
    path: '/reveal/:qid',
    data: function() { return { qid: this.params.qid }}
  });
  
});
