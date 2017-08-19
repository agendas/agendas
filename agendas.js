angular.module("agendasApp", ["ngMaterial", "ui.router"])
  .config(($stateProvider) => {
    $stateProvider.state({
      name: "home",
      url: "/",
      component: "home"
    });
    $stateProvider.state({
      name: "login",
      url: "/login",
      component: "auth"
    });
    $stateProvider.state({
      name: "agenda",
      url: "/:agenda",
      component: "agenda"
    });
    $stateProvider.state({
      name: "settings",
      url: "/settings",
      component: "settings"
    });
  })
  .config(($mdThemingProvider) => {
    $mdThemingProvider.theme("default")
      .primaryPalette("green")
      .accentPalette("blue")
      .warnPalette("red")
  })
  .controller("AgendasController", ($scope, $rootScope, $state, $timeout, $mdMedia) => {
    firebase.auth().onAuthStateChanged(function(user) {
      $rootScope.user = user;

      if ($rootScope.user) {
        if ($state.current.name == "login") {
          $state.go("home");
        }
      } else {
        $state.go("login", {redirect: $state.current.name});
      }

      $timeout();
    });

    $rootScope.bodyStyle = {};
  });
