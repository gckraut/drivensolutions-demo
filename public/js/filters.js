angular.module('JobTime', []).filter('JobTime', function() {
  return function(input) {
    return '20 Min';
  };
});

