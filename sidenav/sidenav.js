angular.module("agendasApp")
  .component("agendasSidenav", {
    templateUrl: "sidenav/sidenav.html",
    controller: function($scope, $rootScope, $timeout, $state, $stateParams, $mdDialog, $mdSidenav, $mdMedia) {
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
          $scope.agendasRef = firebase.database().ref("/users/" + user.uid + "/agendas");

          $scope.agendasRef.on("child_added", function(data) {
            var agenda = {id: data.key, ref: firebase.database().ref("/agendas/" + data.key)};

            agenda.ref.on("value", function(value) {
              agenda.name = value.child("name").val();
              $timeout();
            });

            $scope.agendas.push(agenda);
            $timeout();
          });

          /* $scope.agendasRef.on("child_moved", function() {

          }); */

          $scope.agendasRef.on("child_removed", function(data) {
            var i = 0;
            for (var agenda of $scope.agendas) {
              if (agenda.id === data.key) {
                agenda.ref.off();
                break;
              }
              i++;
            }

            if (i < $scope.agendas.length) {
              $scope.agendas.splice(i, 1);
            }

            if ($scope.loagendaIsSelected(data.key)) {
              $state.go("home");
            }

            $timeout();
          });
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
            var ref = firebase.database().ref("/agendas").push();

            ref.set({name: name}).then(function() {
              return firebase.database().ref("/permissions").child(ref.key).child($rootScope.user.uid).set("editor");
            }).then(function() {
              return $scope.agendasRef.child(ref.key).set(true);
            }).then(function() {
              $scope.selectAgenda({id: ref.key});
            }).catch(function(e) {
              console.log(e);
            });
          }
        });
      };

      $scope.gtMd = function() {
        return $mdMedia("gt-md");
      };

      $scope.$watch("sidenavIsOpen && !gtMd()", function(isOpen) {
        if (isOpen) {
          $rootScope.bodyStyle.overflow = "hidden";
        } else {
          $rootScope.bodyStyle.overflow = "initial";
        }
      });

      $scope.restoreVariables();
    }
  })
