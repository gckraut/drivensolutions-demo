var CustomerCenterC = Backbone.Model.extend({
  initialize: function() {
    var self = this;
    map.setOptions({disableDefaultUI:false,panControlOptions:{position: google.maps.ControlPosition.LEFT_BOTTOM},zoomControlOptions:{position:google.maps.ControlPosition.LEFT_CENTER}});
    this.jobMarkers = {};
    this.on('change:user', function(model,newUser) {
      // this.checkForJobs();
    });
    window.jobCollection = new JobCollection();
    window.jobCollection.fetch().then(function(results) {
      for (jobIndex in window.jobCollection.models) {
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
        } else {
          jobTest = new google.maps.Marker({
            map: map,
            title: 'My Location',
            position: newlocation
          });
          jobTest.dsType = 'Job';
          jobTest.dsIdentifier = jobId;
          self.jobMarkers[jobId] = jobTest;
          app.addMarkerListener(jobTest);
        }
      }
      app.zoomMap();
    }, function(error) {
      console.log('Error: getting jobs');
    })
  },
  getJobs: function() {

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
