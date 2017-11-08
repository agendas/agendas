angular.module("agendasApp")
  .component("agendasSidenav", {
    templateUrl: "sidenav/sidenav.html",
    controller: function($scope, $rootScope, $timeout, $state, $stateParams, $mdDialog, $mdSidenav, $mdMedia, db) {
      $scope.restoreVariables = function() {
        if ($scope.agendasRef) {
          $scope.agendasRef.off();
        }

        if ($scope.usernameRef) {
          $scope.usernameRef.off();
        }

        $scope.agendas = [];
        $scope.agendasRef = null;
        $scope.usernameRef = null;
        $scope.username = "";
      };

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log("User signed in");
          $scope.agendasRef = db.collection("agendas").where(user.uid, "==", true);
          $scope.agendasRef.onSnapshot(function(data) {
            $scope.agendas = [];
            data.forEach(function(doc) {
              var agenda = {id: doc.id, name: doc.data().name};
              $scope.agendas.push(agenda);
            });
            $timeout();
          }, console.log);
        } else {
          $scope.restoreVariables();
        }

        $timeout();
      });

      /* $scope.agendasVirtualRepeat = {
        getItemAtIndex: function(index) {
          return $scope.agendas[index];
        },
        getLength: function() {
          return $scope.agendas.length;
        }
      }; */

      $scope.selectAgenda = function(agenda) {
        $state.go("agenda", {agenda: agenda.id});
      };

      $scope.agendaIsSelected = function(agenda) {
        return !!($state.current && $state.current.name == "agenda" && $stateParams.agenda == agenda);
      };

      $scope.signOut = function() {
        firebase.auth().signOut();
      };

      $scope.addAgenda = function(event) {
        $mdDialog.show($mdDialog.prompt()
          .title("New Agenda")
          .content("Give your new agenda a name.")
          .placeholder("Name")
          .cancel("Cancel")
          .ok("OK")
          .targetEvent(event)
        ).then(function(name) {
          if (name) {
            var permissions = {};
            ["manage", "edit_tasks", "edit_tags", "complete_tasks"].forEach(function(permission) {
              permissions[permission] = true;
            });

            db.collection("agendas").add({}).then(function(ref) {
              return ref.collection("permissions").doc($rootScope.user.uid).set(permissions).then(function() {
                return ref;
              });
            }).then(function(ref) {
              var agenda = {name: name};
              agenda[$rootScope.user.uid] = true;
              ref.set(agenda);
            });
          }
        });
      };

      $scope.gtMd = function() {
        return $mdMedia("gt-md");
      };

      $scope.lockedOpen = function() {
        return ($scope.gtMd() && !$scope.hideSidenav) || !$state.current.name;
      };

      $scope.$watch("sidenavIsOpen && !lockedOpen()", function(isOpen) {
        if (isOpen) {
          $rootScope.bodyStyle.overflow = "hidden";
        } else {
          $rootScope.bodyStyle.overflow = "initial";
        }
      });

      $scope.showDeveloperSidenav = function() {
        return $state.current && $state.current.name.startsWith("console");
      };

      $scope.restoreVariables();
    }
  })
