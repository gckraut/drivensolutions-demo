var CustomerCard = Backbone.View.extend({

  tagName: "div",

  className: "customerCard",

  events: {
  },

  initialize: function(options) {
    $('.leftBar').append(this.$el);
    this.time = 0;
    this.customer = options.customer;
    this.car = options.car;
    console.log(this.customer);
    this.render();
  },

  render: function() {
    var self = this;
    var data = {};
    if (typeof this.customer !== 'undefined') {
      data = this.customer.toJSON();
    };
    if (typeof this.car !== 'undefined') {
      var car = this.car;
      data.carInfo = car.get('year') + ' ' + car.get('make') + ' ' + car.get('model');
    };
    loadManager.loadHTML('customerCard.html',data, function(html) {
      self.$el.html(html);
    });
  },
});
