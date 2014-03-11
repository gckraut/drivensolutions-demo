var STServiceCenter = angular.module('STServiceCenter',['JobTime']);
 
STServiceCenter.controller('STServiceCenterRep', function ($scope,$http) {

  /* BUG FIXES */

  $('.logout').click(function() {
    location.href = 'logout.html';
  });

  /* /BUG FIXES */

  STServiceCenter.selectJobById = function(jobId) {
    $scope.selectedJob = $scope.jobCollection.get(jobId).toJSON();

    var newOptions = STServiceCenter.newOptions();

    var drivers = $scope.drivers;

    var driverOptions = [];
    for (var i = drivers.length - 1; i >= 0; i--) {
      // TODO add location to each of the drivers
      var newOption = 'Assign Job to ' + drivers[i].firstName + ' ' + drivers[i].lastName;
      var optionId = 'driver' + drivers[i].objectId;
      driverOptions.push({
        id: optionId,
        title: newOption
      });
    };

    $scope.newStatusOptions = newOptions.concat(driverOptions);
    var currentStatus = $scope.selectedJob.status;
    if (currentStatus == 'unassigned') {

    }
    if (currentStatus == 'driver') {
      $scope.newStatus = 'enroute';
    };
    if (currentStatus == 'enroute') {
      $scope.newStatus = 'onlocation';
    };
    if (currentStatus == 'onlocation') {
      $scope.newStatus = 'completed';
    };
    if (currentStatus == 'completed') {

    };
    

    $scope.$apply();
    $( "#dialog" ).dialog( {title: $scope.selectedJob.name} );
    $( "#dialog" ).dialog( "open" );
  }

  STServiceCenter.selectDriverById = function(driverId) {
    $scope.selectedDriver = $scope.driverCollection.get(driverId).toJSON();

    $scope.$apply();
    $( "#driverDialog" ).dialog( {title: $scope.selectedDriver.firstName + ' ' + $scope.selectedDriver.lastName} );
    $( "#driverDialog" ).dialog( "open" );
  }

  STServiceCenter.addJobMarkerClick = function(marker) {
    google.maps.event.addListener(marker, 'click', function() {
      for (var jobId in STServiceCenter.customerMarkers) {
        var customerMarker = STServiceCenter.customerMarkers[jobId];
        if (customerMarker == marker) {
          console.log('IT MATCHES!!!');
          STServiceCenter.selectJobById(jobId);
        };
      };
    });
  }


  STServiceCenter.addMarkerClick = function(marker) {
    google.maps.event.addListener(marker, 'click', function() {
      for (var driverId in STServiceCenter.driverMarkers) {
        var driverMarker = STServiceCenter.driverMarkers[driverId];
        if (driverMarker == marker) {
          console.log('IT MATCHES!!!');
          STServiceCenter.selectDriverById(driverId);
        };
      };
    });
  }
  STServiceCenter.baseStatusOptions = [
    {
      id: 'unassigned',
      title: 'Unassigned - No driver assigned'
    },
    {
      id: 'driver',
      title: 'Driver Assigned'
    },
    {
      id: 'enroute',
      title: 'Driver En Route'
    },
    {
      id: 'onlocation',
      title: 'Driver On Location'
    },
    {
      id: 'completed',
      title: 'Job Completed'
    }
  ];
  STServiceCenter.newOptions = function() {
    var newOptions = [];
    for (var i=0; i < STServiceCenter.baseStatusOptions.length; i++) {
      var currentOption = STServiceCenter.baseStatusOptions[i];
      newOptions.push(currentOption);
    }
    return newOptions;
  }
  $scope.newStatusOptions = STServiceCenter.newOptions();
  $scope.setSelectedJobKind = function (value) {
      if ($scope.selectedJobKind === value) {
          $scope.selectedJobKind = undefined;
      } else {
          $scope.selectedJobKind = value;
      }
  };
  $scope.driverCollection = new DriverCollection();
  $scope.driverCollection.setServiceCenter(Parse.User.current().get('serviceCenter'));

  STServiceCenter.applyStatusUpdate = function() {
    var newStatus = $scope.newStatus;
    var tempJob = new Job();
    tempJob.objectId = $scope.selectedJob.objectId;
    if (newStatus == 'completed') {
      var askUser = confirm('Are you sure the job is completed?');
      if (!askUser) {
        return;
      };
    };

    if (!!~newStatus.indexOf('driver')) {
      var driverId = newStatus.substring(6);
      console.log('driverId');
      newStatus = 'driver';
      var jobId = tempJob.objectId;
      console.log(driverId,jobId);
      Parse.Cloud.run('assignJobToDriver',{jobId:jobId,driverId:driverId}).then(function(success) {
        console.log('Assigned job successfully');
        console.log(success);
        STServiceCenter.reloadDrivers();
      }, function(error) {
        console.error('An error occurred while assigning the job');
        console.error(error);
      });
    };
    tempJob.set('status',newStatus);
    $scope.selectedJob.status = newStatus;
    tempJob.save().then(function(success) {
      STServiceCenter.updateJobStatus({
        objectId: tempJob.objectId,
        status: newStatus
      });
    })
  }

  STServiceCenter.callDriver = function() {
    app.call($scope.selectedDriver.objectId);
  }

  STServiceCenter.setupCustomerMarkers = function() {
    if (STServiceCenter.customerMarkers) {
      for (var objectId in STServiceCenter.customerMarkers) {
        var marker = STServiceCenter.customerMarkers[objectId];
        marker.setMap(null);
      }
    };
    STServiceCenter.customerMarkers = {};

    var jobs = $scope.jobCollection.toJSON();
    for (var i = jobs.length - 1; i >= 0; i--) {
      var job = jobs[i];
      if (!job.location) {
        continue;
      };
      if (job.status == 'completed') {
        continue;
      };
      var newLocation = new google.maps.LatLng(job.location.latitude,job.location.longitude);
      var customerMarker = new google.maps.Marker({
        map: map,
        title: job.name,
        position: newLocation,
        icon: 'img/userMapIcon.png'
      });
      STServiceCenter.addJobMarkerClick(customerMarker);
      STServiceCenter.customerMarkers[job.objectId] = customerMarker;
    };
  }

  STServiceCenter.setupDriverMarkers = function() {
    if (STServiceCenter.driverMarkers) {
      for (var objectId in STServiceCenter.driverMarkers) {
        var marker = STServiceCenter.driverMarkers[objectId];
        marker.setMap(null);
      }
    };
    STServiceCenter.driverMarkers = {};
    var drivers = $scope.driverCollection.toJSON();
    for (var i = drivers.length - 1; i >= 0; i--) {
      var driver = drivers[i];
      var newLocation = new google.maps.LatLng(driver.location.latitude,driver.location.longitude);
      app.setupUserLocationFirebase(driver.objectId);
      var driverMarker = new google.maps.Marker({
        map: map,
        title: driver.firstName + ' ' + driver.lastName,
        position: newLocation,
        icon: 'img/driverMapIcon.png'
      });
      STServiceCenter.addMarkerClick(driverMarker);
      STServiceCenter.driverMarkers[driver.objectId] = driverMarker;
    };

  };
  STServiceCenter.setupJobMarkers = function() {

  };
  STServiceCenter.updateJobMarker = function(jobTemp) {

  };

  STServiceCenter.updateJobStatus = function(jobTemp) {
    var status = jobTemp.status;
    var objectId = jobTemp.objectId;
    var job = _.findWhere($scope.jobs,{objectId:objectId});
    if (job) {
      console.log('old status:' + job.status);
      job.status = status;
      console.log('new status:' + job.status);
      $scope.$apply();
    };
  }
  STServiceCenter.updateDriverMarker = function(driverTemp) {
    var location = driverTemp.location;
    var objectId = driverTemp.objectId;
    var marker = STServiceCenter.driverMarkers[objectId];
    if (marker) {
      var newLocation = new google.maps.LatLng(location.latitude,location.longitude);
      marker.setPosition(newLocation);
    };
  };


  STServiceCenter.reloadDrivers = function() {
    $scope.driverCollection.fetch().then(function(collection) {
      var drivers = collection.toJSON();
      var rawDrivers = collection.toArray();
      for (var i = drivers.length - 1; i >= 0; i--) {
        var driver = drivers[i];
        var rawDriver = rawDrivers[i];
        if (driver.jobs) {
          driver.jobs = [];
          var jobs = rawDriver.get('jobs');
          for (var j = 0; j < jobs.length; j++) {
            if (!jobs[j]) {
              continue;
            };
            if (jobs[j].get('status') == 'completed') {
              continue;
            };
            driver.jobs.push(jobs[j].toJSON());
          };
        };
      };
      $scope.drivers = drivers;
      console.log('scope::drivers',$scope.drivers);
      STServiceCenter.setupDriverMarkers();
      $scope.$apply();
      $('.assignJob').droppable({
        drop: function( event, ui ) {
          var driverId = $(event.target).attr('objectId');
          var jobId = $(event.srcElement).attr('objectId');
          if (!jobId) {
            jobId = $(event.srcElement).parents('.jobListItem').attr('objectId');
          };
          console.log(driverId,jobId);
          Parse.Cloud.run('assignJobToDriver',{jobId:jobId,driverId:driverId}).then(function(success) {
            console.log('Assigned job successfully');
            console.log(success);
            STServiceCenter.reloadDrivers();
          }, function(error) {
            console.error('An error occurred while assigning the job');
            console.error(error);
          });
        },
        tolerance: 'pointer'
      });
      $('.assignJob').hide();
      $('.driverNameInList').click(function(e) {
          // $(this).find('.customerDetailTab').toggle();
          var driverId = $(this).attr('objectId');
          if (!driverId) {
            driverId = $(this).parents('.jobListItem').attr('objectId'); //TODO This should be moved to a helper function
          };

          STServiceCenter.selectDriverById(driverId);
        });
      console.log('created droppable');
    });
  }

  STServiceCenter.reloadDrivers();

  $scope.jobCollection = new CurrentJobCollection();

  STServiceCenter.reloadJobs = function() {
    return $scope.jobCollection.fetch().then(function(collection) {
        $scope.jobs = collection.toJSON();
        STServiceCenter.setupCustomerMarkers();
        for (var i = $scope.jobs.length - 1; i >= 0; i--) {
          var job = $scope.jobs[i];
          app.setupJobStatusFirebase(job.objectId);
        }
        $scope.$apply();
        $('.jobListItem').draggable({
          helper: 'clone',
          start: function( event, ui ) {
            $("#sectionAccordion").accordion({active:1});
            $('.assignJob').show();
            $('.assignedJob').hide();
          },
          stop: function( event, ui) {
            $("#sectionAccordion").accordion({active:0});
            $('.assignJob').hide();
            $('.assignedJob').show();
          },
          appendTo: 'body'
        });
        $('.jobListItem').click(function(e) {
          // $(this).find('.customerDetailTab').toggle();
          var jobId = $(this).attr('objectId');
          if (!jobId) {
            jobId = $(this).parents('.jobListItem').attr('objectId'); //TODO This should be moved to a helper function
          };
          STServiceCenter.selectJobById(jobId);

        });
        $('.jobPhone').click(function(e) {
          var phone = $(e.target).html();
          app.call(phone);
        });

        $('.jobAddress').click(function(e) {
          var target = $(e.target);
          var lat = target.attr('lat');
          var lng = target.attr('lng');
          if (!lat || !lng) {
            console.log('invalid coords',lat,lng);
            return;
          };
          var newLocation = new google.maps.LatLng(lat,lng);
          map.panTo(newLocation);
        });

        console.log('created draggable');
        return new Parse.Promise.as(collection);
      });
  }
  STServiceCenter.reloadJobs();
  

  // $http.get('phones/phones.json').success(function(data) {
  //     $scope.phones = data;
  // });


  // $scope.jobs = [
  //   {'number': '192938',
  //    'entryTime':'20 min',
  //    'name':'Daniel Slowinski',
  //    'type': 'out of gas',
  //    'kind':'AAA'},
  //   {'number': '192939',
  //    'entryTime':'20 min',
  //    'name':'Daniel Slowinski',
  //    'type': 'out of gas',
  //    'kind':'Cash'},
  //   {'number': '192940',
  //    'entryTime':'20 min',
  //    'name':'Daniel Slowinski',
  //    'type': 'out of gas',
  //    'kind':'Cash'}
  // ];
  $scope.jobKinds = ["All","Account","AAA","Cash","Completed"];
  $scope.selectedJobKind = 'All';
  $scope.ShowJobs = function(input) {
    if (input.kind == $scope.selectedJobKind || $scope.selectedJobKind == 'All') {
      if (input.status == 'completed') {
        return null;
      };
      return input;
    };
    if (input.status == 'completed' && $scope.selectedJobKind == 'Completed') {
      return input;
    };
    return null;
  };

  $scope.JobTime = function(input) {
    console.log(input);
    return '20 min';
  };
  $scope.openNewJobContainer = function() {
    $('.newJobContainer').show();
  }
  $scope.closeNewJobContainer = function() {
    $('.newJobContainer').hide();
    $scope.newName = null;
    $scope.newPhone = null;
    $scope.newCar = null;
    $scope.newAddress = null;
    $scope.newerAddress = null;
    $scope.newNotes = null;
    $scope.newServices = null;
    $scope.newKind = null;
    if ($scope.newMarker) {
      $scope.newMarker.setMap(null);
      delete $scope.newMarker;
     };
  }
  $scope.addCustomer = function() {
    console.log($scope.newAddress);
    // var newJob = new Job({
    //     name: $('#newJobCustomerName').val(),
    //     phone: $('#newJobCustomerPhone').val(),
    //     address: $('#newJobCustomerAddress').val(),
    //     notes: $('#newJobCustomerNotes').val(),
    //     services: $('#newJobCustomerServiceRequested').val(),
    //     kind: $('#newJobCustomerKind').val()
    // });
    if (!$scope.newMarker) {
        alert('You cannot create a new customer without locating them first!');
        return;
    };
    var newJob = new Job({
        name: $scope.newName,
        phone: $scope.newPhone,
        car: $scope.newCar,
        address: $scope.newAddress,
        locateAddress: $scope.newerAddress,
        notes: $scope.newNotes,
        services: $scope.newServices,
        kind: $scope.newKind
    });
    if ($scope.newerAddress) {
      newJob.set('locateAddress',$scope.newerAddress);
      newJob.set('address',$scope.newerAddress);
    };
    newJob.set('location',new Parse.GeoPoint($scope.newMarker.getPosition().lat(),$scope.newMarker.getPosition().lng()));
    newJob.save().then(function(newlyCreatedJob) {
        STServiceCenter.reloadJobs().then(function(status) {
          STServiceCenter.selectJobById(newlyCreatedJob.id);
        })
        $scope.closeNewJobContainer();
    });
  }
  $scope.locateAddress = function() {
    console.log($scope.newAddress);
     $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.newAddress + '&sensor=false&key=AIzaSyCbSW2hxzwURwVngm-pvK0zk9KB7HyTGfs').success(function(data) {
       console.log(data);
       var fullAddress = data.results[0].formatted_address;
       var location = data.results[0].geometry.location;
       console.log(fullAddress);
       console.log(location);
       $scope.detectedAddress = fullAddress;
       $scope.newerAddress = fullAddress;
       $scope.newLocation = location;
       var newLocation = new google.maps.LatLng(location.lat,location.lng);
       map.setCenter(newLocation);
       if ($scope.newMarker) {
        $scope.newMarker.setMap(null);
        delete $scope.newMarker;
       };
       $scope.newMarker = new google.maps.Marker({
          map: map,
          title: 'New Job',
          position: newLocation,
          draggable: true
        });
       google.maps.event.addListener($scope.newMarker, 'dragend', function() {
            var position = $scope.newMarker.getPosition();
            $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.lat() + ',' + position.lng() + '&sensor=false').success(function(data) {
               console.log(data);
               var fullAddress = data.results[0].formatted_address;
               var location = data.results[0].geometry.location;
               console.log(fullAddress);
               console.log(location);
               $scope.detectedAddress = fullAddress;
               $scope.newerAddress = fullAddress;
               $scope.newLocation = location;
           });
       });
     });
  }
  window.myScope = $scope;
  console.log('OMG');
});