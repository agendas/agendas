angular.module("agendasApp")
  .component("auth", {
    templateUrl: "auth/auth.html",
    controller: function($scope, $rootScope, $authProviders, $state, $stateParams, $timeout) {
      $scope.authProviders = Array.from($authProviders.values());
      $scope.loginWithProvider = (provider, event) => {
        provider.loginHandler(provider.provider, event).then(() => {
          if ($stateParams.redirect && $stateParams.redirect != "login") {
            $state.go($stateParams.redirect);
          } else {
            $state.go("home");
          }
          $timeout();
        });
      };
    }
  })
