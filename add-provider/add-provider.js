angular.module("agendasApp")
  .component("addProvider", {
    templateUrl: "add-provider/add-provider.html",
    controller: function($scope, $authProviders, $rootScope, $mdDialog) {
      $scope.providers = [];

      var userProviders = {};
      $rootScope.user.providerData.forEach(function(provider) {
        userProviders[provider.providerId] = true;
      });

      $authProviders.forEach(function(provider, id) {
        if (!userProviders[id]) {
          $scope.providers.push(provider);
        }
      });

      $scope.cancel = $mdDialog.cancel;

      $scope.linkProvider = function(provider) {
        $rootScope.user.linkWithPopup(provider.provider).then(function() {
          $mdDialog.hide();
        }).catch(function(e) {
          $mdDialog.cancel();
        });
      };
    }
  })
