
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
