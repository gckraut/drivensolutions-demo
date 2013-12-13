var App = Backbone.Model.extend({
  firebaseBaseURL: 'https://driven.firebaseIO.com/',
  handleNewJobSnapshot: function(snapshot) {
    // Refresh Call Center
  },
  handleServiceCenterSnapshot: function(snapshot) {
    // Refresh Service Center
  },
  handleUserSnapshot: function(snapshot) {
    // Refresh Driver
  },
  handleJobSnapshot: function(snapshot) {
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
  setupJobFirebase: function(job) {
    var self = this;
    this.jobFirebase = new Firebase(this.firebaseBaseURL + 'Job/'+job.id);
    this.jobFirebase.on('child_added', function(snapshot) {
      self.handleJobSnapshot(snapshot);
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

    Twilio.Device.connect({
        CallerId:'+17083772974', // Replace this value with a verified Twilio number:
                                 // https://www.twilio.com/user/account/phone-numbers/verified

        PhoneNumber:phoneNumber //pass in the value of the text field
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
    if (typeof user === 'undefined') {
      // delete customerC and customerBar / others
      delete window.customerC;
      delete window.customerCenterC;
      delete window.serviceCenterC;
      delete window.driver;
      delete window.customerBar;
      delete window.driverBar;
      return;
    }
    this.setupTwilio();
    var typeTest = user.get('type');
    if (typeTest == 'customer') {
      window.customerC = new CustomerC;
      window.customerC.set('user',user);
      window.customerBar = new CustomerBar();
    }
    if (typeTest == 'customerCenter') {
      window.customerCenterC = new CustomerCenterC();
      window.customerCenterC.set('user',user);
    }
    if (typeTest == 'serviceCenterRep') {
      window.serviceCenterC = new ServiceCenterC();
      window.serviceCenterC.set('user',user);
      window.serviceCenterC.set('serviceCenter',user.get('serviceCenter'));
    };
    if (typeTest == 'driver') {
      window.driverC = new DriverC();
      window.driverC.set('user',user);
      window.driverBar = new DriverBar();
    };
    mainNav.render();
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
    google.maps.event.addListener(marker, 'click', function(elem) {
      infoBubbleC.selectMarker(marker);
    });
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


});
