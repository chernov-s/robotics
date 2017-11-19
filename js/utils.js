var Utils = (function () {
  return {
      randomInt: function( min, max ) {
          return Math.round(min + ( Math.random() * ( max - min ) ));
      }
  }
})();