var InfoBubbleC = Backbone.View.extend({
  events: {
    "click .callCustomerButton":"callCustomerButton"
  },
  callCustomerButton: function() {
    var self = this;
    app.callCustomerForJob(this.job);
    this.job.set('contactedByContactCenter',true);
    this.job.save().then(function(success) {
      self.setupMarker();
    });
  },
  assignServiceCenter: function() {
    app.showServiceCenterAssignmentForJob(this.job);
  },
  assignDriver: function() {
    app.showDriverAssignmentForJob(this.job);
  },
  initialize: function() {
    this.infoBubble = new InfoBubble({
      maxWidth: 320
    });
  },
  selectMarker: function(marker) {
    if (this.infoBubble.isOpen && this.marker != marker) {
      this.infoBubble.close();
    };
    this.marker = marker;
    
    this.setupMarker();

  },
  clearLoaded: function() {
  	this.loadCount = 0;
  	this.finalLoadCount = 0;
  },
  setupMarker: function() {
    var job = this.getJob();
    if (job) {
      this.setupJob(this.getJob());
    };
    var driver = this.getDriver();
    if (driver) {
      this.setupdriver(this.getDriver());
    };
  },
  getJob: function() {
    var marker = this.marker;
    var type = marker.dsType;
    var identifier = marker.dsIdentifier;
    if (type == 'Job') {
      var jobSearch = jobCollection.filter(function(obj){return obj.id == identifier});
      if (jobSearch.length > 0) {
        return jobSearch[0];
      }
      return null;
    }
  },
  getDriver: function() {
    var marker = this.marker;
    var type = marker.dsType;
    var identifier = marker.dsIdentifier;
    if (type == 'Driver') {
      var driverSearch = driverCollection.filter(function(obj){return obj.id == identifier});
      if (driverSearch.length > 0) {
        return driverSearch[0];
      }
      return null;
    }
  },
  resetBubble: function() {
    this.clearLoaded();
    var removeCount = this.infoBubble.tabs_.length;
    for (var i = removeCount - 1; i >= 0; i--) {
      this.infoBubble.removeTab(0);
    };
  },
  setupJob: function(job) {
    var jobFetcher = new ObjectFetcher(job);
    var self = this;
    jobFetcher.fetch().then(function(fetchedJob) {
      self.job = fetchedJob;
      self.resetBubble();
      self.addJobTab(self.job);
    });
   //  this.job = job;
   //  this.resetBubble();
  	// this.addJobTab(job);
  	// this.addServiceCenterTab(job.get('serviceCenter'));
  	// this.addDriverTab(job.get('driver'));
  },
  setupdriver: function(driver) {
    var driverFetcher = new ObjectFetcher(driver);
    var self = this;
    driverFetcher.fetch().then(function(fetchedDriver) {
      self.driver = fetchedDriver;
      self.resetBubble();
      self.addDriverTab(self.driver);
    })
  },
  addJobTab: function(job) {
    var customer = job.get('customerUser');
    this.finalLoadCount++;
    this.customer = customer;
    var customerData = 'No customer assigned';
    if (customer) {
      customerData = JSON.stringify(customer.toJSON());
    }
    var serviceCenter = job.get('serviceCenter');
    if (serviceCenter) {
      serviceCenter = serviceCenter.toJSON();
    };
    var driver = job.get('driverUser');
    if (driver) {
      driver = driver.toJSON();
    };
    var self = this;
    var data = {
      name: customer.get('firstName') + ' ' + customer.get('lastName'),
      status:job.get('status'),
      date:moment(job.createdAt).format('MMMM Do YYYY, h:mm:ss a'),
      service:job.get('service').get('name'),
      contactedByContactCenter: ((job.get('contactedByContactCenter')) ? 'Yes':'No'),
      serviceCenter:serviceCenter,
      driver: driver,
      isCustomerCenter: app.isCustomerCenter(),
      isServiceCenter: app.isServiceCenter()
    }
    loadManager.loadHTML('customerInfoBubble.html',data, function(html) {
      //self.$el.html(html);
      self.infoBubble.addTab('Customer',html);
      self.finishRender();
    });
  },
  addServiceCenterTab: function(serviceCenter) {
    this.finalLoadCount++;
    var serviceCenterData = 'No service center assigned';
    if (serviceCenter) {
      serviceCenterData = JSON.stringify(serviceCenter.toJSON());
    }
    var self = this;
    var data = {}
    loadManager.loadHTML('serviceCenterInfoBubble.html',data, function(html) {
      //self.$el.html(html);
      self.infoBubble.addTab('Service Center',html);
      self.finishRender();
    });
  },
  addDriverTab: function(driver) {
    this.finalLoadCount++;
    var driverData = 'No driver assigned';
    if (driver) {
      driverData = JSON.stringify(driver.toJSON());
    }
    var self = this;
    var data = {}
    loadManager.loadHTML('driverInfoBubble.html',data, function(html) {
      //self.$el.html(html);
      self.infoBubble.addTab('Driver',html);
      self.finishRender();
    });
  },
  finishRender: function() {
    this.loadCount++;
    if (this.finalLoadCount === this.loadCount) {
      if (!this.infoBubble.isOpen()) {
        this.infoBubble.open(map,this.marker);
      }
    }
  }
});
