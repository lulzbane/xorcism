(function (global) {
  var xorcism = global.xorcism;
  
  var State = function(){
  };
  
  _p = State.prototype;
  
  var gameScreens = [{ state : 'home', view : $('bg-home')}, { state : 'game', view : $('bg-game')}, { state : 'credits', view : $('bg-credits')}];
  _p.gameState = 'home';
   
  _p.getAllViews = function(){
    return gameScreens;
  };
   
  _p.getView = function(stateName){
    for(var i = 0; i < gameScreens.length; i++){
      if(stateName === gameScreens[i].state){
        return gameScreens[i].view;
      }
    }
    return null;
  };
   
  State = _p;
  
  xorcism.State = State;
})(window);