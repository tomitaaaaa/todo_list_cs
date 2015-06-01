
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
