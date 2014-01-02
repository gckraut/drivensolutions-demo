var Login = Backbone.View.extend({
  tagName: "div",
  className: "login",
  events: {
    "click .login":"login",
    "click .loginDriver":"loginDriver"
  },
  loginDriver: function() {
    app.login('vdriver','p');
  },
  login: function() {
    var self = this;
    var username = this.$el.find('input[type=email]').val();
    var password = this.$el.find('input[type=password]').val();
    app.login(username,password);
  },
  resetLogin: function() {
    this.$el.find('input[type=email]').val('');
    this.$el.find('input[type=password]').val('');
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
    loadManager.loadHTML('login.html',{}, function(html) {
      self.$el.html(html);
      self.$el.find('#loginModal').modal({backdrop:'static',keyboard:false});
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
    this.$el.find('#loginModal').modal('show');
  },
  hide: function() {
    if (!this.loaded) {
      this.hideMe = true;
    }
    this.$el.find('#loginModal').modal('hide');
  }
});
