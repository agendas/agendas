angular.module("agendasApp")
  .component("wallpaperPicker", {
    templateUrl: "wallpaper/wallpaper.html",
    controller: function($scope, wallpapers, $mdDialog, $rootScope) {
      $scope.wallpaper = $rootScope.wallpaper;
      $scope.wallpapers = wallpapers.options;
      $scope.images = wallpapers.images;
      $scope.cancel = $mdDialog.cancel;
      $scope.selectOption = function(key, collection) {
        $scope.wallpaper = collection.images ? {collection: key} : {image: key};
      };
      $scope.selectNone = function() {
        $scope.wallpaper = {};
      };
      $scope.select = function() {
        $rootScope.wallpaper = $scope.wallpaper;
        localStorage.agendasWallpaper = JSON.stringify($scope.wallpaper);
        $mdDialog.hide();
      };
    }
  })
