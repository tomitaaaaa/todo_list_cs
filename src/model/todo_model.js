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