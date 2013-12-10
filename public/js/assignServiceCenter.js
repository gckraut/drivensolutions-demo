var AssignServiceCenter = Backbone.View.extend({
  tagName: "div",
  className: "assignServiceCenter",
  divID: "assignServiceCenterModal",
  events: {
    "click .assignJobButton":"assignJobToServiceCenter",
    "click .unassignJobButton":"unassignJobFromServiceCenter",
    "click .phoneButton":"callPhone"
  },
  callPhone: function(e) {
    app.call($(e.target).attr('phone'));
  },
  assignJobToServiceCenter: function(e) {
    var self = this;
    var serviceCenterObjectId = $(e.target).attr('objectId');
    var serviceCenterAssignment = new ServiceCenter();
    serviceCenterAssignment.id = serviceCenterObjectId;
    this.job.set('serviceCenter',serviceCenterAssignment);
    this.job.save().then(function(success) {
      infoBubbleC.setupMarker();
      self.hide();
    }, function(error) {
      alert('There was an error assigning the service provider to the job, please try again.');
    });
  },
  unassignJobFromServiceCenter: function(e) {
    this.job.unset('serviceCenter');
    var self = this;
    this.job.save().then(function(success) {
      infoBubbleC.setupMarker();
      self.hide();
    }, function(error) {
      alert('There was an error unassigning the service provider from the job, please try again.');
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
    console.log(this.job);
    var jobFetcher = new ObjectFetcher(this.job);
    Parse.Promise.when([jobFetcher.fetch(),serviceCenterCollection.fetch()]).then(function(fetchedJob,serviceCenters) {
      var serviceCentersArray = serviceCenterCollection.toJSON();
      var selectedJob = fetchedJob.get('serviceCenter');
      var customerData = fetchedJob.get('customerUser');
      if (customerData) {
        customerData = customerData.get('firstName') + ' ' + customerData.get('lastName');
      };
      var serviceData = fetchedJob.get('service');
      if (serviceData) {
        serviceData = serviceData.get('name');
      };
      if (selectedJob) {
        var testJob = _.findWhere(serviceCentersArray,{objectId: selectedJob.id});
        if (testJob) {
          testJob.selected = true;
        };
      }
      for (var i = serviceCentersArray.length - 1; i >= 0; i--) {
        var serviceCenter = serviceCentersArray[i];
        var jobLocation = fetchedJob.get('location');
        var serviceCenterLocation = new Parse.GeoPoint(serviceCenter.location);
        var distance = jobLocation.milesTo(serviceCenterLocation);
        serviceCenter.distance = Math.round(distance*100)/100;
      };
      self.finishRender({job:fetchedJob.toJSON(),customerName:customerData,serviceName:serviceData,serviceCenters:serviceCentersArray});
    });
  },
  finishRender: function(data) {
    var self = this;
    loadManager.loadHTML('assignServiceCenter.html',data, function(html) {
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
