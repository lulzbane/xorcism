(function (global) {
  var xorcism = global.xorcism;
  
  var Core = function(){
  };
  
  _p = Core.prototype;
  
  _p.init = function(){
    var inputEvent = xorcism.Device.getInputEvent();
    $('new-link').addEvent(inputEvent, function(){xorcism.Events.newGame()});
    $('credits-link').addEvent(inputEvent, function(){xorcism.Events.credits()});
    $('bg-credits').addEvent(inputEvent, function(){xorcism.Events.creditsBack()});
    xorcism.Storage.init();
    xorcism.Ghost.setup();
    xorcism.Game.setup();
    $('highscore-value').set('text', xorcism.Storage.getHighScore());
  };
   
  Core = _p;
  
  xorcism.Core = Core;
})(window);