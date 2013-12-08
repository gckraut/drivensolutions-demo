var AssignServiceProvider = Backbone.View.extend({
  tagName: "div",
  className: "assignServiceProvider",
  divID: "assignServiceProviderModal",
  events: {
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
  modalElem: function() {
    return this.$el.find('#' + this.divID);
  },
  render: function() {
    var self = this;
    this.loaded = false;
    serviceCenterCollection.fetch().then(function(serviceCenters) {
      self.finishRender({serviceCenters:serviceCenterCollection.toJSON()});
    });
  },
  finishRender: function(data) {
    var self = this;
    loadManager.loadHTML('assignServiceProvider.html',data, function(html) {
      console.log(html);
      self.$el.html(html);
      // self.modalElem().modal({backdrop:'static',keyboard:false}); // Only if we want someone to be unable to exit the modal
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
    this.modalElem().modal('show');

  },
  hide: function() {
    if (!this.loaded) {
      this.hideMe = true;
    }
    this.modalElem().modal('hide');
  }
});
