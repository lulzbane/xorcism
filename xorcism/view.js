(function (global) {
  var xorcism = global.xorcism;
  
  var View = function(){
  };
  
  _p = View.prototype;
  
  _p.changeGameState = function(state){
    var view = xorcism.State.getView(state);
    if(view !== null){
      xorcism.State.gameState = state;
      xorcism.View.changeToView(view);
    }
  };
  
  _p.changeToView = function(view){
    var views = xorcism.State.getAllViews();
    for(var i = 0; i < views.length; i++){
      if(views[i].view === view){
        xorcism.View.showView(views[i].view);
      }  
    }
    for(var i = 0; i < views.length; i++){
      if(views[i].view !== view){
        xorcism.View.hideView(views[i].view);
      }
    }
  };
  
  _p.showView = function(view){
    view.style.display = 'block';
  };
  
  _p.hideView = function(view){
    view.style.display = 'none';
  };
   
  View = _p;
  
  xorcism.View = View;
})(window);