var CustomerC = Backbone.Model.extend({
  initialize: function() {
    this.myMarker = new google.maps.Marker({
      map: map,
      title: 'My Location'
    });
    this.updateLocation();
    this.on('change:user', function(model,newUser) {
      this.checkForCurrentJob();
    });
  },
  updateLocation: function() {
    var self = this;
    console.log('getting location');
    Parse.GeoPoint.current().then(function(geoPoint) {
      self.set('currentLocation',geoPoint);
      user.set('location',geoPoint);
      user.save();
      var newlocation = new google.maps.LatLng(geoPoint.latitude,geoPoint.longitude);
      map.setCenter(newlocation);
      self.myMarker.setPosition(newlocation);
      setTimeout(function() {
        customerC.updateLocation();
      },5000);
    }, function(error) {
      console.log('It would help to provide your location to the app');
      
    });
    // setTimeout(self.updateLocation.apply(self),9000);
  },
  checkForCurrentJob: function() {
    var self = this;
    var user = this.get('user');
    var job = user.get('job');
    if (job) {
      job.fetch().then(function(fetchedJob) {
        self.set('currentJob',fetchedJob);
      }, function(error) {
        console.log('error getting current job');
        self.checkForCurrentJob();
      })
    } else {
      console.log('no current job');
      app.askIfServiceNeeded();
    }
  },
     // Check to see if there’s already a current job going on
  cancelJob: function() {
    var job = this.get('currentJob');
    if (!job) {return;};
    var status = job.get('status');
    if (status != 'unassigned') {
      return false;
    }
    
    return true;
  },
     // Cancel a job that has not been dispatched yet
  newService: function(serviceType) {
    console.log(serviceType);
    var job = new Job();
    job.set('service',serviceType);
    job.set('customerUser',user);
    job.set('status',"unassigned");
    job.set('location',user.get('location'));
    job.save().then(function(newJob) {
      user.set('job',newJob);
      user.save();
      self.set('currentJob',newJob);
    }, function(err) {
      console.log('error creating job');
    });
  },
     // Start a new job of a particular type
  callDriver: function() {

  },
     // Call driver assigned to job, error if no driver assigned
  callCustomerCenter: function() {

  },
     // Call customer center associated with job, error if no customer center assigned
  callServiceCenter: function() {

  },
     // Call service center associated with job, error if no service center assigned
  changeAddress: function(newAddress) {

  },
     // Change customer’s address for the current job, error if no current job
  markJobComplete: function() {

  },
     // Specify that the job was completed satisfactorily
  getDriver: function() {

  },
     // Get the driver’s location and info
  refresh: function() {

  },
  status: function() {
    var currentJob = this.get('currentJob');
    if (!currentJob) {
      return 'Awaiting service request ...';
    };
    var jobStatus = currentJob.get('status');
    if (jobStatus == 'unassigned') {
      return 'We received your request and will contact you as soon as we can to assist you further.';
    }
    console.log(currentJob,jobStatus);
  }
     // Check on the current job status and get the driver if necessary and refresh their location
});
