angular.module('JobTime', []).filter('JobTime', function() {
  return function(input) {
    return moment(input).fromNow();
  };
});

