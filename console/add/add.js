angular.module("agendasApp")
  .component("consoleAdd", {
    templateUrl: "console/add/add.html",
    controller: function($scope, $http, $rootScope, $state) {
      $scope.save = function() {
        $scope.saving = true;
        $scope.error = false;
        $rootScope.user.getIdToken().then(function(token) {
          return $http.post("https://api.agendas.co/api/v1/newapp", null, {
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
    }
  })
