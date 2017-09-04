angular.module("agendasApp")
  .component("settings", {
    templateUrl: "settings/settings.html",
    controller: function($scope, $state, credits, $mdDialog, $rootScope, $authProviders) {
      $scope.credits = credits;
      $scope.providers = $authProviders;

      $scope.applyShowCompleted = function(completedTasks) {
        localStorage.agendasShowCompleted = JSON.stringify(completedTasks);
      };

      $scope.applyDarkTheme = function(darkTheme) {
        localStorage.agendasDarkTheme = JSON.stringify(darkTheme);
        $state.reload();
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
    }
  })
