angular.module("agendasApp")
  .component("agendaSettings", {
    templateUrl: "agenda-settings/agenda-settings.html",
    bindings: {
      agenda: "="
    },
    controller: function($scope, $timeout, $state, $stateParams, $mdDialog, $rootScope, db) {
      $scope.agendaRef = db.collection("agendas").doc($stateParams.agenda);

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
        var permissions = $scope.permissions;
        firebase.database().ref("/usernames").child($scope.usernameToAdd).once("value").then(function(data) {
          if (data.exists() && !permissions[data.val()]) {
            var update = {};
            update[data.val()] = true;
            if ($scope.roleToAdd === "editor") {
              update["permissions." + data.val()] = {
                complete_tasks: true,
                edit_tags: true,
                edit_tasks: true,
                manage: true
              };
            }
            $scope.agendaRef.update(update).then(function() {
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
        $scope.agendaRef.update({name: name});
      };

      this.changePermission = function(user, role) {
        if (role === "none") {
          var permissions = {};
          permissions[user] = firebase.firestore.FieldValue.delete();
          permissions["permissions." + user] = firebase.firestore.FieldValue.delete();
          $scope.agendaRef.update(permissions);
        } else if (role === "editor") {
          var permissions = {};
          permissions["permissions." + user] = {
            complete_tasks: true,
            edit_tags: true,
            edit_tasks: true,
            manage: true
          };
          $scope.agendaRef.update(permissions);
        } else {
          var permissions = {};
          permissions["permissions." + user] = firebase.firestore.FieldValue.delete();
          $scope.agendaRef.update(permissions);
        }
      };

      var agenda = this.agenda;
      var deleteBatch = function(query, batchSize) {
        return query.get().then(function(data) {
          if (data.size < 1) {
            return 0;
          }

          var batch = db.batch();
          data.forEach(function(doc) {
            batch.delete(doc.ref);
          });

          return batch.commit().then(function() {
            return data.size;
          });
        }).then(function(count) {
          if (count >= batchSize) {
            return $timeout(undefined, 0, false).then(function() {
              return deleteBatch(query, batchSize);
            });
          }
        });
      };
      var deleteCollection = function(collection) {
        var batchSize = 1000;
        return deleteBatch(collection.limit(batchSize), batchSize);
      };
      this.deleteAgenda = function() {
        $mdDialog.show($mdDialog.confirm()
          .title("Delete \"" + agenda.name + "\"?")
          .cancel("Cancel")
          .ok("Delete")
        ).then(function() {
          return Promise.all([
            deleteCollection($scope.agendaRef.collection("tags")),
            deleteCollection($scope.agendaRef.collection("tasks"))
          ]);
        }).then(function() {
          return $scope.agendaRef.delete();
        }).then(function() {
          $state.go("home");
        });
      };

      $scope.$watch(function() {
        return $scope.$ctrl.agenda;
      }, function(agenda) {
        $scope.permissions = {};
        Object.keys(agenda).forEach(function(permission) {
          if (permission !== "name" && permission !== "permissions") {
            var permissions = agenda.permissions[permission];
            if (!permissions) {
              $scope.permissions[permission] = "viewer";
            } else if (permissions.manage) {
              $scope.permissions[permission] = "editor";
            }
          }
        });
      });
    }
  });
