angular.module("agendasApp")
  .component("agendasMenuToolbar", {
    templateUrl: "toolbar/toolbar.html",
    controller: function($scope, $mdSidenav, $mdMedia, $rootScope) {
      $scope.toggleSidenav = function() {
        $mdSidenav("agendasSidenav").toggle();
      };

      $scope.showToolbar = function() {
        return !$mdMedia("gt-md");
      };
    }
  })
