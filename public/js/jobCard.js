var JobCard = Backbone.View.extend({

  tagName: "div",

  className: "jobCard",

  events: {
  },

  initialize: function(options) {
    $('.leftBar').append(this.$el);
    this.job = options.job;
    this.render();
  },

  render: function() {
    var self = this;
    var data = {};
    if (typeof this.job !== 'undefined') {
      data = this.job.toJSON();
    };
    console.log('testing');
    console.log(data);
    loadManager.loadHTML('jobCard.html',data, function(html) {
      self.$el.html(html);
    });
  },
});
