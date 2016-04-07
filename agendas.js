angular.module("agendasApp", ["ngMaterial", "ngMessages"])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme("default").primaryPalette("green").accentPalette("orange").warnPalette("red");
  })
  .controller("AgendasController", function($scope) {
    $scope.test = "Hello, world!";
  })
  .controller("AgendasUIController", function($scope, $mdSidenav, $controller) {
    angular.extend(this, $controller("AgendasController", {$scope: $scope}));
    $scope.toggleSidenav = function(sidenav) {
      return $mdSidenav(sidenav).toggle();
    };
  })
