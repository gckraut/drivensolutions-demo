var App = Backbone.Model.extend({
  userLocationsHandled: [],
  jobStatusHandled: [],
  load: function() {
    function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(41.877773,-87.629614),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true && (Parse.User.current()) ? (Parse.User.current().get('type') == 'driver') : true
        };
        window.geocoder = new google.maps.Geocoder();
        window.map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
        window.oms = new OverlappingMarkerSpiderfier(map);
        app.start();
      }
      google.maps.event.addDomListener(window, 'load', initialize);
  },
  firebaseBaseURL: 'https://driven.firebaseIO.com/',
  isValidSnapshot: function(snapshot) {
    var testDate = snapshot.val().updatedAt;
    if (!testDate) {
      var rawVal = snapshot.val();
      for (childKey in rawVal) {
        var child = rawVal[childKey];
        console.log(child);
        if (child.updatedAt) {
          if (!testDate) {
            testDate = child.updatedAt;
          } else if (testDate < child.updatedAt) {
            testDate = child.updatedAt;
          }
        };
      }
    };
    testDate = new Date(testDate);
    var now = new Date();
    if (now - testDate < 20000) {
      console.log('valid snapshot');
      return true;
    } else {
      console.log('invalid snapshot');
      return false;
    }
  },
  handleNewJobSnapshot: function(snapshot) {
    // Refresh Call Center
    if (!this.isValidSnapshot(snapshot)) {
      return;
    };
    if (this.isCustomerCenter()) {
      customerCenterC.getJobs();
    };
  },
  handleServiceCenterSnapshot: function(snapshot) {
    // Refresh Service Center
    if (!this.isValidSnapshot(snapshot)) {
      return;
    };
    if (this.isServiceCenter()) {
      serviceCenterC.getJobs();
    };
  },
  handleJobStatusSnapshot: function(snapshot,ref) {
    var self = this;
    if (!this.isValidSnapshot(snapshot)) {
      return;
    };
    var status = snapshot.val().status;
    var objectId = snapshot.ref().parent().name();
    STServiceCenter.updateJobStatus({
      status: status,
      objectId: objectId
    });
  },
  handleUserLocationSnapshot: function(snapshot,ref) {
    var self = this;
    if (!this.isValidSnapshot(snapshot)) {
      return;
    };
    var location = snapshot.val().location;
    var objectId = snapshot.ref().parent().name();
    STServiceCenter.updateDriverMarker({
      location: location,
      objectId: objectId
    });
  },
  handleUserSnapshot: function(snapshot) {
    var self = this;
    // Refresh Driver
    if (!this.isValidSnapshot(snapshot)) {
      return;
    };
    if (this.isDriver()) {
      var driverFetcher = new ObjectFetcher(user);
      driverFetcher.fetch().then(function(driver) {
        window.user = driver;
        var currentJob = driver.get('job');
        var shouldShowJobList = false;
        if (currentJob) {
          var driverCurrentJob = driverC.get('currentJob');
          if (driverCurrentJob) {
            if (currentJob.id !== driverCurrentJob.id) {
              driverC.set('currentJob',currentJob);
            };
          } else {
            shouldShowJobList = true;
          }
          
        } else {
          shouldShowJobList = true;
        }
        if (shouldShowJobList) {
          if (typeof window.jobList !== 'undefined') {
            window.jobList.hide();
            window.jobList.render();
          } else {
            self.showJobList();
          }
        };
        
      });
      
    };
  },
  handleJobSnapshot: function(snapshot) {
    if (!this.isValidSnapshot(snapshot)) {
      return;
    };
    // Refresh Customer
    if (this.isCustomer()) {
      var jobFetcher = new ObjectFetcher(customerC.get('currentJob'));
      jobFetcher.fetch().then(function(fetchedJob) {
        customerC.set('currentJob',fetchedJob);
      });      
    };

  },
  setupNewJobFirebase: function() {
    var self = this;
    this.newJobFirebase = new Firebase(this.firebaseBaseURL + 'newJob');
    this.serviceCenterFirebase.on('child_added', function(snapshot) {
      self.handleNewJobSnapshot(snapshot);
    });
  },
  setupServiceCenterFirebase: function(serviceCenter) {
    var self = this;
    this.serviceCenterFirebase = new Firebase(this.firebaseBaseURL + 'ServiceCenter/'+serviceCenter.id);
    this.serviceCenterFirebase.on('child_added', function(snapshot) {
      self.handleServiceCenterSnapshot(snapshot);
    });
  },
  setupUserFirebase: function(user) {
    var self = this;
    this.userFirebase = new Firebase(this.firebaseBaseURL + 'User/'+user.id);
    this.userFirebase.on('child_added', function(snapshot) {
      self.handleUserSnapshot(snapshot);
    });
  },
  setupUserLocationFirebase: function(objectId) {
    var self = this;
    if (this.userLocationsHandled.indexOf(objectId) != -1) {
      return;
    };
    this.userLocationsHandled.push(objectId);
    this.userFirebase = new Firebase(this.firebaseBaseURL + 'UserLocation/'+objectId+'/');
    this.userFirebase.on('child_added', function(snapshot) {
      self.handleUserLocationSnapshot(snapshot);
    });
  },
  setupJobStatusFirebase: function(objectId) {
    var self = this;
    if (this.jobStatusHandled.indexOf(objectId) != -1) {
      return;
    };
    this.jobStatusHandled.push(objectId);
    this.userFirebase = new Firebase(this.firebaseBaseURL + 'JobStatus/'+objectId+'/');
    this.userFirebase.on('child_added', function(snapshot) {
      self.handleJobStatusSnapshot(snapshot);
    });
  },
  setupJobFirebase: function(job) {
    var self = this;
    this.jobFirebase = new Firebase(this.firebaseBaseURL + 'Job/'+job.id);
    this.jobFirebase.on('child_added', function(snapshot) {
      self.handleJobSnapshot(snapshot);
    });
  },
  callServiceCenter: function() {
    var self = this;
    var getUser = new ObjectFetcher(user);
    getUser.fetch().then(function(fetchedUser) {
      var phone = fetchedUser.get('serviceCenter').get('phone');
      if (phone) {
        console.log('Phone is ' + phone);
        self.call(phone);
      };
    });
  },
  callContactCenter: function() {
    this.call('7083772974');
  },
  callDriverForJob: function(job) {
    var self = this;
    var jobFetcher = new ObjectFetcher(job);
    jobFetcher.fetch().then(function(job) {
      var phoneNumber = job.get('driverUser').get('phone');
      self.call(phoneNumber);
    }, function(error) {
      console.log('error: ' + error);
    });
  },
  callCustomerForJob: function(job) {
    var self = this;
    var jobFetcher = new ObjectFetcher(job);
    jobFetcher.fetch().then(function(job) {
      var phoneNumber = job.get('customerUser').get('phone');
      self.call(phoneNumber);
    }, function(error) {
      console.log('error: ' + error);
    });
  },
  call: function(phoneNumber) {
    if (app.isCustomer()) {
      window.location = 'tel://'+phoneNumber;
      return;
    }
    if (typeof window.jsHandler !== 'undefined') {
      window.jsHandler.placeCall(phoneNumber);
      return;
    };

    Twilio.Device.connect({
        CallerId:'+17082219579', // Replace this value with a verified Twilio number:
                                 // https://www.twilio.com/user/account/phone-numbers/verified

        Client:phoneNumber //pass in the value of the text field
    });
  },
  setupTwilio: function() {
    var self = this;
    $.get( "getTwilioToken?id="+user.id, function( data ) {
      self.set('twilioToken',data.token);
    });
  },
  initialize: function() {
    this.on('change:user', function(model,newValue) {
      if (newValue) {
        this.set('loggedIn',true);
        if (typeof login !== 'undefined') {
          login.hide();
        }
      } else {
        this.set('loggedIn',false);
      }
    });
    this.on('change:twilioToken', function(model,newValue) {
      if (!newValue) {
        return;
      };
      Twilio.Device.setup(newValue);
      Twilio.Device.incoming(function(connection) {
          //For demo purposed, automatically accept the call
          connection.accept();
          //$('p').html('Call in progress...');
      });
      Twilio.Device.disconnect(function(connection) {
          // $('p').html('Awaiting incoming call...');
      });
      // $('#hangup').click(function() {
      //     Twilio.Device.disconnectAll();
      // });
    });
    if(this.html5_audio()) this.play_html5_audio = true;
  },
  start: function() {
    var currentUser = Parse.User.current();
    if (currentUser) {
      var self = this;
      currentUser.fetch().then(function(user) {
        self.setupUser(user);
      }, function(error) {
        self.showLogin();
      })
    } else {
      this.showLogin();
    }
    window.infoBubbleC = new InfoBubbleC();
  },
  showLogin: function() {
    if (!window.login) {
      window.login = new Login();
    }
    login.show();
  },
  isLoggedIn: function() {
    return (Parse.User.current()) ? true : false;
  },
  login: function(username,password) {
    var self = this;
    Parse.User.logIn(username,password).then(function(user) {
      self.setupUser(user);
    }, function(error) {
      console.log(error);
      alert('Incorrect login, please try again');
      login.resetLogin();
    });
  },
  setupUser: function(user) {
    window.user = user;
    this.set('user',user);
    if (user.get('type') == 'serviceCenterRep') {
      app.setupTwilio();
    };
  },
  logout: function() {
    Parse.User.logOut();
    this.setupUser(undefined);
    this.start();
  },
  askIfServiceNeeded: function() {
    if (!window.serviceRequest) {
      window.serviceRequest = new ServiceRequest();
    }
    serviceRequest.show();
  },
  showServiceCenterAssignmentForJob: function(job) {
    if (window.assignServiceCenter) {
      delete window.assignServiceCenter;
    };
    window.assignServiceCenter = new AssignServiceCenter(job);
    assignServiceCenter.show();
  },
  showDriverAssignmentForJob: function(job) {
    if (window.assignDriver) {
      delete window.assignDriver;
    };
    window.assignDriver = new AssignDriver(job);
    assignDriver.show();
  },
  showJobList: function() {
    if (window.jobList) {
      delete window.jobList;
    };
    window.jobList = new JobList();
    jobList.show();
  },
  zoomMap: function() {
    var locations = null;

    if (this.isCustomerCenter()) {
      locations = customerCenterC.jobMarkers;
    };

    if (this.isServiceCenter()) {
      locations = serviceCenterC.jobMarkers;
      for (var key in serviceCenterC.driverMarkers) {
        locations[key] = serviceCenterC.driverMarkers[key];
      }
    };

    if (this.isDriver()) {
      locations = driverC.jobMarkers;
    };

    if (!locations) {return};

    var bounds = null;

    for(var key in locations) 
    {
      var location = locations[key];
      if (!bounds) {
        var bounds = new google.maps.LatLngBounds(location.position,location.position);
      };
      bounds = bounds.extend(location.position);
    }

    map.fitBounds(bounds);
  },
  addMarkerListener: function(marker) {
    oms.addMarker(marker);
    // window.oms.addListener('click', function(marker, event) {
    //   // iw.setContent(marker.desc);
    //   // iw.open(map, marker);
    //   infoBubbleC.selectMarker(marker);
    // });
    // google.maps.event.addListener(marker, 'click', function(elem) {
    //   infoBubbleC.selectMarker(marker);
    // });
  },
  isCustomer: function() {
    return typeof customerC != 'undefined';
  },
  isCustomerCenter: function() {
    return typeof customerCenterC != 'undefined';
  },
  isServiceCenter: function() {
    return typeof serviceCenterC != 'undefined';
  },
  isDriver: function() {
    return typeof driverC != 'undefined';
  },
  speak: function(textToSpeak) {
    this.play_sound("http://translate.google.com/translate_tts?ie=UTF-8&q="+encodeURIComponent(textToSpeak)+"&tl=en&total=1&idx=0prev=input");  
    console.log('App::Speak: ' + textToSpeak);
  },
  html5_audio: function(){
    var a = document.createElement('audio');
    return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
  },
  play_html5_audio: false,
  play_sound: function(url){
    if(this.play_html5_audio){
        var snd = new Audio(url);
        snd.load();
        snd.play();
    }else{
        $("#sound").remove();
        var sound = $("<embed id='sound' type='audio/mpeg' />");
        sound.attr('src', url);
        sound.attr('loop', false);
        sound.attr('hidden', true);
        sound.attr('autostart', true);
        $('body').append(sound);
    }
  },
  alert: function(alertInfo) {
    alert(alertInfo);
  },
  log: function(logInfo) {
    console.log(logInfo);
  },
  error: function(errorInfo) {
    console.error(errorInfo);
  }


});
