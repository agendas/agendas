angular.module("agendasApp")
  .component("consoleDetail", {
    templateUrl: "console/detail/detail.html",
    controller: function($scope, $state, $stateParams, $mdDialog, $rootScope, $http) {
      $scope.app = {};
      $scope.key = $stateParams.app;

      $scope.appRef = firebase.database().ref("/apps/" + $stateParams.app);
      $scope.appRef.on("value", function(data) {
        $scope.app = data.exists() ? data.val() : {};
        $scope.authCodeEnabled = !!($scope.app.oauth && $scope.app.oauth.secret);
        if (!$scope.authCodeEnabled) {
          $scope.showClientSecret = false;
        }
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
          return $mdDialog.show(
            $mdDialog.confirm()
              .title("Are you absolutely sure?")
              .cancel("No")
              .ok("Yes")
          );
        }).then(function() {
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

      $scope.openTab = function(tab) {
        $scope.tab = tab;
      };

      $scope.editRedirectURL = function(event) {
        $mdDialog.show(
          $mdDialog.prompt()
            .title($scope.app.oauth && $scope.app.oauth.redirectURL ? "Change redirect URL" : "Set a redirect URL")
            .textContent("Access tokens will be sent to this redirect URL.")
            .placeholder("Redirect URL")
            .initialValue($scope.app.oauth && $scope.app.oauth.redirectURL)
            .cancel("Cancel")
            .ok("Save")
            .targetEvent(event)
        ).then(function(url) {
          return firebase.database().ref("/apps/" + $scope.key + "/oauth/redirectURL").set(url);
        });
      };

      $scope.disableImplicit = function(event) {
        $mdDialog.show(
          $mdDialog.confirm()
            .title("Disable implicit grant?")
            .textContent("Clients using this authentication method will stop working.")
            .cancel("Cancel")
            .ok("Disable")
            .targetEvent(event)
        ).then(function() {
          return firebase.database().ref("/apps/" + $scope.key + "/oauth/redirectURL").remove();
        });
      };

      $scope.revealSecret = function() {
        $scope.showClientSecret = true;
      };

      $scope.generateSecret = function() {
        return $rootScope.user.getIdToken(true).then(function(token) {
          return $http.put("https://api.agendas.co/api/v1/createdapps/" + $scope.key + "/secret", null, {
            headers: {Authorization: "Firebase " + token}
          });
        });
      };

      $scope.regenerateSecret = function(event) {
        return $mdDialog.show(
          $mdDialog.confirm()
            .title("Create a new client secret?")
            .textContent("The old client secret will stop working immediately.")
            .cancel("Cancel")
            .ok("Regenerate")
            .targetEvent(event)
        ).then(function() {
          return $scope.generateSecret();
        })
      };

      $scope.authCodeSwitchChanged = function(enable) {
        if (enable) {
          $scope.generateSecret();
        } else {
          $mdDialog.show(
            $mdDialog.confirm()
              .title("Disable authorization code grant?")
              .textContent("Clients using this authentication method will stop working.")
              .cancel("Cancel")
              .ok("Disable")
              .targetEvent(event)
          ).then(function() {
            return firebase.database().ref("/apps/" + $scope.key + "/oauth/secret").remove();
          }).catch(function(e) {
            $scope.authCodeEnabled = true;
          });
        }
      };

      $scope.requestMoreCalls = function(event) {
        $mdDialog.show({
          template: "<console-request type='apicall' app='$ctrl.app'></console-request>",
          controller: angular.noop,
          controllerAs: "$ctrl",
          bindToController: true,
          locals: {app: $scope.key},
          targetEvent: event
        });
      };
    }
  })
