(function (global) {
  var ghostMetaData = { widthPercent : 29, heightPercent : 28, originXPercent : 13, originYPercent : 64,spriteWidth : 200, spriteHeight : 350, spriteScaleFactore : 0.7, domPoolNumber : 10, secondsUntilSaturation : 300, secondsUntilTerminalVelocity : 600, maxMSToTraverse: 3000, minMSToTraverse : 200, distanceRelativityFactor : 0.5 };
  var gameClock = 0;
  var ghostContainerCoords = { x : 0, y : 0};
  var ghostDomPool = [];
  var ghostData = {};
  var diagonalGameDistance = 0;
  var ghostContainer = $('bg-game');
  var gameContainer = $('content');
  var gameSize = { width : 0, height : 0 };
  
  var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  var Ghost = function(){
  };
  
  _p = Ghost.prototype;
  
  _p.setup = function(){
    gameSize.width = gameContainer.getSize().x;
    gameSize.height = gameContainer.getSize().y;
    diagonalGameDistance = Math.ceil(Math.sqrt((gameSize.width * gameSize.width)+(gameSize.height * gameSize.height)));
    ghostData.scale = Math.floor(((ghostMetaData.spriteScaleFactore * (((gameSize.height / 100) * ghostMetaData.heightPercent)/ghostMetaData.spriteHeight))*100))/100;
    ghostData.width = Math.ceil(ghostMetaData.spriteWidth * ghostData.scale);
    ghostData.height = Math.ceil(ghostMetaData.spriteHeight * ghostData.scale);
    for(var i = 0; i < ghostMetaData.domPoolNumber; i++){
      xorcism.Ghost.createGhost(i);
    }
  };
   
  _p.createGhost = function(index){
    var ghost = new Element('div', {
      'class': 'sprite',
      html: '',
      id: 'ghost-' + index,
      styles: {
        transform: 'scale(' + ghostData.scale + ', ' + ghostData.scale + ')',
        '-ms-transform': 'scale(' + ghostData.scale + ', ' + ghostData.scale + ')',
        '-webkit-transform': 'scale(' + ghostData.scale + ', ' + ghostData.scale + ')',
        display: 'none'
      }
    });
    var ghostHitBox = new Element('div', {'class': 'sprite-hitbox'});
    ghost.adopt(ghostHitBox);
    var inputEvent = xorcism.Device.getInputEvent();
    ghostHitBox.addEvent(inputEvent, function(event){xorcism.Ghost.Clicked(event);});
    ghostContainer.adopt(ghost);
    ghostDomPool.push({domElement : ghost, i : index, inUse : false, isBalloon : false, tween : {}, timeToDie : 0, destination : { x : 0, y : 0}, posX : 0, posY : 0, distance : 0, startDelayVariance : 750, minDelay : 200});
  }
   
  _p.UpdateGhosts = function(gameStartTime){
    if(xorcism.Game.isStarted()){
      var elapsedTime = Math.ceil((new Date().getTime() - gameStartTime) / 1000);
      if(elapsedTime > gameClock){
        gameClock = elapsedTime;
        var activeGhosts = xorcism.Ghost.getActiveGhosts();
        var ghostsNeeded = xorcism.Ghost.calculateNumNeededGhosts();
        if(activeGhosts < ghostsNeeded){
          for(var i = 0; i < (ghostsNeeded - activeGhosts); i++){
            xorcism.Ghost.activateNewGhost();
          }
        }
      }
    }
  };
  
  _p.calculateNumNeededGhosts = function(){
    if(ghostMetaData.secondsUntilSaturation > gameClock){
      var ghostsNeeded = Math.ceil((gameClock / ghostMetaData.secondsUntilSaturation)*ghostMetaData.domPoolNumber);
      return ghostsNeeded;
    }
    else
    {
      return ghostMetaData.domPoolNumber;
    }
  }
  
  _p.getActiveGhosts = function(){
    var actives = 0;
    Array.each(ghostDomPool, function(poolItem, index){if(poolItem.inUse){actives += 1;}});
    return actives;
  };
  
  _p.activateNewGhost = function(){
    for(var i = 0; i < ghostDomPool.length; i++){
      if(!ghostDomPool[i].inUse){
        ghostDomPool[i].inUse = true;
        ghostDomPool[i].i = i;
        xorcism.Ghost.initializeGhost(ghostDomPool[i]);
        break;
      }
    }
  };
  
  _p.initializeGhost = function(ghostObject, cleanUpOnly){
    cleanUpOnly = cleanUpOnly || false;
    ghostObject.tween = {};
    xorcism.Ghost.hideGhost(ghostObject);
    ghostObject.domElement.className = '';
    ghostObject.domElement.addClass('sprite');
    ghostObject.domElement.addClass('ghost');
    if(xorcism.Ghost.calculateNumNeededGhosts() > 1){
      if(getRandomInt(0, ghostMetaData.domPoolNumber) === 0){
        ghostObject.isBalloon = true;
        xorcism.Ghost.ghostToBalloon(ghostObject);
      }else{
        ghostObject.isBalloon = false;
        xorcism.Ghost.balloonToGhost(ghostObject);
      }
    }
    ghostObject.posX = Math.ceil((gameSize.width / 100) * ghostMetaData.originXPercent);
    ghostObject.posY = Math.ceil((gameSize.height / 100) * ghostMetaData.originYPercent);
    if(!cleanUpOnly){
      var destinationAngle = getRandomInt(0, 270);
      ghostObject.destination = xorcism.Ghost.convertAngleIntoXandY(destinationAngle);
      ghostObject.distance = xorcism.Ghost.calculateDistance({x : ghostObject.posX, y : ghostObject.posY}, ghostObject.destination);
      ghostObject.timeToDie = xorcism.Ghost.calculatetimeToDie(ghostObject);
      xorcism.Ghost.startGhost.delay(getRandomInt(ghostObject.minDelay, ghostObject.startDelayVariance), ghostObject);
    }
  };
  
  _p.startGhost = function(){
    var ghostObject = this;   
    ghostObject.timestamp = xorcism.Game.getGameStartTime();    
    ghostObject.tween = new Fx.Morph(ghostObject.domElement, {
      duration: ghostObject.timeToDie,
      transition: Fx.Transitions.linear,
      onComplete: function(ghostElement) { 
        xorcism.Ghost.ghostReachedEnd(ghostElement);
      }
    });
    var startWidth = 80;
    var endWidth = 200;
    var startHeight = 140;
    var endHeight = 350;
    ghostObject.domElement.setStyles({
      left : ghostObject.posX,
      top : ghostObject.posY,
      width : startWidth,
      height: startHeight
    });
    ghostObject.tween = new TWEEN.Tween( { x: ghostObject.posX, y: ghostObject.posY, width: startWidth, height: startHeight } )
      .to( { x:  ghostObject.destination.x, y: ghostObject.destination.y, width: endWidth, height: endHeight}, ghostObject.timeToDie )
      .onComplete(function() {
        xorcism.Ghost.ghostReachedEnd(ghostObject);
      })
      .onUpdate( function () {
        ghostObject.domElement.style.left = this.x + 'px';
        ghostObject.domElement.style.top = this.y + 'px';
        ghostObject.domElement.style.width = this.width + 'px';
        ghostObject.domElement.style.height = this.height + 'px';
      }).start();
    xorcism.Ghost.showGhost(ghostObject);
  };
  
  _p.ghostPopped = function(ghostObject){
    ghostObject.domElement.className = '';
    xorcism.Game.incrementCurrentScore();
    ghostObject.tween.stop();
    xorcism.Ghost.initializeGhost(ghostObject);
  };
  
  _p.ghostReachedEnd = function(ghostObject){
    if(ghostObject.timestamp === xorcism.Game.getGameStartTime()){
      if(ghostObject.isBalloon){
        xorcism.Ghost.initializeGhost(ghostObject);
      }
      else{
        xorcism.Ghost.ghostWins();
      }
    }
  };
  
  _p.ghostWins = function(){
    for(var i = 0; i < ghostDomPool.length; i++){
      xorcism.Ghost.initializeGhost(ghostDomPool[i], true);
      xorcism.Ghost.hideGhost(ghostDomPool[i]);
      ghostDomPool[i].inUse = false;
      ghostDomPool[i].isBalloon = false;
      ghostDomPool[i].tween = {};
      ghostDomPool[i].domElement.setStyles({
        left : 0,
        top : 0
      });
    }
    xorcism.Game.end();
  };
  
  _p.calculateDistance = function(startCoords, endCoords){
    var x, y = 0;
    if(startCoords.x > endCoords.x){
      x = startCoords.x - endCoords.x;
    }
    else{
      x = endCoords.x - startCoords.x;
    }
    if(startCoords.y > endCoords.y){
      y = startCoords.y - endCoords.y;
    }
    else{
      y = endCoords.y - startCoords.y;
    }
    return Math.ceil(Math.sqrt((x * x)+(y * y)));
  };
  
  _p.calculatetimeToDie = function(ghostObject){
  if(ghostObject.i == 5){
    var lol = 'wat';
  }
    var relativeDistance = (ghostObject.distance / (diagonalGameDistance * ghostMetaData.distanceRelativityFactor));
    var timeToDieDifference = ghostMetaData.maxMSToTraverse - ghostMetaData.minMSToTraverse;
    
   if(ghostMetaData.secondsUntilTerminalVelocity > gameClock){
      var timeToDie = ghostMetaData.maxMSToTraverse - Math.ceil(((gameClock / ghostMetaData.secondsUntilTerminalVelocity)*(timeToDieDifference*relativeDistance)));
      return timeToDie;
    }
    else
    {
      return ghostMetaData.minMSToTraverse;
    }
  };
  
  _p.convertAngleIntoXandY = function(angle){
    var coords = { x : 0, y : 0};
    if(angle < 91){
      coords.x = Math.floor((gameSize.width / 90) * angle);
      coords.y = 0;
    }
    else if(angle < 181){
      coords.x = gameSize.width;
      coords.y = Math.floor((gameSize.height / 90) * (angle - 90));;
    }
    else{
      coords.x = Math.floor((gameSize.width / 90) * (angle - 180));
      coords.y = gameSize.height;
    }
    return coords;
  };
  
  _p.showGhost = function(ghostObject){
    ghostObject.domElement.style.display = 'block';
  };
  
  _p.hideGhost = function(ghostObject){
    ghostObject.domElement.style.display = 'none';
  };
  
  _p.ghostToBalloon = function(ghostObject){
    ghostObject.domElement.className = '';
    ghostObject.domElement.addClass('sprite');
    ghostObject.domElement.addClass('balloon');
  };
  
  _p.balloonToGhost = function(ghostObject){
    ghostObject.domElement.className = '';
    ghostObject.domElement.addClass('sprite');
    ghostObject.domElement.addClass('ghost');
  };
  
  _p.setContainerCoords = function(){
    ghostContainerCoords.x = ghostContainer.offsetLeft;
    ghostContainerCoords.y = ghostContainer.offsetTop;
  };
    
  _p.setGameClock = function(time){
    gameClock = time;
  };
  
  _p.Clicked = function(event){
    var id = event.target.getParent().id;
    var ghostObject;
    for(var i = 0; i < ghostDomPool.length; i++){
      if(ghostDomPool[i].domElement.id === id){
        ghostObject = ghostDomPool[i];
      }
    }
    if(!ghostObject.isBalloon){
      xorcism.Ghost.ghostPopped(ghostObject);
    }
    else{
      xorcism.Ghost.ghostWins();
    }
  };
   
  Ghost = _p;
  
  xorcism.Ghost = Ghost;
})(window);