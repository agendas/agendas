angular.module("agendasApp")
  .component("auth", {
    templateUrl: "auth/auth.html",
    controller: function($scope, $authProviders, $state, $stateParams) {
      $scope.authProviders = $authProviders;
      $scope.loginWithProvider = (provider, event) => {
        provider.loginHandler(provider.provider, event).then(() => {
          if ($stateParams.redirect) {
            $state.go($stateParams.redirect);
          } else {
            $state.go("home")
          }
        });
      };
    }
  })
