(function (global) {
  var xorcism = global.xorcism;
  var requestAnimationFrame = requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || msRequestAnimationFrame || oRequestAnimationFrame;
  var gameStartedTime = 0;
  var gameScore = 0;
  var gameStarted = false;
  var scoreContainer = $('current-score-value');
  
  var Game = function(){
  };
  
  _p = Game.prototype;
   
  _p.setup = function(){
  };
  
  _p.start = function(){
    gameStartedTime = new Date().getTime();
    xorcism.Ghost.setContainerCoords();
    $('result-highscore-container').style.display = 'none';
    $('result-container').style.display = 'none';
    xorcism.Ghost.setGameClock(0);
    gameScore = 0;
    scoreContainer.set('text', gameScore);
    gameStarted = true;
    requestAnimationFrame(xorcism.Game.loop);
  };
  
  _p.end = function(){
    xorcism.View.changeGameState('home');
    if(gameScore > xorcism.Storage.getHighScore()){
      xorcism.Storage.setHighScore(gameScore);
      $('result-highscore-container').style.display = 'block';
      $('highscore-value').set('text', gameScore);
    }
    gameStarted = false;
    $('result-container').style.display = 'block';
    $('result-value').set('text', gameScore);
  };
  
  _p.loop = function() {  
    if(gameStarted){
      xorcism.Ghost.UpdateGhosts(gameStartedTime);
      TWEEN.update();
      requestAnimationFrame(xorcism.Game.loop);
    }
  };
  
  _p.isStarted = function() {  
    return gameStarted;
  };
  
  _p.incrementCurrentScore = function() {
    gameScore += 1;
    scoreContainer.set('text', gameScore);
  };
  
  _p.getGameStartTime = function(){
    return gameStartedTime;
  };
  
  Game = _p;
  
  xorcism.Game = Game;
})(window);