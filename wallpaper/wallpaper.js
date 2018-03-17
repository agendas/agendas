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
      $scope.selectCustom = function() {
        $scope.wallpaper = {custom: true, url: ""};
      };
      $scope.select = function() {
        if ($scope.wallpaper.url) {
          $scope.wallpaper.url = encodeURI($scope.wallpaper.url);
        }
        $rootScope.wallpaper = $scope.wallpaper;
        localStorage.agendasWallpaper = JSON.stringify($scope.wallpaper);
        $mdDialog.hide();
      };

      $scope.viewImageCredits = function() {
        $scope.viewingCredits = !$scope.viewingCredits;
      };

      $scope.getImageCredits = function() {
        if ($scope.wallpaper.image) {
          return [$scope.images[$scope.wallpaper.image]];
        } else if ($scope.wallpaper.collection) {
          var images = $scope.wallpapers[$scope.wallpaper.collection].images;
          return Object.keys(images).map(function(image) {
            return $scope.images[images[image]];
          });
        }
      };

      $scope.getWallpaperThumbnail = function(wallpaper) {
        var hour = new Date().getHours();

        if (wallpaper.image) {
          return wallpapers.images[wallpaper.image].thumbnail || wallpapers.images[wallpaper.image].url;
        } else if (wallpaper.collection) {
          var collection = wallpapers.options[wallpaper.collection].images;
          var image;
          if (hour >= 6 && hour < 8 && collection.dawn) {
            image = collection.dawn;
          } else if (hour >= 8 && hour < 18) {
            image = collection.day;
          } else if (hour === 7) {
            image = collection.day;
          } else if (hour >= 18 && hour < 21 && collection.sunset) {
            image = collection.sunset;
          } else {
            image = collection.night;
          }
          return wallpapers.images[image].thumbnail || wallpapers.images[image].url;
        } else if (wallpaper.custom) {
          return wallpaper.url;
        }
      };
    }
  })
