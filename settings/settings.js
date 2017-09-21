angular.module("agendasApp")
  .component("settings", {
    templateUrl: "settings/settings.html",
    controller: function($scope, $state, credits, $mdDialog, $rootScope, $authProviders, $mdToast) {
      $scope.credits = credits;
      $scope.providers = $authProviders;

      $scope.applyShowCompleted = function(completedTasks) {
        localStorage.agendasShowCompleted = JSON.stringify(completedTasks);
      };

      $scope.applyShowDeveloper = function(showDeveloper) {
        localStorage.agendasShowConsole = JSON.stringify(showDeveloper);
      };

      $scope.applyDarkTheme = function(darkTheme) {
        localStorage.agendasDarkTheme = JSON.stringify(darkTheme);
        location.reload(false);
      };

      $scope.showChangeUsernameDialog = function(username) {
        $mdDialog.show({
          template: "<md-dialog ng-class=\"$root.darkTheme ? 'md-dark-theme' : ''\"><username-dialog></username-dialog></md-dialog>"
        });
      };

      $scope.apps = [];

      firebase.auth().onAuthStateChanged(function(user) {
        $scope.apps.forEach(function(app) {
          app.nameRef.off();
        });

        if ($scope.appsRef) {
          $scope.appsRef.off();
        }

        $scope.apps = [];
        if (user) {
          $scope.appsRef = firebase.database().ref("/users/" + user.uid + "/apps");

          $scope.appsRef.on("child_added", function(data) {
            var app = {key: data.key, nameRef: firebase.database().ref("/apps/" + data.key).child("name"), scopes: Object.keys(data.val().scopes)};

            $scope.apps.push(app);
            $scope.$digest();

            app.nameRef.on("value", function(data) {
              app.name = data.val();
              $scope.$digest();
            });
          });

          $scope.appsRef.on("child_removed", function(data) {
            var i = 0;
            for (var app of $scope.apps) {
              if (app.key === data.key) {
                app.nameRef.off();
                $scope.apps.splice(i, 1);
                $scope.$digest();
                break;
              }
              i++;
            }
          });

          $scope.developerRef = firebase.database().ref("/users/" + $rootScope.user.uid + "/isDeveloper").on("value", function(data) {
            $scope.developer = data.val();
            $scope.$digest();
          });

        }

        $scope.$digest();
      });

      $scope.viewAppDetail = function(app) {
        $mdDialog.show({
          template: "<md-dialog ng-class=\"$root.darkTheme ? 'md-dark-theme' : ''\"><app-dialog app='app'></app-dialog></md-dialog>",
          controller: function($scope) {
            $scope.app = app;
          },
          clickOutsideToClose: true,
          escapeToClose: true
        });
      };

      $scope.viewProvider = function(provider, event) {
        $mdDialog.show({
          template: "<md-dialog ng-class=\"$root.darkTheme ? 'md-dark-theme' : ''\"><provider-dialog provider='provider'></provider-dialog></md-dialog>",
          controller: function($scope) {
            $scope.provider = provider;
          },
          clickOutsideToClose: true,
          escapeToClose: true,
          targetEvent: event
        });
      };

      $scope.addProvider = function(event) {
        $mdDialog.show({
          template: "<md-dialog ng-class=\"$root.darkTheme ? 'md-dark-theme' : ''\"><add-provider></add-provider></md-dialog>",
          targetEvent: event
        });
      };

      var clickedCredits = [];
      $scope.clickCredit = function(index) {
        if (!clickedCredits.includes(index)) {
          clickedCredits.push(index);
          if (clickedCredits.length === credits.length) {
            if ($scope.developer) {
              $mdToast.show($mdToast.simple()
                .textContent("Congratulat-oh wait, you've done this before.")
                .position("top right")
                .hideDelay(1000)
              );
            } else {
              $rootScope.unlockDeveloperSwitch();
            }
          } else if (clickedCredits.length < 2) {
            $mdToast.show($mdToast.simple()
              .textContent("Keep clicking...")
              .position("top right")
              .hideDelay(1000)
            );
          } else {
            $mdToast.show($mdToast.simple()
              .textContent("Only " + (credits.length - clickedCredits.length) + " clicks left to go!")
              .position("top right")
              .hideDelay(1000)
            );
          }
        }
      };

      $scope.$watch(function() {
        return $state.current.name;
      }, function(state) {
        switch (state) {
          case "settings":
            $scope.selectedTab = 0;
            break;
          case "settings.appearance":
            $scope.selectedTab = 1;
            break;
          case "settings.account":
            $scope.selectedTab = 2;
            break;
          case "settings.apps":
            $scope.selectedTab = 3;
            break;
          case "settings.credits":
            $scope.selectedTab = 4;
            break;
        }
      });

      $scope.$watch("selectedTab", function(tab) {
        var tabs = ["settings", "settings.appearance", "settings.account", "settings.apps", "settings.credits"]
        $state.go(tabs[tab]);
      });
    }
  })
