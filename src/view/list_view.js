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