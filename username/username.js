angular.module("agendasApp")
  .component("usernameDialog", {
    templateUrl: "username/username.html",
    controller: function($scope, $mdDialog, $rootScope) {
      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.username = $rootScope.username;

      $scope.saveUsername = function(username) {
        $scope.saving = true;
        $scope.error = false;

        var usernamesRef = firebase.database().ref("/usernames");

        usernamesRef.child(username).once("value").then(function(data) {
          if (data.exists()) {
            throw new Error("Username taken");
          } else if ($rootScope.username) {
            return usernamesRef.child($rootScope.username).remove();
          }
        }).then(function() {
          if (username.length > 0) {
            return firebase.database().ref("/users/" + $rootScope.user.uid + "/username").set(username);
          }
        }).then(function() {
          return usernamesRef.child(username).set($rootScope.user.uid);
        }).then(function() {
          $scope.saving = false;
          $mdDialog.hide();
        }).catch(function(e) {
          $scope.saving = false;
          $scope.error = true;
          console.log(e);
          $scope.$digest();
        });
      };
    }
  })
