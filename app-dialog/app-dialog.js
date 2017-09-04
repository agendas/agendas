angular.module("agendasApp")
  .component("appDialog", {
    templateUrl: "app-dialog/app-dialog.html",
    bindings: {
      app: "="
    },
    controller: function($scope, $rootScope, $mdDialog, $http, oauthscopes) {
      $scope.scopes = oauthscopes;
      $scope.app = this.app;

      $scope.done = function() {
        $mdDialog.hide();
      };

      $scope.revoke = function(event) {
        $mdDialog.show($mdDialog.confirm()
          .title("Remove \"" + $scope.app.name + "\"?")
          .content("Removing this app will prevent it from accessing your account.")
          .cancel("Cancel")
          .ok("Remove")
          .targetEvent(event)
        ).then(function() {
          return $rootScope.user.getToken(true);
        }).then(function(token) {
          return $http({
            method: "POST",
            url: "https://api.agendas.co/api/v1/revoke/" + $scope.app.key,
            headers: {
              Authorization: token
            }
          });
        });
        $mdDialog.hide();
      };
    }
  })
