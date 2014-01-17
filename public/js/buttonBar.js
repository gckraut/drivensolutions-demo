var ButtonBar = Backbone.View.extend({

  tagName: "div",

  className: "buttonBar",

  events: {
    "click .callServiceCenterButton":"callServiceCenter",
    "click .callCustomerButton":"callCustomer",
    "click .arrivedButton":"arrived",
    "click .completeButton":"complete"
  },
  complete: function() {
    driverC.complete();
    this.$el.find('.completeButton').hide();
    this.$el.find('.arrivedButton').show();
  },
  arrived: function() {
    driverC.arrived();
    this.$el.find('.completeButton').show();
    this.$el.find('.arrivedButton').hide();
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
      self.$el.find('.completeButton').hide();
    });
  },
});
