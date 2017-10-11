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
      resolve: {
        redirect: function($location) {
          return $location.path();
        }
      },
      template: "<auth redirect='redirect'></auth>",
      controller: function($scope, redirect) {
        $scope.redirect = redirect;
      }
    });
    $stateProvider.state({
      name: "settings",
      url: "/settings",
      component: "settings"
    });
    $stateProvider.state({
      name: "settings.appearance",
      url: "/appearance"
    });
    $stateProvider.state({
      name: "settings.account",
      url: "/account"
    });
    $stateProvider.state({
      name: "settings.apps",
      url: "/apps"
    });
    $stateProvider.state({
      name: "settings.credits",
      url: "/about"
    });
    $stateProvider.state({
      name: "console",
      url: "/console",
      component: "consoleDashboard"
    });
    $stateProvider.state({
      name: "consolenew",
      url: "/console/new",
      component: "consoleAdd"
    });
    $stateProvider.state({
      name: "consoledetail",
      url: "/console/:app",
      component: "consoleDetail"
    });
    $stateProvider.state({
      name: "agenda",
      url: "/:agenda",
      component: "agenda"
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
  .value("db", firebase.firestore())
  .controller("AgendasController", ($scope, $rootScope, $state, $mdMedia, $mdDialog, $mdToast, $timeout, $location) => {
    firebase.auth().onAuthStateChanged(function(user) {
      $rootScope.user = user;

      if ($rootScope.user) {
        firebase.database().ref("/users/" + $rootScope.user.uid + "/setupComplete").once("value").then(function(data) {
          if (!data.val()) {
            $mdDialog.show({template: "<md-dialog ng-class=\"$root.darkTheme ? 'md-dark-theme' : ''\"><setup-dialog></setup-dialog></md-dialog>"});
          }
        });

        $scope.usernameRef = firebase.database().ref("/users/" + $rootScope.user.uid + "/username");
        $scope.usernameRef.on("value", function(data) {
          $rootScope.username = data.val();
          $scope.$apply();
        });

        if ($state.current.name && $state.current.name.startsWith("console")) {
          firebase.database().ref("/users/" + $rootScope.user.uid + "/isDeveloper").once("value").then(function(value) {
            if (!value.val()) {
              return $rootScope.unlockDeveloperSwitch();
            }
          }).then(function() {
            if (!($rootScope.showDeveloper || (localStorage.agendasShowConsole && JSON.parse(localStorage.agendasShowConsole)))) {
              localStorage.agendasShowConsole = JSON.parse(true);
              $rootScope.showDeveloper = true;
            }
          });
        }
      } else {
        $state.go("login");

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
    $rootScope.showDeveloper = localStorage.agendasShowConsole && JSON.parse(localStorage.agendasShowConsole);

    $rootScope.unlockDeveloperSwitch = function() {
      return firebase.database().ref("/users/" + $rootScope.user.uid + "/isDeveloper").set(true).then(function() {
        $mdToast.show($mdToast.simple()
          .textContent("You've unlocked the Developer switch!")
          .action("TAKE ME THERE")
          .highlightAction(true)
          .highlightClass("md-accent")
          .position("top right")
          .hideDelay(3000)
        ).then(function(response) {
          if (response === "ok") {
            if ($state.current && $state.current.name === "settings") {
              $state.reload();
            } else {
              $state.go("settings");
            }
          }
        }).catch(console.log);
      });
    };

    window.setHackingSkills = function(skills) {
      if (skills) {
        if ($rootScope.user) {
          console.log("enabling hacking skills...");
          $rootScope.unlockDeveloperSwitch().then(function() {
            console.log("%cHacking skillz enabled!", "background-color:black;color:lime;font-weight:bold;font-family:monospace;font-size:2em;")
          });
        } else {
          console.log("rip. no user to hack. sign in first.");
        }
      } else {
        console.log("what do you mean you don't want hacking skills?");
      }
    }
  });
