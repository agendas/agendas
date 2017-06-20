angular.module("agendasApp", ["ngMaterial", "ui.router"])
  .config(($stateProvider) => {
    $stateProvider.state({
      name: "home",
      url: "/",
      component: "home"
    });
    $stateProvider.state({
      name: "home.index",
      url: ""
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
      name: "agenda.settings",
      url: "/:agenda/settings",
      component: "agendaSettings"
    });
    $stateProvider.state({
      name: "settings",
      url: "/settings",
      component: "settings"
    });
  })
  .controller("AgendasController", ($scope, $rootScope, $state) => {
    firebase.auth().onAuthStateChanged(function(user) {
      $rootScope.user = user;

      if (!$rootScope.user) {
        $state.go("login", {redirect: $state.current.name});
      }

      $scope.$apply();
    })
  });
