angular.module("agendasApp")
  .directive("timePicker", function() { return {
    template: "<md-input-container md-no-float md-is-error='error'><input ng-model='input' ng-change='updateValue()' type='text' placeholder='{{placeholder}}' /></md-input-container>",
    transclude: false,
    restrict: "E",
    scope: {
      use24Hours: "<use24Hours",
      value: "=ngModel",
      placeholder: "@placeholder"
    },
    controller: function($scope) {
      $scope.error = false;
      $scope.$watch("value", function() {
        var value = $scope.value;
        if (!isNaN(value)) {
          var hour = Math.floor(value / 60);
          var minute = value - (hour * 60);
          var minuteStr = (minute < 10) ? ("0" + minute) : minute;
          if ($scope.use24Hours) {
            $scope.input = hour + ":" + minuteStr;
          } else {
            var pm = (hour >= 12);
            var hr = hour - (pm ? 12 : 0);
            $scope.input = ((hr <= 0) ? 12 : hr) + ":" + minuteStr + (pm ? "pm" : "am");
          }
        } else {
          $scope.input = "";
        }
      });
      $scope.updateValue = function() {
        if ($scope.input === "") {
          $scope.error = false;
          $scope.value = undefined;
        } else {
          var results = /^ *0*([12]?[0123456789]) *: *([012345][0123456789]) *(am|pm)? *$/i.exec($scope.input);
          if (results && (results.length >= 3) && (results.length <= 4)) {
            var hour = parseInt(results[1]);
            var minute = parseInt(results[2]);
            if (!results[3]) {
              $scope.error = (hour >= 24);
              if (hour < 24) {
                $scope.value = hour * 60 + minute;
              }
            } else {
              if (hour <= 12) {
                hour = (hour == 12) ? 0 : hour;
                hour = (results[3].toLowerCase() == "pm") ? (hour + 12) : hour;
                $scope.error = false;
                $scope.value = hour * 60 + minute;
              } else {
                $scope.error = true;
              }
            }
          } else {
            $scope.error = true;
          }
        }
      };
    }
  }})
