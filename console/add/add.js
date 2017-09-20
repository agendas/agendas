angular.module("agendasApp")
  .component("consoleAdd", {
    templateUrl: "console/add/add.html",
    controller: function($scope, $http, $rootScope, $state, $mdDialog) {
      $scope.appName = "";

      firebase.auth().onAuthStateChanged(function(user) {
        $scope.maxRef = firebase.database().ref("/users/" + user.uid + "/maxApps").on("value", function(max) {
          $scope.max = max.exists() ? max.val() : 0;
          $scope.$digest();
        });
      });

      $scope.$watch(function() {
        $scope.limitReached = $scope.max === 0 || ($scope.max !== -1 && $rootScope.developerApps && $rootScope.developerApps.length >= $scope.max);
      })

      $scope.save = function() {
        $scope.saving = true;
        $scope.error = false;
        $rootScope.user.getIdToken().then(function(token) {
          return $http.post("https://api.agendas.co/api/v1/createdapps", null, {
            headers: {Authorization: "Firebase " + token}
          });
        }).then(function(response) {
          return Promise.all([firebase.database().ref("/apps/" + response.data.key + "/name").set($scope.appName), Promise.resolve(response.data.key)]);
        }).then(function(result) {
          $scope.saving = false;
          $scope.appName = undefined;
          $state.go("consoledetail", {app: result[1]});
          $scope.$digest();
        }).catch(function(e) {
          $scope.saving = false;
          $scope.error  = true;
          $scope.$digest();

          console.log(e);
        });
      };

      $scope.requestApps = function() {
        $mdDialog.show({
          template: "<console-request type='maxapps'></console-request>",
          targetEvent: event
        });
      };
    }
  })
