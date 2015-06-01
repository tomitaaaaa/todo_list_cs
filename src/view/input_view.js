module.exports = (function(){

  var CommonView = require('./common_view'),
      InputView = function(){
        this.setup();
      };

  InputView.prototype = new CommonView();

  _.extend(InputView.prototype, {
    $inputStage: null,
    setup: function() {
      var _this = this;

      _this.$inputStage = document.getElementById('js-stage_input');

      _this.$ttl = document.getElementById('js-ttl');
      _this.$limit = document.getElementById('js-limit');
      _this.$text = document.getElementById('js-text');

      _this.$id = document.getElementById('js-id');
      _this.$status = document.getElementById('js-status');
      _this.$createDate = document.getElementById('js-create_date');

      _this.$btnAdd = document.getElementById('js-btn_add');
      _this.$btnCancel = document.getElementById('js-btn_cancel');
    },
    clearValue: function(){
      var _this = this;
      _this.$ttl.value = '';
      _this.$limit.value = '';
      _this.$text.value = '';
      _this.$id.value = '';
      _this.$status.value = '';
      _this.$createDate.value = '';
    },
    setDefault: function(data){
      var _this = this;
      _this.$ttl.value = data.title;
      _this.$limit.value = data.limit;
      _this.$text.value = data.text;
      _this.$id.value = data.todo_id;
      _this.$status.value = data.status;
      _this.$createDate.value = data.createDate;
    },
    bind: function(aEvent, aHandler){
      var _this = this;

        if(aEvent === 'save'){
          _this.$btnAdd.addEventListener('click', function(evt){
            aHandler(_this.getValue());
          });
        }

        if(aEvent === 'cancel'){
          _this.$btnCancel.addEventListener('click', function(evt){
            aHandler();
          });
        }

    },
    getValue: function(){
      var _this = this;
      return {
        title: _this.$ttl.value || '未記入',
        limit: _this.$limit.value || '未記入',
        text: _this.$text.value || '未記入',
        todo_id: _this.$id.value || '',
        status: _this.$status.value || '',
        createDate: _this.$createDate.value || ''
      };
    },
    showStage: function(){
      this.$inputStage.style.display = 'block';
      this.$inputStage.style.opacity = 1;
      return this;
    },
    hideStage: function(){
      this.$inputStage.style.opacity = 0;
      this.$inputStage.style.display = 'none';
      this.clearValue();
      return this;
    }
  });

  return InputView;

})();