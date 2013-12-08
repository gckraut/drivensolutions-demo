var ServiceCenterC = Backbone.Model.extend({
  initialize: function() {
    var self = this;
    map.setOptions({disableDefaultUI:false,panControlOptions:{position: google.maps.ControlPosition.LEFT_BOTTOM},zoomControlOptions:{position:google.maps.ControlPosition.LEFT_CENTER}});
    this.jobMarkers = {};
    this.driverMarkers = {};
    this.on('change:user', function(model,newUser) {
      // this.checkForJobs();
    });
    this.on('change:serviceCenter', function(model,newServiceCenter) {
      model.getDrivers();
      model.getJobs();
    });
    
    
  },
  getJobs: function() {
    var self = this;
    window.jobCollection = new JobCollection();
    var newQuery = jobCollection.query;
    newQuery.equalTo('serviceCenter',user.get('serviceCenter'));
    jobCollection.newQuery = newQuery;
    window.jobCollection.fetch().then(function(results) {
      for (jobIndex in window.jobCollection.models) {
        var shouldAutoZoom = true;
        var job = window.jobCollection.at(jobIndex);
        var jobId = job.id;
        // console.log(job);
        var jobLocation = job.get('location');
        
        if (!jobLocation) {
          // console.log('No location' + jobId);
          continue;
        };
        
        var jobTest = self.jobMarkers[jobId];
        
        var newlocation = new google.maps.LatLng(jobLocation.latitude,jobLocation.longitude);
        
        if (jobTest) {
          jobTest.setPosition(newlocation);
          shouldAutoZoom = false;
        } else {
          jobTest = new google.maps.Marker({
            map: map,
            title: 'My Location',
            position: newlocation,
            icon: 'img/userMapIcon.png'
          });
          jobTest.dsType = 'Job';
          jobTest.dsIdentifier = jobId;
          self.jobMarkers[jobId] = jobTest;
          app.addMarkerListener(jobTest);
        }
      }
      if (shouldAutoZoom) {
        app.zoomMap();
      };
      }, function(error) {
      console.log('Error: getting jobs');
    });
  },
  getDrivers: function() {
    var self = this;
    window.driverCollection = new DriverCollection();
    driverCollection.setServiceCenter(this.get('serviceCenter'));
    window.driverCollection.fetch().then(function(results) {
      for (driverIndex in window.driverCollection.models) {
        var shouldAutoZoom = true;
        var driver = window.driverCollection.at(driverIndex);
        var driverId = driver.id;
        // console.log(job);
        var driverLocation = driver.get('location');
        
        if (!driverLocation) {
          // console.log('No location' + jobId);
          continue;
        };
        
        var driverTest = self.driverMarkers[driverId];
        
        var newlocation = new google.maps.LatLng(driverLocation.latitude,driverLocation.longitude);
        
        if (driverTest) {
          driverTest.setPosition(newlocation);
          shouldAutoZoom = false;
        } else {
          driverTest = new google.maps.Marker({
            map: map,
            title: 'My Location',
            position: newlocation,
            icon: 'img/driverMapIcon.png'
          });
          driverTest.dsType = 'Driver';
          driverTest.dsIdentifier = driverId;
          self.driverMarkers[driverId] = driverTest;
          app.addMarkerListener(driverTest);
        }
      }
      if (shouldAutoZoom) {
        app.zoomMap();
      };
      }, function(error) {
      console.log('Error: getting jobs');
    });
  },
     // Refresh all of the jobs currently loaded, update counts to show how many need to be contacted/assigned to a service center
  getServiceCenters: function() {

  },
     // Refresh all of the service centers currently loaded, update counts to show how many drivers are available.
  assignJobToServiceCenter: function(job,serviceCenter) {

  },
     // Assign a job to a service center.
  contactJobCustomer: function(job) {

  },
     // Contact the customer associated with the job
  contactServiceCenter: function(serviceCenter) {

  },
     // Contact the service center
  contactDriver: function(driver) {

  },
     // Contact the driver
  setJobNote: function(job,note) {

  },
     // Add a note to the customer job record
  cancelJobAssignment: function(job,reason) {

  }
     // Cancel the assignment to a service center

});
