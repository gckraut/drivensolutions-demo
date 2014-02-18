var STServiceCenter = angular.module('STServiceCenter',['JobTime']);
 
STServiceCenter.controller('STServiceCenterRep', function ($scope,$http) {
  $scope.setSelectedJobKind = function (value) {
      if ($scope.selectedJobKind === value) {
          $scope.selectedJobKind = undefined;
      } else {
          $scope.selectedJobKind = value;
      }
  };
  $scope.driverCollection = new DriverCollection();
  $scope.driverCollection.setServiceCenter(Parse.User.current().get('serviceCenter'));

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
            driver.jobs.push(jobs[j].toJSON());
          };
        };
      };
      $scope.drivers = drivers;
      console.log('scope::drivers',$scope.drivers);
      $scope.$apply();
      $('.assignJob').droppable({
        drop: function( event, ui ) {
          var driverId = $(event.target).attr('objectId');
          var jobId = $(event.srcElement).attr('objectId');
          if (!jobId) {
            window.jobTest = $(event.srcElement);
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
      console.log('created droppable');
    });
  }

  STServiceCenter.reloadDrivers();

  $scope.jobCollection = new CurrentJobCollection();

  STServiceCenter.reloadJobs = function() {
    $scope.jobCollection.fetch().then(function(collection) {
        $scope.jobs = collection.toJSON();
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
          $(this).find('.customerDetailTab').toggle();
        });
        $('.customerDetailTab').hide();
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
          map.setCenter(newLocation);
        });

        console.log('created draggable');
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
  $scope.jobKinds = ["All","AAA","Cash"];
  $scope.selectedJobKind = 'All';
  $scope.ShowJobs = function(input) {
    console.log(input);
    if (input.kind == $scope.selectedJobKind || $scope.selectedJobKind == 'All') {
        return input;
    };
    return null;
  };

  $scope.JobTime = function(input) {
    return '20 min';
  };
  $scope.openNewJobContainer = function() {
    $('.newJobContainer').show();
  }
  $scope.closeNewJobContainer = function() {
    $('.newJobContainer').hide();
    $scope.newName = null;
    $scope.newPhone = null;
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
        address: $scope.newAddress,
        locateAddress: $scope.newerAddress,
        notes: $scope.newNotes,
        services: $scope.newServices,
        kind: $scope.newKind
    });
    newJob.set('location',new Parse.GeoPoint($scope.newMarker.getPosition().lat(),$scope.newMarker.getPosition().lng()));
    newJob.save().then(function() {
        STServiceCenter.reloadJobs();
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