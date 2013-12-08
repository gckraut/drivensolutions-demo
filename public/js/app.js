var App = Backbone.Model.extend({
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
      delete window.customerBar;
      return;
    }
    var typeTest = user.get('type');
    if (typeTest == 'customer') {
      window.customerC = new CustomerC;
      window.customerC.set('user',user);
      window.customerBar = new CustomerBar();
    }
    if (typeTest == 'customerCenter') {
      window.customerCenterC = new CustomerCenterC();
      window.customerCenterC.set('user',user);
      mainNav.render();
    }
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
  zoomMap: function() {
    var locations = null;

    if (typeof customerCenterC != 'undefined') {
      locations = customerCenterC.jobMarkers;
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
  }
});
