var DriverBar = Backbone.View.extend({

  tagName: "div",

  className: "driverBar",

  events: {
    'click .arrivedButton':'arrived',
    'click .callCustomerButton':'callCustomerButton'
  },
  callCustomerButton: function() {
    app.callCustomerForJob(driverC.get('currentJob'));
  },
  arrived: function() {
    var currentJob = driverC.get('currentJob');
    currentJob.set('driverArrived',new Date());
    currentJob.unset('driverUser');
    user.unset('job');
    Parse.Object.saveAll([currentJob,user]).then(function() {
      driverC.set('currentJob',null);
    }, function(error) {
      console.log(error);
      console.log('there was an error marking the job as arrived');
    });
  },
  initialize: function() {
    var self = this;
    $(document.body).append(this.$el);
    this.render();
    driverC.on('change:currentJob', function(model,newValue) {
      driverBar.render();
    });
  },

  render: function() {
    var self = this;
    var address = null;
    var serviceProvider = null;
    var driver = null;
    var customer = null;
    var currentJob = driverC.get('currentJob');
    if (currentJob) {
      address = currentJob.get('address');
      serviceProvider = currentJob.get('serviceProvider');
      customer = currentJob.get('customerUser');
    }
    var data = {
      address: address,
      callServiceProvider: serviceProvider,
      callCustomer: customer,
      status: driverC.status()
    };
    loadManager.loadHTML('driverBar.html',data, function(html) {
      self.$el.html(html);
    });
  },
  setStatus: function(newStatus) {
    this.$el.find('.driverStatusBar').html(newStatus);
  }
});
