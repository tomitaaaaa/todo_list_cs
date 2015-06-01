module.exports = (function(){

  var CommonView = require('./common_view'),
      DetailView = function(){};

  DetailView.prototype = new CommonView();

  _.extend(DetailView.prototype, {
    $detailStage: null,
    renderDetail: function(aData,callback){
      var _this = this;

      _this.$detailStage = _this.createElement(aData);


      callback = callback || function(){};
      _this.setEvent();
      _this.updateStage(_this.$detailStage);

      callback.call(_this,_this.$detailStage);
    },
    createElement: function(aData){
      var _this = this,
          _wrap = document.createElement('div'),
          innerHtml = '';

      innerHtml += '<div class="detail">';
      innerHtml += '<h1 class="detail___ttl">'+aData.title+'</h1>';
      innerHtml += '<p class="detail__limit">'+aData.limit+'<span class="detail__status">【'+aData.status+'】</span></p>';
      innerHtml += '<div class="detail__text">';
      innerHtml += '<p>'+ _this.replaceText(aData.text) +'</p>';
      innerHtml += '</div>';
      innerHtml += '<div class="detail__action">';
      innerHtml += '<button class="js-btn-toggle detail__action--toggle">'+_this.getStatusLabel(aData.status)+'</button>';
      innerHtml += '<button class="js-btn-edit detail__action--edit">編集</button>';
      innerHtml += '<button class="js-btn-cancel detail__action--cancel">戻る</button>';
      innerHtml += '</div>';
      innerHtml += '</div>';
      _wrap.innerHTML = innerHtml;

      return _wrap;
    },
    setEvent: function(){
      var _this = this;
      _this.$btnToggle = _this.$detailStage.getElementsByClassName('js-btn-toggle')[0],
      _this.$btnEdit = _this.$detailStage.getElementsByClassName('js-btn-edit')[0];
      _this.$btnCancel = _this.$detailStage.getElementsByClassName('js-btn-cancel')[0];
    },
    bind: function(aEvent, aHandler){
      var _this = this;
      if(aEvent === 'toggle'){
        _this.$btnToggle.addEventListener('click', function(evt){
          aHandler();
        });
      } else if(aEvent === 'edit') {
        _this.$btnEdit.addEventListener('click', function(evt){
          aHandler();
        });
      } else if(aEvent === 'cancel') {
        _this.$btnCancel.addEventListener('click', function(evt){
          aHandler();
        });
      }
    },
    replaceText: function(str){
      return str.replace('\n', '<br>');
    },
    getStatusLabel: function(aStatus){
      return aStatus === 'unresolved' ? '解決済にする': '未解決に戻す';
    },
    setStatusBtn: function(aStatus){
      var _this = this;
      _this.$btnToggle.innerHTML = _this.getStatusLabel(aStatus);
    },
    showStage: function(){
      this.$detailStage.style.display = 'block';
      this.$detailStage.style.opacity = 1;
      return this;
    },
    hideStage: function(){
      this.$detailStage.style.opacity = 0;
      this.$detailStage.style.display = 'none';
      this.clearValue();
      return this;
    }
  });

  return DetailView;

})();