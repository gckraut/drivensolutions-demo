var CustomerBar = Backbone.View.extend({

  tagName: "div",

  className: "customerBar",

  events: {
  },
  initialize: function() {
    var self = this;
    $(document.body).append(this.$el);
    this.render();
    customerC.on('change:currentLocation', function(model,newValue) {
      
    });
  },

  render: function() {
    var self = this;
    loadManager.loadHTML('customerBar.html',{}, function(html) {
      self.$el.html(html);
    });
  },
  setStatus: function(newStatus) {
    this.$el.find('.customerStatusBar').html(newStatus);
  }
});
