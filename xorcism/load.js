(function () {
  var progressLoaded = 0;
  var progBarTotalWidth = 50;
  var filesToLoad = ["device.js", "scale.js", "state.js", "view.js", "tween.min.js", "ghost.js", "storage.js", "game.js", "events.js", "core.js"];
  var progBarElement = $('preloader-progbar');
  
  yepnope({
    load: filesToLoad,
    callback: function (url, result, key) {
      switch(url){
        case "core.js": 
            window.addEvent('domready', function() {
              var xorcism = window.xorcism;

              
              window.addEvent('resize', function(){
                xorcism.Scale.setScale();
              });

              //Fire it when the page first loads:
              xorcism.Scale.setScale();
              $('preloader').style.display = 'none';
              xorcism.Core.init();
            });
            window.addEvent('touchmove', function(e) {
              e = e || window.event;
              if (e.preventDefault)
                  e.preventDefault();
              e.returnValue = false;  
            });
          break;
        default:
          progressLoaded = Math.ceil((progBarTotalWidth / filesToLoad.length * (key.toInt() + 1)));        
          progBarElement.style.width = progressLoaded + '%';
          break;
      }
    }
  });
})();