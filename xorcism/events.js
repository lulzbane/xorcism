(function (global) {
  var xorcism = global.xorcism;
  
  var Events = function(){
  };
  
  _p = Events.prototype;
  
  _p.newGame = function(){
    xorcism.View.changeGameState('game');
    xorcism.Game.start();
  };
  
  _p.credits = function(){
    xorcism.View.changeGameState('credits');
  };
  
  _p.creditsBack = function(){
    xorcism.View.changeGameState('home');
  };
   
  Events = _p;
  
  xorcism.Events = Events;
})(window);