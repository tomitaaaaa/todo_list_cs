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