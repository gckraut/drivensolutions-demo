var DriverC = Backbone.Model.extend({
  initialize: function() {
    this.myMarker = new google.maps.Marker({
      map: map,
      title: 'My Location'
    });
    var self = this;
    map.setOptions({disableDefaultUI:false,panControlOptions:{position: google.maps.ControlPosition.LEFT_BOTTOM},zoomControlOptions:{position:google.maps.ControlPosition.LEFT_CENTER}});
    this.jobMarkers = {};
    this.on('change:user', function(model,newUser) {
      // this.checkForJobs();
      model.getJobs();
      model.checkForCurrentJob();
    });
    this.on('change:currentJob', function(model,newCurrentJob) {
      if (!newCurrentJob) {
        model.getJobs();
        model.checkForCurrentJob();
      } else {
        model.updateDirections();
      }
    });
    this.updateLocation();
    $('body').append('<div class="directions"></div>');
    $('.directions').hide();
  },
  updateDirections: function() {
    var startingPoint = this.get('currentLocation');
    if (!startingPoint) {
      setTimeout(function() {
        if (typeof window.driverC === 'undefined') {
          return;
        }
        driverC.updateDirections();
      },5000);
      return;
    };
    var destination = this.get('currentJob').get('location');
    if (!this.directionsDisplay) {
      this.directionsDisplay = new google.maps.DirectionsRenderer();
      this.directionsService = new google.maps.DirectionsService();
      this.directionsDisplay.setMap(map);
      this.directionsDisplay.setPanel($('.directions')[0]);
    };
    var start = startingPoint.latitude + ',' + startingPoint.longitude;
    var end = destination.latitude + ',' + destination.longitude;
    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };
    var self = this;
    this.directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        self.directionsDisplay.setDirections(response);
        $('.directions').show();
      }
    });
  },
  updateLocation: function() {
    var self = this;
    console.log('getting location');
    Parse.GeoPoint.current().then(function(geoPoint) {
      if (typeof window.driverC === 'undefined') {
        return;
      }
      self.set('currentLocation',geoPoint);
      user.set('location',geoPoint);
      user.save();
      var newlocation = new google.maps.LatLng(geoPoint.latitude,geoPoint.longitude);
      map.setCenter(newlocation);
      self.myMarker.setPosition(newlocation);
      setTimeout(function() {
        if (typeof window.driverC === 'undefined') {
          return;
        }
        driverC.updateLocation();
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
      app.showJobList();
    }
  },
  status: function() {
    return '';
    var currentJob = this.get('currentJob');
    if (!currentJob) {
      return 'Awaiting service request ...';
    };
    var jobStatus = currentJob.get('status');
    if (jobStatus == 'unassigned') {
      return 'We received your request and will contact you as soon as we can to assist you further.';
    }
    console.log(currentJob,jobStatus);
  },
  getJobs: function() {
    var self = this;
    window.jobCollection = new JobCollection();
    var newQuery = jobCollection.query;
    newQuery.equalTo('driverUser',user);
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
