(function (global) {
  var xorcism = global.xorcism;
  var highscore = 0;
  
  var Storage = function(){
  };
  
  _p = Storage.prototype;
  
  _p.init = function(){
    if(localStorage["xorcism.score.high"] == null){
      localStorage["xorcism.score.high"] = highscore;
    }
    else{
      highscore = localStorage["xorcism.score.high"];
    }
  };
   
  _p.setHighScore = function(score){
    highscore = score;
    localStorage["xorcism.score.high"] = score;
  }
  
  _p.getHighScore = function(){
    return highscore;
  }
  
  Storage = _p;
  
  xorcism.Storage = Storage;
})(window);