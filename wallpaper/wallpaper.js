angular.module("agendasApp")
  .component("wallpaperPicker", {
    templateUrl: "wallpaper/wallpaper.html",
    controller: function($scope, wallpapers, $mdDialog) {
      $scope.wallpapers = wallpapers.options;
      $scope.images = wallpapers.images;
      $scope.cancel = $mdDialog.cancel;
    }
  })
