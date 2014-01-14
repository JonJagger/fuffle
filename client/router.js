
Router.map(function() { 
  this.route('nib', { path: '/' });
  
  this.route('board', {
    path: '/board/:pid',
    data: function() {
      return {
         pid: this.params.pid
      }
    }
  });
  
});
