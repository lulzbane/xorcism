(function (global) {
  var xorcism = global.xorcism;
  var body = $(document.body); //Cache this for performance
  var mode = 'desktop';
  
  var Scale = function(){
  };
  
  _p = Scale.prototype;
   
  _p.setScale = function() {
    var scaleSource = window.getSize().y,
		scaleFactor = 0.25,                     
		maxScale = 130,
		minScale = 30;
    
    if(window.getSize().x < scaleSource){
      scaleSource = window.getSize().x;
    }
    
    var mql = window.matchMedia("(orientation: portrait)");
    
    if(xorcism.Device.isMobile()){
      scaleFactor = 0.25;   
      if(mql.matches){
        mode = 'm-portrait';
         //Tweak these values to taste
        scaleSource = window.getSize().x;
      }
      else{
        mode = 'm-landscape';
        scaleSource = window.getSize().y;
      }
    }
    
		var fontSize = scaleSource * scaleFactor; //Multiply the width of the body by the scaling factor:
    
    if (fontSize > maxScale) fontSize = maxScale;
    if (fontSize < minScale) fontSize = minScale; //Enforce the minimum and maximums
    
    var main = $('main');
    if(xorcism.Device.isMobile()){
      if(mql.matches){
        main.setStyle('width', window.getSize().x);
        main.setStyle('height', window.getSize().y); 
      }
      else
      {
        main.setStyle('height', window.getSize().x);
        main.setStyle('width', window.getSize().y);
      }
    }
    window.scrollTo(0, 0);
		body.setStyle('font-size', fontSize + '%');
    this.setBleedAreas();
	}
  
  _p.setBleedAreas = function(){
    var widthRatio = 40;
    var heightRatio = 71;
    var width = window.getSize().x;
    var height = window.getSize().y;

    if(mode === 'm-landscape'){
      var temp = width;
      width = height;
      height = temp;
    }
    var heightAspect = height / heightRatio;
    var gameWidth = heightAspect * widthRatio;
    var extraWidthHalved = Math.ceil((width - gameWidth) / 2);
    
    $('bleed-left').setStyle('width', extraWidthHalved + 'px');
    $('bleed-right').setStyle('width', extraWidthHalved + 'px');
    $('content').setStyle('width', Math.ceil(gameWidth) + 'px');
    $('content').setStyle('left', extraWidthHalved + 'px');
  }
  
  Scale = _p;
  
  xorcism.Scale = Scale;
})(window);