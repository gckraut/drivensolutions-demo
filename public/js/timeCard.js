var TimeCard = Backbone.View.extend({

  tagName: "div",

  className: "timeCard",

  events: {
  },

  initialize: function() {
    $('.leftBar').append(this.$el);
    this.time = 0;
    this.render();
  },

  render: function() {
    var self = this;
    loadManager.loadHTML('timeCard.html',{}, function(html) {
      self.$el.html(html);
      self.updateTime();
    });
  },
  updateTime: function() {
    this.time++;
    this.$el.find('.timeCardText').html(moment().format('MMM Do YYYY, h:mm a'));
    var self = this;
    setTimeout(function() {
      self.updateTime();
    },10000);
  }
});
