angular.module("agendasApp")
  .component("agendaSettings", {
    templateUrl: "agenda-settings/agenda-settings.html",
    bindings: {
      agenda: "=",
      permissions: "="
    },
    controller: function($scope, $timeout, $stateParams) {
      $scope.usernames = {};
      $scope.getUsername = function(uid) {
        if ($scope.usernames[uid] || $scope.usernames[uid] === false) {
          return $scope.usernames[uid];
        } else {
          $scope.usernames[uid] = false;
          firebase.database().ref("/users/" + uid + "/username").once("value").then(function(data) {
            $scope.usernames[uid] = data.val();
            $timeout();
          });
        }
      };

      this.addPermission = function() {
        var permissions = this.permissions;
        firebase.database().ref("/usernames").child($scope.usernameToAdd).once("value").then(function(data) {
          if (data.exists() && !permissions[data.val()]) {
            firebase.database().ref("/permissions/" + $stateParams.agenda).child(data.val()).set($scope.roleToAdd).then(function() {
              $scope.usernameToAdd = "";
              $scope.roleToAdd = null;
              $timeout();
            });
            $scope.usernameInvalid && $timeout();
            $scope.usernameInvalid = false;
          } else {
            $scope.usernameInvalid || $timeout();
            $scope.usernameInvalid = true;
          }
        });
      };

      this.changeName = function(name) {
        firebase.database().ref("/agendas/" + $stateParams.agenda).child("name").set(name);
      };

      this.changePermission = function(user, role) {
        if (role === "none") {
          firebase.database().ref("/permissions/" + $stateParams.agenda).child(user).remove();
        } else {
          firebase.database().ref("/permissions/" + $stateParams.agenda).child(user).set(role);
        }
      };
    }
  });
