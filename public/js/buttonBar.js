var ButtonBar = Backbone.View.extend({

  tagName: "div",

  className: "buttonBar",

  events: {
    "click .callServiceCenterButton":"callServiceCenter",
    "click .callCustomerButton":"callCustomer"
  },
  callServiceCenter: function() {
    app.callServiceCenter();
  },
  callCustomer: function() {
    app.callCustomerForJob(driverC.get('currentJob'));
  },
  initialize: function(options) {
    $('body').append(this.$el);
    this.render();
  },

  render: function() {
    var self = this;
    var data = {};
    loadManager.loadHTML('buttonBar.html',data, function(html) {
      self.$el.html(html);
    });
  },
});
