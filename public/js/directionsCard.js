var DirectionsCard = Backbone.View.extend({

  tagName: "div",

  className: "directionsCard",

  events: {
  },

  initialize: function(options) {
    $('.leftBar').append(this.$el);
    this.render();
  },

  render: function() {
    var self = this;
    var data = {};
    if (typeof this.job !== 'undefined') {
      data = this.job.toJSON();
      data.jobInfo = this.job.get('service').get('name');
    };
    console.log('testing');
    console.log(data);
    // loadManager.loadHTML('directionsCard.html',data, function(html) {
    self.$el.html('<div class="jobCardContainer"><p class="tag">Directions</p><div class="directionsContent"></div></div>');
    // });
  },
});
