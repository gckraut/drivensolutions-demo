var CustomerBar = Backbone.View.extend({

  tagName: "div",

  className: "customerBar",

  events: {
    "click .callContactCenterButton":"callContactCenterButton"
  },
  callContactCenterButton: function() {
    app.callContactCenter();
  },
  initialize: function() {
    var self = this;
    $(document.body).append(this.$el);
    this.render();
    customerC.on('change:currentLocation', function(model,newValue) {
        var newlocation = new google.maps.LatLng(newValue.latitude,newValue.longitude);
        geocoder.geocode({'latLng': newlocation}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            self.setAddress(results[0].formatted_address,true)
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      });
    });
    customerC.on('change:currentJob', function(model,newValue) {
      customerBar.render();
    });
  },

  render: function() {
    var self = this;
    var address = null;
    var serviceProvider = null;
    var driver = null;
    var currentJob = customerC.get('currentJob');
    if (currentJob) {
      address = currentJob.get('address');
      serviceProvider = currentJob.get('serviceProvider');
      driver = currentJob.get('driver');
    }
    var data = {
      address: address,
      callServiceProvider: serviceProvider,
      callDriver: driver,
      status: customerC.status()
    };
    loadManager.loadHTML('customerBar.html',data, function(html) {
      self.$el.html(html);
    });
  },
  setStatus: function(newStatus) {
    this.$el.find('.customerStatusBar').html(newStatus);
  },
  setAddress: function(newAddress,useGPS) {
    var field = this.$el.find('.customerAddress');
    if (useGPS) {
      if (field.val().length > 0) {
        return;
      };
    }
    field.val(newAddress);
    var currentJob = customerC.get('currentJob');
    if (currentJob) {
      currentJob.set('address',newAddress);
      currentJob.save();
    }
  }
});
