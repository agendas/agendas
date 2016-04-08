angular.module("agendasApp", ["ngMaterial", "ngMessages"])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme("default").primaryPalette("green").accentPalette("orange").warnPalette("red");
  })
  .controller("AgendasController", function($scope) {

    // Establish a connection to Google Drive.
    var CLIENT_ID = "Why should you know my Client ID?";
    var SCOPES    = ["https://www.googleapis.com/auth/drive.appfolder", "https://www.googleapis.com/auth/drive.metadata.readonly"];

    var scope = $scope;

    function handleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        scope.$apply(function($scope) {
          $scope.isAuthenticated = 1;
        });
        // loadDriveApi()
      } else {
        scope.$apply(function($scope) {
          $scope.isAuthenticated = 0;
        });
      }
    }

    $scope.isAuthenticated = 2;
    $scope.checkAuth = function() {
      gapi.auth.authorize({
        client_id: CLIENT_ID,
        scope: SCOPES,
        immediate: true
      }, handleAuthResult);
    };
    $scope.authorize = function() {
      gapi.auth.authorize({
        client_id: CLIENT_ID,
        scope: SCOPES,
        immediate: false
      }, handleAuthResult);
    }

    $scope.test = "Hello, world!";
  })
  .controller("AgendasUIController", function($scope, $mdSidenav, $controller, $mdDialog) {
    angular.extend(this, $controller("AgendasController", {$scope: $scope}));
    $scope.toggleSidenav = function(sidenav) {
      return $mdSidenav(sidenav).toggle();
    };
    $scope.showGoogleDriveDialog = function() {
      $mdDialog.show($mdDialog.confirm().parent(angular.element(document.querySelector("body"))).clickOutsideToClose(true)
        .title('Use Google Drive')
        .textContent("Connect to Google Drive to sync and share your agendas.")
        .cancel("Remind me later").ok('Connect to Drive')
      ).then(function() {
        $scope.authorize();
      });
    };
    $scope.$watch("isAuthenticated", function() {
      ($scope.isAuthenticated == 0) ? $scope.showGoogleDriveDialog() : "";
    });
  })
