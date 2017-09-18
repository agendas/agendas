angular.module("agendasApp")
  .component("consoleDetail", {
    templateUrl: "console/detail/detail.html",
    controller: function($scope, $state, $stateParams, $mdDialog, $rootScope) {
      $scope.app = {};
      $scope.key = $stateParams.app;

      $scope.appRef = firebase.database().ref("/apps/" + $stateParams.app);
      $scope.appRef.on("value", function(data) {
        $scope.app = data.exists() ? data.val() : {};
        $scope.$digest();
      });

      $scope.delete = function(event) {
        $mdDialog.show(
          $mdDialog.confirm()
            .title("Delete \"" + ($scope.app.name || "") + "\"?")
            .textContent(($scope.app.name || "This app") + " will stop working immediately. This cannot be undone.")
            .cancel("Cancel")
            .ok("Delete")
            .targetEvent(event)
        ).then(function() {
          return $scope.appRef.remove();
        }).then(function() {
          return firebase.database().ref("/users/" + $rootScope.user.uid + "/createdApps/" + $stateParams.app).remove();
        }).then(function() {
          $scope.appRef.off();
          $scope.appRef = null;
          $state.go("console");
          $mdDialog.show(
            $mdDialog.alert()
              .title("App deleted")
              .ok("Done")
              .clickOutsideToClose(true)
              .escapeToClose(true)
          );
        })
      };
    }
  })
