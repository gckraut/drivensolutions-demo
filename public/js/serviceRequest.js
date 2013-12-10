var ServiceRequest = Backbone.View.extend({
  tagName: "div",
  className: "serviceRequest",
  events: {
    "click .serviceButton":"startJob"
  },
  startJob: function(el) {
    var objectID = $(el.target).attr('serviceID');
    if (!objectID) {
      objectID = $(el.target).parents('[serviceID]').attr('serviceID');
    }
    if (objectID == 'callCenter') {
      app.callContactCenter();
      return;
    };
    var service = new Service();
    service.id = objectID;
    customerC.newService(service);
    this.hide();
  },
  initialize: function() {
    var self = this;
    $(document.body).prepend(this.$el);
    this.render();
    // console.log('test',app);
    // app.on('change:loggedIn', function(model) {
    //   self.render();
    //   console.log(self);
    // });
  },
  render: function() {
    var self = this;
    loadManager.loadHTML('serviceRequest.html',{}, function(html) {
      self.$el.html(html);
      self.$el.find('#serviceRequestModal').modal({backdrop:'static',keyboard:false});
      self.loaded = true;
      if (self.hideMe) {
        self.hide();
      } else if (self.showMe) {
        self.showMe = false;
        self.show();
      }
    });
  },
  show: function() {
    if (!this.loaded) {
      this.showMe = true;
    }
    this.$el.find('#serviceRequestModal').modal('show');
  },
  hide: function() {
    if (!this.loaded) {
      this.hideMe = true;
    }
    this.$el.find('#serviceRequestModal').modal('hide');
  }
});
