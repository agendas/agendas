angular.module("agendasApp")
  .component("agendaSettings", {
    templateUrl: "agenda-settings/agenda-settings.html",
    bindings: {
      agenda: "=",
      permissions: "="
    },
    controller: function($scope, $timeout, $state, $stateParams, $mdDialog, $rootScope) {
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
              firebase.database().ref("/users/" + data.val() + "/agendas/" + $stateParams.agenda).set(true);
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
          firebase.database().ref("/users/" + user + "/agendas/" + $stateParams.agenda).remove();
        } else {
          firebase.database().ref("/permissions/" + $stateParams.agenda).child(user).set(role);
        }
      };

      var agenda = this.agenda;
      this.deleteAgenda = function() {
        $mdDialog.show($mdDialog.confirm()
          .title("Delete \"" + agenda.name + "\"?")
          .cancel("Cancel")
          .ok("Delete")
        ).then(function() {
          return Promise.all([
            firebase.database().ref("/agendas/" + $stateParams.agenda).remove(),
            firebase.database().ref("/categories/" + $stateParams.agenda).remove(),
            firebase.database().ref("/schedules/" + $stateParams.agenda).remove(),
            firebase.database().ref("/tasks/" + $stateParams.agenda).remove(),
            firebase.database().ref("/users/" + $rootScope.user.uid + "/agendas/" + $stateParams.agenda).remove()
          ]);
        }).then(function() {
          return firebase.database().ref("/permissions/" + $stateParams.agenda).remove();
        }).then(function() {
          $state.go("home");
        });
      };
    }
  });
