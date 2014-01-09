var DriverCard = Backbone.View.extend({

  tagName: "div",

  className: "driverCard",

  events: {
  },

  initialize: function() {
    $('.leftBar').append(this.$el);
    this.time = 0;
  },

  render: function() {
    var self = this;
    var data = {};
    if (typeof user !== 'undefined') {
      data = user.toJSON();
    };
    loadManager.loadHTML('driverCard.html',data, function(html) {
      self.$el.html(html);
    });
  },
});
