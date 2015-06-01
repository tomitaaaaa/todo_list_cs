module.exports = (function(){

  var TodoModel = require('../model/todo_model.js'),
    Controller = function(aLists, aListView, aInputView, aDetailView) {
    this.lists = aLists;
    this.listView = aListView;
    this.inputView = aInputView;
    this.detailView = aDetailView;
    this.setup();
  };

  Controller.prototype = {
    setup: function() {
      var _this = this;


      _this.inputView.hideStage();

      // input view

      // 保存
      _this.inputView.bind('save', function(val){
        _this.lists.create(val);
        _this.inputView.hideStage();
        _this.showListView();
      });

      // 編集キャンセル
      _this.inputView.bind('cancel', function(){
        _this.inputView.hideStage();
        _this.showListView();
      });


      // 新規追加ボタン
      _this.listView.bind('add', function(){
        _this.listView.hideView();
        _this.showInputView();
      });


      _this.showListView();
    },
    showListView: function(){
      var _this = this;
      // listview
      _this.lists.load(function(){
        if(_this.lists.data.length > 0){
          _this.listView.renderList(_this.lists.data, function(){

            _this.listView.bind('list_detail', function(aId){
              _this.showDetailView(_this.lists.getIndex(parseInt(aId),10));
            });


          });
          _this.listView.showView();
        } else {
          _this.listView.renderEmpty();
        }
      });
    },
    showInputView: function(data){
      var _this = this;
      if(data){
        _this.inputView.setDefault(data);
      }
      _this.inputView.showStage();
      _this.inputView.showView();
    },
    showDetailView: function(aIndex){
      var _this = this,
          data = _this.lists.data[aIndex];
      // detail view

      _this.detailView.renderDetail(data, function(){

        // ステータス更新ボタン
        _this.detailView.bind('toggle', function(){

          // ステータス更新
          var toggleData = _this.lists.toggleStatus(data);
          _this.detailView.renderDetail(toggleData);

          //
          _this.lists.create(toggleData, function(){
            _this.detailView.hideView();
            _this.detailView.setStatusBtn(toggleData.status);
            _this.showListView();
          });
        });

        // 編集ビューへ
        _this.detailView.bind('edit', function(){
          _this.detailView.hideView();
          _this.showInputView(data);
        });

        // 一覧ビューへ
        _this.detailView.bind('cancel', function(){
          _this.detailView.hideView();
          _this.showListView();
        });
      });
    }
  };

  return Controller;

})();