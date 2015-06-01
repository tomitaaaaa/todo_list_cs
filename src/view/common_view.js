module.exports = (function(){

  var CommonView = function(){
        this.setup();
      };

  CommonView.prototype = {
    setup: function() {
      var _this = this;
      _this.$stage = document.getElementById('js-stage');
      _this.$stageInr = document.getElementById('js-stage-inr');
    },
    updateStage: function(aDom){
      var _this = this;
      while (_this.$stageInr.firstChild) {
        _this.$stageInr.removeChild(_this.$stageInr.firstChild);
      }
      _this.$stageInr.appendChild(aDom);
    },
    hideView: function(){
      var _this = this;

      _this.$stage.style.opacity = 0;
      _this.removeAllChild();
      return _this;
    },
    showView: function(){
      var _this = this;

      _this.$stage.style.opacity = 1;
      return _this;
    },
    removeAllChild: function(){
      var _this = this;
      while (_this.$stageInr.firstChild) {
        _this.$stageInr.removeChild(_this.$stageInr.firstChild);
      }
      return _this;
    }
  };

  return CommonView;

})();