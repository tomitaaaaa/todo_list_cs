(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"../model/todo_model.js":3}],2:[function(require,module,exports){
module.exports = (function(){

  var TodoListModel = function(){
    this.data = [];
  };

  TodoListModel.prototype = {
    create: function(aData,callback){
      var _this = this,
          data = {
            title: aData.title || '',
            limit: aData.limit || '',
            text: aData.text || '',
            todo_id: aData.todo_id || _this.getIncrement(),
            status: aData.status || 'unresolved',
            createDate: aData.createDate || _this.getCreateDate()
          };
      _this.save(data,callback);
    },
    save: function(aData,callback){
      callback = callback || function(){};

      var _this = this,
          todoIndex = _this.getIndex(aData.todo_id);

      if(todoIndex > -1){
        _this.data[todoIndex] = aData;
      } else {
        _this.data.push(aData);
      }
      window.localStorage.setItem('APP_TODO_LIST', JSON.stringify(_this.data));
      callback.call(_this, aData);
    },
    load: function(callback){
      callback = callback || function(){};
      var _this = this,
          stData = JSON.parse(window.localStorage.getItem('APP_TODO_LIST'));
      _this.data = [];
      if(stData){
        for(var i = 0,len = stData.length; i < len; i++){
          _this.data.push(stData[i]);
        }
      }
      callback.call(_this);
    },
    getIndex: function(aId){
      return _.findIndex(this.data, {todo_id: aId-0});
    },
    getIncrement: function(){
      return this.data.length + 1;
    },
    toggleStatus: function(aData){
      aData.status = aData.status === 'resolved' ? 'unresolved' : 'resolved';
      return aData;
    },
    getCreateDate: function(){
      return new Date().toLocaleString();
    }

  };

  return TodoListModel;

})();
},{}],3:[function(require,module,exports){
module.exports = (function(){

  var TodoModel = function(aId,aData) {
    this.setup(aId);
    this.update(aData);
  };

  TodoModel.prototype = {
    setup: function(aId){
      var _this = this;
      _this.data = {
        todo_id: aId,
        status: 'unresolved',
        createDate: _this.getCreateDate()
      }
    },
    update: function(data){
      var _this = this;
      for(var key in data){
        _this.data[key] = data[key];
      }
    },
    toggleStatus: function(){
      this.data.status = this.data.status === 'resolved' ? 'unresolved' : 'resolved';
      return this.data;
    },
    getCreateDate: function(){
      return new Date().toLocaleString();
    }
  };

  return TodoModel;

})();
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{"./common_view":4}],6:[function(require,module,exports){
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
},{"./common_view":4}],7:[function(require,module,exports){
module.exports = (function(){

  var CommonView = require('./common_view'),
      ListView = function(){
        this.setUp();
      };

  ListView.prototype = new CommonView();

  _.extend(ListView.prototype, {
    $listStage: null,
    setUp: function(){
      this.$listStage = document.createElement('div');
      this.$listStage.id = 'js-list_stage';
      this.$listStage.className = 'stage__list';

      this.$nav = this.createNavElement();
    },
    renderEmpty: function(callback){
      var _this = this,
          dom = document.createElement('p'),
          textNode = document.createTextNode('保存されたデータがありません。'),
          fragment = document.createDocumentFragment();;

      callback = callback || function(){};
      dom.className = 'todo__nodata';
      dom.appendChild(textNode);

      fragment.appendChild(_this.$nav);
      fragment.appendChild(dom);

      _this.updateStage(fragment);
      callback.call(_this,fragment);
    },
    renderList: function(aData,callback){
      var _this = this,
          fragment = document.createDocumentFragment();

      callback = callback || function(){};

      while (_this.$listStage.firstChild) {
        _this.$listStage.removeChild(_this.$listStage.firstChild);
      }

      for(var i = 0,len = aData.length; i < len; i++){
        var element = _this.createTodoElement(aData[i]);
        _this.$listStage.appendChild(element);
      }

      fragment.appendChild(_this.$nav);
      fragment.appendChild(_this.$listStage);

      _this.updateStage(fragment);
      callback.call(_this,fragment);
    },
    createTodoElement: function(aData){
      var _this = this,
          _wrap = document.createElement('article'),
          _inr = document.createElement('div'),
          _ttl = document.createElement('h1'),
          _limit = document.createElement('p');

      aData = _this.validateData(aData);

      _wrap.className = 'todo__item is--'+aData.status;
      _inr.className = 'todo__item__inr';
      _ttl.className = 'todo__item__ttl';
      _limit.className = 'todo__item__limit';

      _wrap.setAttribute('data-id',aData.todo_id);

      _ttl.appendChild(document.createTextNode(aData.title));
      _limit.appendChild(document.createTextNode(aData.limit));

      _wrap.appendChild(_inr).appendChild(_ttl);
      _inr.appendChild(_limit);

      return _wrap;
    },
    createNavElement: function(){
      var _this = this,
          $navWrap = document.createElement('div'),
          $btnAdd = document.createElement('button'),
          $btnSortAll = document.createElement('button'),
          $btnSortUnresolved = document.createElement('button'),
          $btnSortResolved = document.createElement('button');

      $navWrap.className = 'stage__nav';
      $btnAdd.className = 'stage__nav--add';
      $btnSortAll.className = 'stage__nav--all';
      $btnSortUnresolved.className = 'stage__nav--unresolved';
      $btnSortResolved.className = 'stage__nav--resolved';

      $btnAdd.appendChild(document.createTextNode('追加する'));
      $btnSortAll.appendChild(document.createTextNode('全て'));
      $btnSortUnresolved.appendChild(document.createTextNode('未解決'));
      $btnSortResolved.appendChild(document.createTextNode('解決済'));

      _this.$btnAdd = $btnAdd;


      // 簡易的な絞り込み機能
      $btnSortAll.addEventListener('click' , function(){
        _this.sortList('all');
      }, false);

      $btnSortUnresolved.addEventListener('click' , function(){
        _this.sortList('unresolved');
      }, false);

      $btnSortResolved.addEventListener('click' , function(){
        _this.sortList('resolved');
      }, false);


      $navWrap.appendChild($btnAdd);
      $navWrap.appendChild($btnSortAll);
      $navWrap.appendChild($btnSortUnresolved);
      $navWrap.appendChild($btnSortResolved);

      return _this.$nav = $navWrap;
    },
    sortList(aPattern){
      var _this = this,
      $list = this.$listStage.getElementsByClassName('todo__item'),
      $target = this.$listStage.getElementsByClassName('is--'+aPattern);

      if(aPattern === 'all' || aPattern === 'undefined' || !aPattern){
        _.each($list, function($ele){
          $ele.style.display = 'block';
        });

      } else {
        _.each($list, function($ele){
          $ele.style.display = 'none';
        });
        _.each($target, function($ele){
          $ele.style.display = 'block';
        });
      }
    },
    bind: function(aEvent, aHandler){
      var _this = this;
      if(aEvent === 'add'){
        _this.$btnAdd.addEventListener('click', function(){
          aHandler();
        });
      }

      if(aEvent === 'list_detail'){
        var $list = _this.$listStage.getElementsByClassName('todo__item');
        _.each($list, function($ele){
          $ele.addEventListener('click', function(evt){
            aHandler(this.getAttribute('data-id'));
          }, false);
        });
      }

    },
    validateData: function(aData){
      return data = {
        title: aData.title || '未記入',
        limit: aData.limit || '未記入',
        text: aData.text || '未記入',
        todo_id: aData.todo_id,
        status: aData.status,
        createDate: aData.createDate
      };
    }
  });

  return ListView;

})();
},{"./common_view":4}],8:[function(require,module,exports){

;(function(){
  'use strict';

  var ListView = require('./view/list_view'),
      InputView = require('./view/input_view'),
      DetailView = require('./view/detail_view'),
      TodoListModel = require('./model/todo_list_model'),
      Controller = require('./controller/controller');



  var lists = new TodoListModel(),
      listView = new ListView(),
      inputView = new InputView(),
      detailView = new DetailView(),
      controller = new Controller(lists,listView,inputView,detailView);


})();

},{"./controller/controller":1,"./model/todo_list_model":2,"./view/detail_view":5,"./view/input_view":6,"./view/list_view":7}]},{},[8])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29udHJvbGxlci9jb250cm9sbGVyLmpzIiwic3JjL21vZGVsL3RvZG9fbGlzdF9tb2RlbC5qcyIsInNyYy9tb2RlbC90b2RvX21vZGVsLmpzIiwic3JjL3ZpZXcvY29tbW9uX3ZpZXcuanMiLCJzcmMvdmlldy9kZXRhaWxfdmlldy5qcyIsInNyYy92aWV3L2lucHV0X3ZpZXcuanMiLCJzcmMvdmlldy9saXN0X3ZpZXcuanMiLCJzcmMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpe1xuXG4gIHZhciBUb2RvTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbC90b2RvX21vZGVsLmpzJyksXG4gICAgQ29udHJvbGxlciA9IGZ1bmN0aW9uKGFMaXN0cywgYUxpc3RWaWV3LCBhSW5wdXRWaWV3LCBhRGV0YWlsVmlldykge1xuICAgIHRoaXMubGlzdHMgPSBhTGlzdHM7XG4gICAgdGhpcy5saXN0VmlldyA9IGFMaXN0VmlldztcbiAgICB0aGlzLmlucHV0VmlldyA9IGFJbnB1dFZpZXc7XG4gICAgdGhpcy5kZXRhaWxWaWV3ID0gYURldGFpbFZpZXc7XG4gICAgdGhpcy5zZXR1cCgpO1xuICB9O1xuXG4gIENvbnRyb2xsZXIucHJvdG90eXBlID0ge1xuICAgIHNldHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cblxuICAgICAgX3RoaXMuaW5wdXRWaWV3LmhpZGVTdGFnZSgpO1xuXG4gICAgICAvLyBpbnB1dCB2aWV3XG5cbiAgICAgIC8vIOS/neWtmFxuICAgICAgX3RoaXMuaW5wdXRWaWV3LmJpbmQoJ3NhdmUnLCBmdW5jdGlvbih2YWwpe1xuICAgICAgICBfdGhpcy5saXN0cy5jcmVhdGUodmFsKTtcbiAgICAgICAgX3RoaXMuaW5wdXRWaWV3LmhpZGVTdGFnZSgpO1xuICAgICAgICBfdGhpcy5zaG93TGlzdFZpZXcoKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyDnt6jpm4bjgq3jg6Pjg7Pjgrvjg6tcbiAgICAgIF90aGlzLmlucHV0Vmlldy5iaW5kKCdjYW5jZWwnLCBmdW5jdGlvbigpe1xuICAgICAgICBfdGhpcy5pbnB1dFZpZXcuaGlkZVN0YWdlKCk7XG4gICAgICAgIF90aGlzLnNob3dMaXN0VmlldygpO1xuICAgICAgfSk7XG5cblxuICAgICAgLy8g5paw6KaP6L+95Yqg44Oc44K/44OzXG4gICAgICBfdGhpcy5saXN0Vmlldy5iaW5kKCdhZGQnLCBmdW5jdGlvbigpe1xuICAgICAgICBfdGhpcy5saXN0Vmlldy5oaWRlVmlldygpO1xuICAgICAgICBfdGhpcy5zaG93SW5wdXRWaWV3KCk7XG4gICAgICB9KTtcblxuXG4gICAgICBfdGhpcy5zaG93TGlzdFZpZXcoKTtcbiAgICB9LFxuICAgIHNob3dMaXN0VmlldzogZnVuY3Rpb24oKXtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAvLyBsaXN0dmlld1xuICAgICAgX3RoaXMubGlzdHMubG9hZChmdW5jdGlvbigpe1xuICAgICAgICBpZihfdGhpcy5saXN0cy5kYXRhLmxlbmd0aCA+IDApe1xuICAgICAgICAgIF90aGlzLmxpc3RWaWV3LnJlbmRlckxpc3QoX3RoaXMubGlzdHMuZGF0YSwgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgX3RoaXMubGlzdFZpZXcuYmluZCgnbGlzdF9kZXRhaWwnLCBmdW5jdGlvbihhSWQpe1xuICAgICAgICAgICAgICBfdGhpcy5zaG93RGV0YWlsVmlldyhfdGhpcy5saXN0cy5nZXRJbmRleChwYXJzZUludChhSWQpLDEwKSk7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgX3RoaXMubGlzdFZpZXcuc2hvd1ZpZXcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfdGhpcy5saXN0Vmlldy5yZW5kZXJFbXB0eSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHNob3dJbnB1dFZpZXc6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIGlmKGRhdGEpe1xuICAgICAgICBfdGhpcy5pbnB1dFZpZXcuc2V0RGVmYXVsdChkYXRhKTtcbiAgICAgIH1cbiAgICAgIF90aGlzLmlucHV0Vmlldy5zaG93U3RhZ2UoKTtcbiAgICAgIF90aGlzLmlucHV0Vmlldy5zaG93VmlldygpO1xuICAgIH0sXG4gICAgc2hvd0RldGFpbFZpZXc6IGZ1bmN0aW9uKGFJbmRleCl7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgIGRhdGEgPSBfdGhpcy5saXN0cy5kYXRhW2FJbmRleF07XG4gICAgICAvLyBkZXRhaWwgdmlld1xuXG4gICAgICBfdGhpcy5kZXRhaWxWaWV3LnJlbmRlckRldGFpbChkYXRhLCBmdW5jdGlvbigpe1xuXG4gICAgICAgIC8vIOOCueODhuODvOOCv+OCueabtOaWsOODnOOCv+ODs1xuICAgICAgICBfdGhpcy5kZXRhaWxWaWV3LmJpbmQoJ3RvZ2dsZScsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAvLyDjgrnjg4bjg7zjgr/jgrnmm7TmlrBcbiAgICAgICAgICB2YXIgdG9nZ2xlRGF0YSA9IF90aGlzLmxpc3RzLnRvZ2dsZVN0YXR1cyhkYXRhKTtcbiAgICAgICAgICBfdGhpcy5kZXRhaWxWaWV3LnJlbmRlckRldGFpbCh0b2dnbGVEYXRhKTtcblxuICAgICAgICAgIC8vXG4gICAgICAgICAgX3RoaXMubGlzdHMuY3JlYXRlKHRvZ2dsZURhdGEsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBfdGhpcy5kZXRhaWxWaWV3LmhpZGVWaWV3KCk7XG4gICAgICAgICAgICBfdGhpcy5kZXRhaWxWaWV3LnNldFN0YXR1c0J0bih0b2dnbGVEYXRhLnN0YXR1cyk7XG4gICAgICAgICAgICBfdGhpcy5zaG93TGlzdFZpZXcoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g57eo6ZuG44OT44Ol44O844G4XG4gICAgICAgIF90aGlzLmRldGFpbFZpZXcuYmluZCgnZWRpdCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgX3RoaXMuZGV0YWlsVmlldy5oaWRlVmlldygpO1xuICAgICAgICAgIF90aGlzLnNob3dJbnB1dFZpZXcoZGF0YSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOS4gOimp+ODk+ODpeODvOOBuFxuICAgICAgICBfdGhpcy5kZXRhaWxWaWV3LmJpbmQoJ2NhbmNlbCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgX3RoaXMuZGV0YWlsVmlldy5oaWRlVmlldygpO1xuICAgICAgICAgIF90aGlzLnNob3dMaXN0VmlldygpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gQ29udHJvbGxlcjtcblxufSkoKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpe1xuXG4gIHZhciBUb2RvTGlzdE1vZGVsID0gZnVuY3Rpb24oKXtcbiAgICB0aGlzLmRhdGEgPSBbXTtcbiAgfTtcblxuICBUb2RvTGlzdE1vZGVsLnByb3RvdHlwZSA9IHtcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKGFEYXRhLGNhbGxiYWNrKXtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgIHRpdGxlOiBhRGF0YS50aXRsZSB8fCAnJyxcbiAgICAgICAgICAgIGxpbWl0OiBhRGF0YS5saW1pdCB8fCAnJyxcbiAgICAgICAgICAgIHRleHQ6IGFEYXRhLnRleHQgfHwgJycsXG4gICAgICAgICAgICB0b2RvX2lkOiBhRGF0YS50b2RvX2lkIHx8IF90aGlzLmdldEluY3JlbWVudCgpLFxuICAgICAgICAgICAgc3RhdHVzOiBhRGF0YS5zdGF0dXMgfHwgJ3VucmVzb2x2ZWQnLFxuICAgICAgICAgICAgY3JlYXRlRGF0ZTogYURhdGEuY3JlYXRlRGF0ZSB8fCBfdGhpcy5nZXRDcmVhdGVEYXRlKClcbiAgICAgICAgICB9O1xuICAgICAgX3RoaXMuc2F2ZShkYXRhLGNhbGxiYWNrKTtcbiAgICB9LFxuICAgIHNhdmU6IGZ1bmN0aW9uKGFEYXRhLGNhbGxiYWNrKXtcbiAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKXt9O1xuXG4gICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgIHRvZG9JbmRleCA9IF90aGlzLmdldEluZGV4KGFEYXRhLnRvZG9faWQpO1xuXG4gICAgICBpZih0b2RvSW5kZXggPiAtMSl7XG4gICAgICAgIF90aGlzLmRhdGFbdG9kb0luZGV4XSA9IGFEYXRhO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3RoaXMuZGF0YS5wdXNoKGFEYXRhKTtcbiAgICAgIH1cbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnQVBQX1RPRE9fTElTVCcsIEpTT04uc3RyaW5naWZ5KF90aGlzLmRhdGEpKTtcbiAgICAgIGNhbGxiYWNrLmNhbGwoX3RoaXMsIGFEYXRhKTtcbiAgICB9LFxuICAgIGxvYWQ6IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKXt9O1xuICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICBzdERhdGEgPSBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnQVBQX1RPRE9fTElTVCcpKTtcbiAgICAgIF90aGlzLmRhdGEgPSBbXTtcbiAgICAgIGlmKHN0RGF0YSl7XG4gICAgICAgIGZvcih2YXIgaSA9IDAsbGVuID0gc3REYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICBfdGhpcy5kYXRhLnB1c2goc3REYXRhW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY2FsbGJhY2suY2FsbChfdGhpcyk7XG4gICAgfSxcbiAgICBnZXRJbmRleDogZnVuY3Rpb24oYUlkKXtcbiAgICAgIHJldHVybiBfLmZpbmRJbmRleCh0aGlzLmRhdGEsIHt0b2RvX2lkOiBhSWQtMH0pO1xuICAgIH0sXG4gICAgZ2V0SW5jcmVtZW50OiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGggKyAxO1xuICAgIH0sXG4gICAgdG9nZ2xlU3RhdHVzOiBmdW5jdGlvbihhRGF0YSl7XG4gICAgICBhRGF0YS5zdGF0dXMgPSBhRGF0YS5zdGF0dXMgPT09ICdyZXNvbHZlZCcgPyAndW5yZXNvbHZlZCcgOiAncmVzb2x2ZWQnO1xuICAgICAgcmV0dXJuIGFEYXRhO1xuICAgIH0sXG4gICAgZ2V0Q3JlYXRlRGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCk7XG4gICAgfVxuXG4gIH07XG5cbiAgcmV0dXJuIFRvZG9MaXN0TW9kZWw7XG5cbn0pKCk7IiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKXtcblxuICB2YXIgVG9kb01vZGVsID0gZnVuY3Rpb24oYUlkLGFEYXRhKSB7XG4gICAgdGhpcy5zZXR1cChhSWQpO1xuICAgIHRoaXMudXBkYXRlKGFEYXRhKTtcbiAgfTtcblxuICBUb2RvTW9kZWwucHJvdG90eXBlID0ge1xuICAgIHNldHVwOiBmdW5jdGlvbihhSWQpe1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIF90aGlzLmRhdGEgPSB7XG4gICAgICAgIHRvZG9faWQ6IGFJZCxcbiAgICAgICAgc3RhdHVzOiAndW5yZXNvbHZlZCcsXG4gICAgICAgIGNyZWF0ZURhdGU6IF90aGlzLmdldENyZWF0ZURhdGUoKVxuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICBmb3IodmFyIGtleSBpbiBkYXRhKXtcbiAgICAgICAgX3RoaXMuZGF0YVtrZXldID0gZGF0YVtrZXldO1xuICAgICAgfVxuICAgIH0sXG4gICAgdG9nZ2xlU3RhdHVzOiBmdW5jdGlvbigpe1xuICAgICAgdGhpcy5kYXRhLnN0YXR1cyA9IHRoaXMuZGF0YS5zdGF0dXMgPT09ICdyZXNvbHZlZCcgPyAndW5yZXNvbHZlZCcgOiAncmVzb2x2ZWQnO1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgICB9LFxuICAgIGdldENyZWF0ZURhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gbmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gVG9kb01vZGVsO1xuXG59KSgpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCl7XG5cbiAgdmFyIENvbW1vblZpZXcgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnNldHVwKCk7XG4gICAgICB9O1xuXG4gIENvbW1vblZpZXcucHJvdG90eXBlID0ge1xuICAgIHNldHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICBfdGhpcy4kc3RhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtc3RhZ2UnKTtcbiAgICAgIF90aGlzLiRzdGFnZUluciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1zdGFnZS1pbnInKTtcbiAgICB9LFxuICAgIHVwZGF0ZVN0YWdlOiBmdW5jdGlvbihhRG9tKXtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICB3aGlsZSAoX3RoaXMuJHN0YWdlSW5yLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgX3RoaXMuJHN0YWdlSW5yLnJlbW92ZUNoaWxkKF90aGlzLiRzdGFnZUluci5maXJzdENoaWxkKTtcbiAgICAgIH1cbiAgICAgIF90aGlzLiRzdGFnZUluci5hcHBlbmRDaGlsZChhRG9tKTtcbiAgICB9LFxuICAgIGhpZGVWaWV3OiBmdW5jdGlvbigpe1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgX3RoaXMuJHN0YWdlLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgX3RoaXMucmVtb3ZlQWxsQ2hpbGQoKTtcbiAgICAgIHJldHVybiBfdGhpcztcbiAgICB9LFxuICAgIHNob3dWaWV3OiBmdW5jdGlvbigpe1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgX3RoaXMuJHN0YWdlLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH0sXG4gICAgcmVtb3ZlQWxsQ2hpbGQ6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgd2hpbGUgKF90aGlzLiRzdGFnZUluci5maXJzdENoaWxkKSB7XG4gICAgICAgIF90aGlzLiRzdGFnZUluci5yZW1vdmVDaGlsZChfdGhpcy4kc3RhZ2VJbnIuZmlyc3RDaGlsZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBDb21tb25WaWV3O1xuXG59KSgpOyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCl7XG5cbiAgdmFyIENvbW1vblZpZXcgPSByZXF1aXJlKCcuL2NvbW1vbl92aWV3JyksXG4gICAgICBEZXRhaWxWaWV3ID0gZnVuY3Rpb24oKXt9O1xuXG4gIERldGFpbFZpZXcucHJvdG90eXBlID0gbmV3IENvbW1vblZpZXcoKTtcblxuICBfLmV4dGVuZChEZXRhaWxWaWV3LnByb3RvdHlwZSwge1xuICAgICRkZXRhaWxTdGFnZTogbnVsbCxcbiAgICByZW5kZXJEZXRhaWw6IGZ1bmN0aW9uKGFEYXRhLGNhbGxiYWNrKXtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIF90aGlzLiRkZXRhaWxTdGFnZSA9IF90aGlzLmNyZWF0ZUVsZW1lbnQoYURhdGEpO1xuXG5cbiAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKXt9O1xuICAgICAgX3RoaXMuc2V0RXZlbnQoKTtcbiAgICAgIF90aGlzLnVwZGF0ZVN0YWdlKF90aGlzLiRkZXRhaWxTdGFnZSk7XG5cbiAgICAgIGNhbGxiYWNrLmNhbGwoX3RoaXMsX3RoaXMuJGRldGFpbFN0YWdlKTtcbiAgICB9LFxuICAgIGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uKGFEYXRhKXtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgX3dyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICBpbm5lckh0bWwgPSAnJztcblxuICAgICAgaW5uZXJIdG1sICs9ICc8ZGl2IGNsYXNzPVwiZGV0YWlsXCI+JztcbiAgICAgIGlubmVySHRtbCArPSAnPGgxIGNsYXNzPVwiZGV0YWlsX19fdHRsXCI+JythRGF0YS50aXRsZSsnPC9oMT4nO1xuICAgICAgaW5uZXJIdG1sICs9ICc8cCBjbGFzcz1cImRldGFpbF9fbGltaXRcIj4nK2FEYXRhLmxpbWl0Kyc8c3BhbiBjbGFzcz1cImRldGFpbF9fc3RhdHVzXCI+44CQJythRGF0YS5zdGF0dXMrJ+OAkTwvc3Bhbj48L3A+JztcbiAgICAgIGlubmVySHRtbCArPSAnPGRpdiBjbGFzcz1cImRldGFpbF9fdGV4dFwiPic7XG4gICAgICBpbm5lckh0bWwgKz0gJzxwPicrIF90aGlzLnJlcGxhY2VUZXh0KGFEYXRhLnRleHQpICsnPC9wPic7XG4gICAgICBpbm5lckh0bWwgKz0gJzwvZGl2Pic7XG4gICAgICBpbm5lckh0bWwgKz0gJzxkaXYgY2xhc3M9XCJkZXRhaWxfX2FjdGlvblwiPic7XG4gICAgICBpbm5lckh0bWwgKz0gJzxidXR0b24gY2xhc3M9XCJqcy1idG4tdG9nZ2xlIGRldGFpbF9fYWN0aW9uLS10b2dnbGVcIj4nK190aGlzLmdldFN0YXR1c0xhYmVsKGFEYXRhLnN0YXR1cykrJzwvYnV0dG9uPic7XG4gICAgICBpbm5lckh0bWwgKz0gJzxidXR0b24gY2xhc3M9XCJqcy1idG4tZWRpdCBkZXRhaWxfX2FjdGlvbi0tZWRpdFwiPue3qOmbhjwvYnV0dG9uPic7XG4gICAgICBpbm5lckh0bWwgKz0gJzxidXR0b24gY2xhc3M9XCJqcy1idG4tY2FuY2VsIGRldGFpbF9fYWN0aW9uLS1jYW5jZWxcIj7miLvjgos8L2J1dHRvbj4nO1xuICAgICAgaW5uZXJIdG1sICs9ICc8L2Rpdj4nO1xuICAgICAgaW5uZXJIdG1sICs9ICc8L2Rpdj4nO1xuICAgICAgX3dyYXAuaW5uZXJIVE1MID0gaW5uZXJIdG1sO1xuXG4gICAgICByZXR1cm4gX3dyYXA7XG4gICAgfSxcbiAgICBzZXRFdmVudDogZnVuY3Rpb24oKXtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICBfdGhpcy4kYnRuVG9nZ2xlID0gX3RoaXMuJGRldGFpbFN0YWdlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWJ0bi10b2dnbGUnKVswXSxcbiAgICAgIF90aGlzLiRidG5FZGl0ID0gX3RoaXMuJGRldGFpbFN0YWdlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWJ0bi1lZGl0JylbMF07XG4gICAgICBfdGhpcy4kYnRuQ2FuY2VsID0gX3RoaXMuJGRldGFpbFN0YWdlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWJ0bi1jYW5jZWwnKVswXTtcbiAgICB9LFxuICAgIGJpbmQ6IGZ1bmN0aW9uKGFFdmVudCwgYUhhbmRsZXIpe1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIGlmKGFFdmVudCA9PT0gJ3RvZ2dsZScpe1xuICAgICAgICBfdGhpcy4kYnRuVG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZ0KXtcbiAgICAgICAgICBhSGFuZGxlcigpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZihhRXZlbnQgPT09ICdlZGl0Jykge1xuICAgICAgICBfdGhpcy4kYnRuRWRpdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2dCl7XG4gICAgICAgICAgYUhhbmRsZXIoKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYoYUV2ZW50ID09PSAnY2FuY2VsJykge1xuICAgICAgICBfdGhpcy4kYnRuQ2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZ0KXtcbiAgICAgICAgICBhSGFuZGxlcigpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcGxhY2VUZXh0OiBmdW5jdGlvbihzdHIpe1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKCdcXG4nLCAnPGJyPicpO1xuICAgIH0sXG4gICAgZ2V0U3RhdHVzTGFiZWw6IGZ1bmN0aW9uKGFTdGF0dXMpe1xuICAgICAgcmV0dXJuIGFTdGF0dXMgPT09ICd1bnJlc29sdmVkJyA/ICfop6PmsbrmuIjjgavjgZnjgosnOiAn5pyq6Kej5rG644Gr5oi744GZJztcbiAgICB9LFxuICAgIHNldFN0YXR1c0J0bjogZnVuY3Rpb24oYVN0YXR1cyl7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgX3RoaXMuJGJ0blRvZ2dsZS5pbm5lckhUTUwgPSBfdGhpcy5nZXRTdGF0dXNMYWJlbChhU3RhdHVzKTtcbiAgICB9LFxuICAgIHNob3dTdGFnZTogZnVuY3Rpb24oKXtcbiAgICAgIHRoaXMuJGRldGFpbFN0YWdlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgdGhpcy4kZGV0YWlsU3RhZ2Uuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGhpZGVTdGFnZTogZnVuY3Rpb24oKXtcbiAgICAgIHRoaXMuJGRldGFpbFN0YWdlLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgdGhpcy4kZGV0YWlsU3RhZ2Uuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIHRoaXMuY2xlYXJWYWx1ZSgpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gRGV0YWlsVmlldztcblxufSkoKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpe1xuXG4gIHZhciBDb21tb25WaWV3ID0gcmVxdWlyZSgnLi9jb21tb25fdmlldycpLFxuICAgICAgSW5wdXRWaWV3ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5zZXR1cCgpO1xuICAgICAgfTtcblxuICBJbnB1dFZpZXcucHJvdG90eXBlID0gbmV3IENvbW1vblZpZXcoKTtcblxuICBfLmV4dGVuZChJbnB1dFZpZXcucHJvdG90eXBlLCB7XG4gICAgJGlucHV0U3RhZ2U6IG51bGwsXG4gICAgc2V0dXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgX3RoaXMuJGlucHV0U3RhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtc3RhZ2VfaW5wdXQnKTtcblxuICAgICAgX3RoaXMuJHR0bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy10dGwnKTtcbiAgICAgIF90aGlzLiRsaW1pdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1saW1pdCcpO1xuICAgICAgX3RoaXMuJHRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtdGV4dCcpO1xuXG4gICAgICBfdGhpcy4kaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtaWQnKTtcbiAgICAgIF90aGlzLiRzdGF0dXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtc3RhdHVzJyk7XG4gICAgICBfdGhpcy4kY3JlYXRlRGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1jcmVhdGVfZGF0ZScpO1xuXG4gICAgICBfdGhpcy4kYnRuQWRkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWJ0bl9hZGQnKTtcbiAgICAgIF90aGlzLiRidG5DYW5jZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtYnRuX2NhbmNlbCcpO1xuICAgIH0sXG4gICAgY2xlYXJWYWx1ZTogZnVuY3Rpb24oKXtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICBfdGhpcy4kdHRsLnZhbHVlID0gJyc7XG4gICAgICBfdGhpcy4kbGltaXQudmFsdWUgPSAnJztcbiAgICAgIF90aGlzLiR0ZXh0LnZhbHVlID0gJyc7XG4gICAgICBfdGhpcy4kaWQudmFsdWUgPSAnJztcbiAgICAgIF90aGlzLiRzdGF0dXMudmFsdWUgPSAnJztcbiAgICAgIF90aGlzLiRjcmVhdGVEYXRlLnZhbHVlID0gJyc7XG4gICAgfSxcbiAgICBzZXREZWZhdWx0OiBmdW5jdGlvbihkYXRhKXtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICBfdGhpcy4kdHRsLnZhbHVlID0gZGF0YS50aXRsZTtcbiAgICAgIF90aGlzLiRsaW1pdC52YWx1ZSA9IGRhdGEubGltaXQ7XG4gICAgICBfdGhpcy4kdGV4dC52YWx1ZSA9IGRhdGEudGV4dDtcbiAgICAgIF90aGlzLiRpZC52YWx1ZSA9IGRhdGEudG9kb19pZDtcbiAgICAgIF90aGlzLiRzdGF0dXMudmFsdWUgPSBkYXRhLnN0YXR1cztcbiAgICAgIF90aGlzLiRjcmVhdGVEYXRlLnZhbHVlID0gZGF0YS5jcmVhdGVEYXRlO1xuICAgIH0sXG4gICAgYmluZDogZnVuY3Rpb24oYUV2ZW50LCBhSGFuZGxlcil7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGlmKGFFdmVudCA9PT0gJ3NhdmUnKXtcbiAgICAgICAgICBfdGhpcy4kYnRuQWRkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZ0KXtcbiAgICAgICAgICAgIGFIYW5kbGVyKF90aGlzLmdldFZhbHVlKCkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoYUV2ZW50ID09PSAnY2FuY2VsJyl7XG4gICAgICAgICAgX3RoaXMuJGJ0bkNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2dCl7XG4gICAgICAgICAgICBhSGFuZGxlcigpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9LFxuICAgIGdldFZhbHVlOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRpdGxlOiBfdGhpcy4kdHRsLnZhbHVlIHx8ICfmnKroqJjlhaUnLFxuICAgICAgICBsaW1pdDogX3RoaXMuJGxpbWl0LnZhbHVlIHx8ICfmnKroqJjlhaUnLFxuICAgICAgICB0ZXh0OiBfdGhpcy4kdGV4dC52YWx1ZSB8fCAn5pyq6KiY5YWlJyxcbiAgICAgICAgdG9kb19pZDogX3RoaXMuJGlkLnZhbHVlIHx8ICcnLFxuICAgICAgICBzdGF0dXM6IF90aGlzLiRzdGF0dXMudmFsdWUgfHwgJycsXG4gICAgICAgIGNyZWF0ZURhdGU6IF90aGlzLiRjcmVhdGVEYXRlLnZhbHVlIHx8ICcnXG4gICAgICB9O1xuICAgIH0sXG4gICAgc2hvd1N0YWdlOiBmdW5jdGlvbigpe1xuICAgICAgdGhpcy4kaW5wdXRTdGFnZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHRoaXMuJGlucHV0U3RhZ2Uuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGhpZGVTdGFnZTogZnVuY3Rpb24oKXtcbiAgICAgIHRoaXMuJGlucHV0U3RhZ2Uuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICB0aGlzLiRpbnB1dFN0YWdlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB0aGlzLmNsZWFyVmFsdWUoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIElucHV0VmlldztcblxufSkoKTsiLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpe1xuXG4gIHZhciBDb21tb25WaWV3ID0gcmVxdWlyZSgnLi9jb21tb25fdmlldycpLFxuICAgICAgTGlzdFZpZXcgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnNldFVwKCk7XG4gICAgICB9O1xuXG4gIExpc3RWaWV3LnByb3RvdHlwZSA9IG5ldyBDb21tb25WaWV3KCk7XG5cbiAgXy5leHRlbmQoTGlzdFZpZXcucHJvdG90eXBlLCB7XG4gICAgJGxpc3RTdGFnZTogbnVsbCxcbiAgICBzZXRVcDogZnVuY3Rpb24oKXtcbiAgICAgIHRoaXMuJGxpc3RTdGFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy4kbGlzdFN0YWdlLmlkID0gJ2pzLWxpc3Rfc3RhZ2UnO1xuICAgICAgdGhpcy4kbGlzdFN0YWdlLmNsYXNzTmFtZSA9ICdzdGFnZV9fbGlzdCc7XG5cbiAgICAgIHRoaXMuJG5hdiA9IHRoaXMuY3JlYXRlTmF2RWxlbWVudCgpO1xuICAgIH0sXG4gICAgcmVuZGVyRW1wdHk6IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgZG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLFxuICAgICAgICAgIHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ+S/neWtmOOBleOCjOOBn+ODh+ODvOOCv+OBjOOBguOCiuOBvuOBm+OCk+OAgicpLFxuICAgICAgICAgIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpOztcblxuICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpe307XG4gICAgICBkb20uY2xhc3NOYW1lID0gJ3RvZG9fX25vZGF0YSc7XG4gICAgICBkb20uYXBwZW5kQ2hpbGQodGV4dE5vZGUpO1xuXG4gICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChfdGhpcy4kbmF2KTtcbiAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGRvbSk7XG5cbiAgICAgIF90aGlzLnVwZGF0ZVN0YWdlKGZyYWdtZW50KTtcbiAgICAgIGNhbGxiYWNrLmNhbGwoX3RoaXMsZnJhZ21lbnQpO1xuICAgIH0sXG4gICAgcmVuZGVyTGlzdDogZnVuY3Rpb24oYURhdGEsY2FsbGJhY2spe1xuICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpe307XG5cbiAgICAgIHdoaWxlIChfdGhpcy4kbGlzdFN0YWdlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgX3RoaXMuJGxpc3RTdGFnZS5yZW1vdmVDaGlsZChfdGhpcy4kbGlzdFN0YWdlLmZpcnN0Q2hpbGQpO1xuICAgICAgfVxuXG4gICAgICBmb3IodmFyIGkgPSAwLGxlbiA9IGFEYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBfdGhpcy5jcmVhdGVUb2RvRWxlbWVudChhRGF0YVtpXSk7XG4gICAgICAgIF90aGlzLiRsaXN0U3RhZ2UuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKF90aGlzLiRuYXYpO1xuICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoX3RoaXMuJGxpc3RTdGFnZSk7XG5cbiAgICAgIF90aGlzLnVwZGF0ZVN0YWdlKGZyYWdtZW50KTtcbiAgICAgIGNhbGxiYWNrLmNhbGwoX3RoaXMsZnJhZ21lbnQpO1xuICAgIH0sXG4gICAgY3JlYXRlVG9kb0VsZW1lbnQ6IGZ1bmN0aW9uKGFEYXRhKXtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgX3dyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhcnRpY2xlJyksXG4gICAgICAgICAgX2luciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgIF90dGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpLFxuICAgICAgICAgIF9saW1pdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICAgICAgYURhdGEgPSBfdGhpcy52YWxpZGF0ZURhdGEoYURhdGEpO1xuXG4gICAgICBfd3JhcC5jbGFzc05hbWUgPSAndG9kb19faXRlbSBpcy0tJythRGF0YS5zdGF0dXM7XG4gICAgICBfaW5yLmNsYXNzTmFtZSA9ICd0b2RvX19pdGVtX19pbnInO1xuICAgICAgX3R0bC5jbGFzc05hbWUgPSAndG9kb19faXRlbV9fdHRsJztcbiAgICAgIF9saW1pdC5jbGFzc05hbWUgPSAndG9kb19faXRlbV9fbGltaXQnO1xuXG4gICAgICBfd3JhcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLGFEYXRhLnRvZG9faWQpO1xuXG4gICAgICBfdHRsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGFEYXRhLnRpdGxlKSk7XG4gICAgICBfbGltaXQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYURhdGEubGltaXQpKTtcblxuICAgICAgX3dyYXAuYXBwZW5kQ2hpbGQoX2lucikuYXBwZW5kQ2hpbGQoX3R0bCk7XG4gICAgICBfaW5yLmFwcGVuZENoaWxkKF9saW1pdCk7XG5cbiAgICAgIHJldHVybiBfd3JhcDtcbiAgICB9LFxuICAgIGNyZWF0ZU5hdkVsZW1lbnQ6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICRuYXZXcmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgJGJ0bkFkZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpLFxuICAgICAgICAgICRidG5Tb3J0QWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyksXG4gICAgICAgICAgJGJ0blNvcnRVbnJlc29sdmVkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyksXG4gICAgICAgICAgJGJ0blNvcnRSZXNvbHZlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXG4gICAgICAkbmF2V3JhcC5jbGFzc05hbWUgPSAnc3RhZ2VfX25hdic7XG4gICAgICAkYnRuQWRkLmNsYXNzTmFtZSA9ICdzdGFnZV9fbmF2LS1hZGQnO1xuICAgICAgJGJ0blNvcnRBbGwuY2xhc3NOYW1lID0gJ3N0YWdlX19uYXYtLWFsbCc7XG4gICAgICAkYnRuU29ydFVucmVzb2x2ZWQuY2xhc3NOYW1lID0gJ3N0YWdlX19uYXYtLXVucmVzb2x2ZWQnO1xuICAgICAgJGJ0blNvcnRSZXNvbHZlZC5jbGFzc05hbWUgPSAnc3RhZ2VfX25hdi0tcmVzb2x2ZWQnO1xuXG4gICAgICAkYnRuQWRkLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCfov73liqDjgZnjgosnKSk7XG4gICAgICAkYnRuU29ydEFsbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgn5YWo44GmJykpO1xuICAgICAgJGJ0blNvcnRVbnJlc29sdmVkLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCfmnKrop6PmsbonKSk7XG4gICAgICAkYnRuU29ydFJlc29sdmVkLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCfop6PmsbrmuIgnKSk7XG5cbiAgICAgIF90aGlzLiRidG5BZGQgPSAkYnRuQWRkO1xuXG5cbiAgICAgIC8vIOewoeaYk+eahOOBque1nuOCiui+vOOBv+apn+iDvVxuICAgICAgJGJ0blNvcnRBbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snICwgZnVuY3Rpb24oKXtcbiAgICAgICAgX3RoaXMuc29ydExpc3QoJ2FsbCcpO1xuICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAkYnRuU29ydFVucmVzb2x2ZWQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snICwgZnVuY3Rpb24oKXtcbiAgICAgICAgX3RoaXMuc29ydExpc3QoJ3VucmVzb2x2ZWQnKTtcbiAgICAgIH0sIGZhbHNlKTtcblxuICAgICAgJGJ0blNvcnRSZXNvbHZlZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycgLCBmdW5jdGlvbigpe1xuICAgICAgICBfdGhpcy5zb3J0TGlzdCgncmVzb2x2ZWQnKTtcbiAgICAgIH0sIGZhbHNlKTtcblxuXG4gICAgICAkbmF2V3JhcC5hcHBlbmRDaGlsZCgkYnRuQWRkKTtcbiAgICAgICRuYXZXcmFwLmFwcGVuZENoaWxkKCRidG5Tb3J0QWxsKTtcbiAgICAgICRuYXZXcmFwLmFwcGVuZENoaWxkKCRidG5Tb3J0VW5yZXNvbHZlZCk7XG4gICAgICAkbmF2V3JhcC5hcHBlbmRDaGlsZCgkYnRuU29ydFJlc29sdmVkKTtcblxuICAgICAgcmV0dXJuIF90aGlzLiRuYXYgPSAkbmF2V3JhcDtcbiAgICB9LFxuICAgIHNvcnRMaXN0KGFQYXR0ZXJuKXtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAkbGlzdCA9IHRoaXMuJGxpc3RTdGFnZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b2RvX19pdGVtJyksXG4gICAgICAkdGFyZ2V0ID0gdGhpcy4kbGlzdFN0YWdlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLS0nK2FQYXR0ZXJuKTtcblxuICAgICAgaWYoYVBhdHRlcm4gPT09ICdhbGwnIHx8IGFQYXR0ZXJuID09PSAndW5kZWZpbmVkJyB8fCAhYVBhdHRlcm4pe1xuICAgICAgICBfLmVhY2goJGxpc3QsIGZ1bmN0aW9uKCRlbGUpe1xuICAgICAgICAgICRlbGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIH0pO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfLmVhY2goJGxpc3QsIGZ1bmN0aW9uKCRlbGUpe1xuICAgICAgICAgICRlbGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfSk7XG4gICAgICAgIF8uZWFjaCgkdGFyZ2V0LCBmdW5jdGlvbigkZWxlKXtcbiAgICAgICAgICAkZWxlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGJpbmQ6IGZ1bmN0aW9uKGFFdmVudCwgYUhhbmRsZXIpe1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIGlmKGFFdmVudCA9PT0gJ2FkZCcpe1xuICAgICAgICBfdGhpcy4kYnRuQWRkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICBhSGFuZGxlcigpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYoYUV2ZW50ID09PSAnbGlzdF9kZXRhaWwnKXtcbiAgICAgICAgdmFyICRsaXN0ID0gX3RoaXMuJGxpc3RTdGFnZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b2RvX19pdGVtJyk7XG4gICAgICAgIF8uZWFjaCgkbGlzdCwgZnVuY3Rpb24oJGVsZSl7XG4gICAgICAgICAgJGVsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2dCl7XG4gICAgICAgICAgICBhSGFuZGxlcih0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpKTtcbiAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfSxcbiAgICB2YWxpZGF0ZURhdGE6IGZ1bmN0aW9uKGFEYXRhKXtcbiAgICAgIHJldHVybiBkYXRhID0ge1xuICAgICAgICB0aXRsZTogYURhdGEudGl0bGUgfHwgJ+acquiomOWFpScsXG4gICAgICAgIGxpbWl0OiBhRGF0YS5saW1pdCB8fCAn5pyq6KiY5YWlJyxcbiAgICAgICAgdGV4dDogYURhdGEudGV4dCB8fCAn5pyq6KiY5YWlJyxcbiAgICAgICAgdG9kb19pZDogYURhdGEudG9kb19pZCxcbiAgICAgICAgc3RhdHVzOiBhRGF0YS5zdGF0dXMsXG4gICAgICAgIGNyZWF0ZURhdGU6IGFEYXRhLmNyZWF0ZURhdGVcbiAgICAgIH07XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gTGlzdFZpZXc7XG5cbn0pKCk7IiwiXG47KGZ1bmN0aW9uKCl7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgTGlzdFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvbGlzdF92aWV3JyksXG4gICAgICBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvaW5wdXRfdmlldycpLFxuICAgICAgRGV0YWlsVmlldyA9IHJlcXVpcmUoJy4vdmlldy9kZXRhaWxfdmlldycpLFxuICAgICAgVG9kb0xpc3RNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwvdG9kb19saXN0X21vZGVsJyksXG4gICAgICBDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL2NvbnRyb2xsZXInKTtcblxuXG5cbiAgdmFyIGxpc3RzID0gbmV3IFRvZG9MaXN0TW9kZWwoKSxcbiAgICAgIGxpc3RWaWV3ID0gbmV3IExpc3RWaWV3KCksXG4gICAgICBpbnB1dFZpZXcgPSBuZXcgSW5wdXRWaWV3KCksXG4gICAgICBkZXRhaWxWaWV3ID0gbmV3IERldGFpbFZpZXcoKSxcbiAgICAgIGNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlcihsaXN0cyxsaXN0VmlldyxpbnB1dFZpZXcsZGV0YWlsVmlldyk7XG5cblxufSkoKTtcbiJdfQ==
