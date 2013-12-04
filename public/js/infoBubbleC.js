var InfoBubbleC = Backbone.Model.extend({
  initialize: function() {
    this.infoBubble = new InfoBubble({
      maxWidth: 320
    });
  },
  selectMarker: function(marker) {
    this.set('marker',marker);
    
    this.setupMarker();

  },
  clearLoaded: function() {
  	this.loadCount = 0;
  	this.finalLoadCount = 0;
  },
  setupMarker: function() {
  	var marker = this.get('marker');
  	var type = marker.dsType;
  	var identifier = marker.dsIdentifier;
  	if (type == 'Job') {
  		var jobSearch = jobCollection.filter(function(obj){return obj.id == identifier});
  		if (jobSearch.length > 0) {
  			this.setupJob(jobSearch[0]);
  		}
  	}
  },
  setupJob: function(job) {
  	this.set('job',job);
  	var removeCount = this.infoBubble.tabs_.length;
  	for (var i = removeCount - 1; i >= 0; i--) {
  		this.infoBubble.removeTab(0);
  	};
  	var customer = job.get('customerUser');
  	var customerData = 'No customer assigned';
  	if (customer) {
  		customerData = JSON.stringify(customer.toJSON());
  	};
  	var serviceCenter = job.get('serviceCenter');
  	var serviceCenterData = 'No service center assigned';
  	if (serviceCenter) {
  		serviceCenterData = JSON.stringify(serviceCenter.toJSON());
  	}
  	var driver = job.get('driver');
  	var driverData = 'No service center assigned';
  	if (driver) {
  		driverData = JSON.stringify(driver.toJSON());
  	}
  	this.infoBubble.addTab('Customer',customerData);
  	this.infoBubble.addTab('Service Center',serviceCenterData);
  	this.infoBubble.addTab('Driver',driverData);
  	this.infoBubble.open(map,this.get('marker'));
  }

});
