var JobList = Backbone.View.extend({
  tagName: "div",
  className: "jobList",
  divID: "jobListModal",
  events: {
    "click .startJobButton":"startJob",
    "click .stopJobButton":"stopJob"
  },
  startJob: function(e) {
    var self = this;
    var jobObjectId = $(e.target).attr('objectId');
    var jobStart = new Job();
    jobStart.id = jobObjectId;
    user.set('job',jobStart);
    user.save().then(function(success) {
      driverC.set('currentJob',jobCollection.get(jobObjectId));
      self.hide();
    }, function(error) {
      alert('There was an error starting the job, please try again.');
    });
  },
  stopJob: function(e) {
    user.unset('job');
    var self = this;
    user.save().then(function(success) {
      self.hide();
    }, function(error) {
      alert('There was an error stopping the job, please try again.');
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
    var selectedJob = user.get('job');
    jobCollection.fetch().then(function(jobs) {
      var jobsArray = jobCollection.toJSON();
      var jobsData = [];
      for (var i = jobsArray.length - 1; i >= 0; i--) {
        var job = jobsArray[i];
        var newJob = {objectId:job.objectId};
        var testJob = jobCollection.get(job.objectId);
        var customer = testJob.get('customerUser');
        if (customer) {
          newJob.firstName = customer.get('firstName');
          newJob.lastName = customer.get('lastName');
        };
        var service = testJob.get('service');
        if (service) {
          newJob.serviceName = service.get('name');
        };
        var driverLocation = user.get('location');
        var jobLocation = new Parse.GeoPoint(job.location);
        var distance = jobLocation.milesTo(driverLocation);
        newJob.distance = Math.round(distance*100)/100;
        if (selectedJob) {
          if (selectedJob.id == newJob.objectId) {
            newJob.selected = true;
          };
        };
        jobsData.push(newJob);
      };
      self.finishRender({jobs:jobsData});
    });
  },
  finishRender: function(data) {
    var self = this;
    loadManager.loadHTML('jobList.html',data, function(html) {
      self.$el.html(html);
      self.modalElem().modal(); // Only if we want someone to be unable to exit the modal
      self.loaded = true;
      if (self.hideMe) {
        self.hide();
      } else if (self.showMe) {
        self.showMe = false;
        self.show();
      }
      app.speak('Please select a job to perform next...');
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
