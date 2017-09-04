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
      .warnPalette("red");
    $mdThemingProvider.theme("dark")
      .dark(true);
  })
  .controller("AgendasController", ($scope, $rootScope, $state, $mdMedia, $mdDialog, $timeout) => {
    firebase.auth().onAuthStateChanged(function(user) {
      $rootScope.user = user;

      if ($rootScope.user) {
        firebase.database().ref("/users/" + $rootScope.user.uid + "/setupComplete").once("value").then(function(data) {
          if (!data.val()) {
            $mdDialog.show({template: "<md-dialog ng-class=\"$root.darkTheme ? 'md-dark-theme' : ''\"><setup-dialog></setup-dialog></md-dialog>"});
          }
        });

        if ($state.current.name == "login") {
          $state.go("home");
        }

        $scope.usernameRef = firebase.database().ref("/users/" + $rootScope.user.uid + "/username");
        $scope.usernameRef.on("value", function(data) {
          $rootScope.username = data.val();
          $scope.$apply();
        });
      } else {
        $state.go("login", {redirect: $state.current.name});

        if ($scope.usernameRef) {
          $scope.usernameRef.off();
          $scope.usernameRef = null;
        }

        $scope.username = null;
      }

      $timeout();
    });

    $rootScope.bodyStyle = {};
    $rootScope.darkTheme = localStorage.agendasDarkTheme && JSON.parse(localStorage.agendasDarkTheme);
    $rootScope.showCompleted = localStorage.agendasShowCompleted && JSON.parse(localStorage.agendasShowCompleted);
  });
