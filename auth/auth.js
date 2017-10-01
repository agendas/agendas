angular.module("agendasApp")
  .component("auth", {
    templateUrl: "auth/auth.html",
    bindings: {redirect: "="},
    controller: function($scope, $rootScope, $authProviders, $state, $stateParams, $timeout, $location) {
      $scope.authProviders = Array.from($authProviders.values());
      $scope.loginWithProvider = (provider, event) => {
        provider.loginHandler(provider.provider, event);
      };

      var redirect = this.redirect;

      firebase.auth().onAuthStateChanged(function(user) {
        if (user && $state.current.name == "login") {
          if (redirect && !redirect.endsWith("login")) {
            $location.path(redirect);
          } else {
            $state.go("home");
          }
        }
      })
    }
  })
