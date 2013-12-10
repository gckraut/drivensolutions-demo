var AssignDriver = Backbone.View.extend({
  tagName: "div",
  className: "assignDriver",
  divID: "assignDriverModal",
  events: {
    "click .assignJobButton":"assignJobToDriver",
    "click .unassignJobButton":"unassignJobFromDriver",
    "click .phoneButton":"callPhone"
  },
  callPhone: function(e) {
    app.call($(e.target).attr('phone'));
  },
  assignJobToDriver: function(e) {
    var self = this;
    var driverObjectId = $(e.target).attr('objectId');
    var driverAssignment = new Parse.User();
    driverAssignment.id = driverObjectId;
    this.job.set('driverUser',driverAssignment);
    this.job.save().then(function(success) {
      infoBubbleC.setupMarker();
      self.hide();
    }, function(error) {
      alert('There was an error assigning the driver to the job, please try again.');
    });
  },
  unassignJobFromDriver: function(e) {
    this.job.unset('driverUser');
    var self = this;
    this.job.save().then(function(success) {
      infoBubbleC.setupMarker();
      self.hide();
    }, function(error) {
      alert('There was an error unassigning the driver from the job, please try again.');
    });
  },
  initialize: function(job) {
    var self = this;
    this.job = job;
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
    var jobFetcher = new ObjectFetcher(this.job);
    Parse.Promise.when([jobFetcher.fetch(),driverCollection.fetch()]).then(function(fetchedJob,drivers) {
      var driversArray = driverCollection.toJSON();
      var selectedDriver = fetchedJob.get('driverUser');
      var customerData = fetchedJob.get('customerUser');
      if (customerData) {
        customerData = customerData.get('firstName') + ' ' + customerData.get('lastName');
      };
      var serviceData = fetchedJob.get('service');
      if (serviceData) {
        serviceData = serviceData.get('name');
      };
      if (selectedDriver) {
        var testJob = _.findWhere(driversArray,{objectId: selectedDriver.id});
        if (testJob) {
          testJob.selected = true;
        };
      }
      for (var i = driversArray.length - 1; i >= 0; i--) {
        var driver = driversArray[i];
        var jobLocation = fetchedJob.get('location');
        var driverLocation = new Parse.GeoPoint(driver.location);
        var distance = jobLocation.milesTo(driverLocation);
        driver.distance = Math.round(distance*100)/100;
      };
      self.finishRender({job:fetchedJob.toJSON(),customerName:customerData,serviceName:serviceData,drivers:driversArray});
    });
  },
  finishRender: function(data) {
    var self = this;
    loadManager.loadHTML('assignDriver.html',data, function(html) {
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
