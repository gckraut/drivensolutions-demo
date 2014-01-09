var CustomerCard = Backbone.View.extend({

  tagName: "div",

  className: "customerCard",

  events: {
  },

  initialize: function(customer) {
    $('.leftBar').append(this.$el);
    this.time = 0;
    this.customer = customer;
  },

  render: function() {
    var self = this;
    var data = {};
    if (typeof this.customer !== 'undefined') {
      data = this.customer.toJSON();
    };
    loadManager.loadHTML('customerCard.html',data, function(html) {
      self.$el.html(html);
    });
  },
});
