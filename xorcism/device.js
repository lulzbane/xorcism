(function (global) {
  var xorcism = global.xorcism;
  
  var Device = function(){
  };
  
  _p = Device.prototype;
   
  _p.isMobile = function(){
    var DeviceDetection = {
      Android: function() {
          return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function() {
          return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function() {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function() {
          return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function() {
          return navigator.userAgent.match(/IEMobile/i);
      },
      mobile: function() {
          return (DeviceDetection.Android() || DeviceDetection.BlackBerry() || DeviceDetection.iOS() || DeviceDetection.Opera() || DeviceDetection.Windows());
      }
    };
    
    if(DeviceDetection.mobile() === null){
      return false;
    }
    
    return DeviceDetection.mobile();
  }
  
  _p.getInputEvent = function(){
    var inputEvent = 'click';
    if(xorcism.Device.isMobile()){
      inputEvent = 'touchstart';
    }
    return inputEvent;
  }
  
  Device = _p;
  
  xorcism.Device = Device;
})(window);