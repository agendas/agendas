angular.module("agendasApp")
  .component("settings", {
    templateUrl: "settings/settings.html",
    controller: function($scope, $state, credits) {
      $scope.credits = credits;

      $scope.applyShowCompleted = function(completedTasks) {
        localStorage.agendasShowCompleted = JSON.stringify(completedTasks);
      };

      $scope.applyDarkTheme = function(darkTheme) {
        localStorage.agendasDarkTheme = JSON.stringify(darkTheme);
        $state.reload();
      };
    }
  })
