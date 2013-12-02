var MainNav = Backbone.View.extend({

  tagName: "div",

  className: "nav",

  events: {
    "click .customerCount":"showCustomers",
    "click .logout":"logout"
  },
  logout: function() {
    app.logout();
  },
  showCustomers: function() {
    alert('customers');
  },
  initialize: function() {
    var self = this;
    $(document.body).prepend(this.$el);
    this.render();
    app.on('change:loggedIn', function(model) {
      self.render();
    });
  },

  render: function() {
    var self = this;
    var data = {
      loggedIn: app.get('loggedIn')
    };
    if (typeof user !== 'undefined') {
      data.name = user.get('firstName');
    }
    loadManager.loadHTML('mainNav.html',data, function(html) {
      if (!data.loggedIn && app.get('loggedIn')) {
        return; // Prevent race condition
      }
      self.$el.html(html);
    });
  },
  updateCustomerCount: function(newCount) {
    this.customerCount = newCount;
    this.updateCount('customerCount','Customers (' + newCount + ')');
  },
  updateServiceCenterCount: function(newCount) {
    this.serviceCenterCount = newCount;
    this.updateCount('serviceCenterCount','Service Centers (' + newCount + ')');
  },
  updateDriverCount: function(newCount) {
    this.driverCount = newCount;
    this.updateCount('driverCount','Drivers (' + newCount + ')');
  },
  updateJobCount: function(newCount) {
    this.jobCount = newCount;
    this.updateCount('jobCount','Jobs (' + newCount + ')');
  },
  updateCount: function(elemName,newCount) {
    var elem = this.$el.find('.' + elemName);
    elem.html(newCount);
  }

});
