angular.module("agendasApp")
  .component("providerDialog", {
    templateUrl: "provider-dialog/provider-dialog.html",
    bindings: {provider: "="},
    controller: function($scope, $authProviders, $mdDialog, $rootScope) {
      this.$onInit = () => {
        $scope.email = this.provider.email;
        $scope.provider = $authProviders.get(this.provider.providerId);
        $scope.id = this.provider.providerId;
        $scope.done = $mdDialog.hide;
        $scope.unlink = function(event) {
          $mdDialog.show($mdDialog.confirm()
            .title("Unlink " + $scope.provider.name + "?")
            .content("You won't be able to sign in with " + $scope.provider.name + ".")
            .cancel("Cancel")
            .ok("Unlink")
            .targetEvent(event)
          ).then(function() {
            return $rootScope.user.unlink($scope.id);
          }).then(function() {
            $mdDialog.hide();
          }).catch(function() {
            $mdDialog.hide();
          });
        };
      };
    }
  })
