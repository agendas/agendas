angular.module("agendasApp")
  .component("tagColorPicker", {
    templateUrl: "tag-color-picker/tag-color-picker.html",
    bindings: {color: "<", name: "="},
    controller: function($scope, $mdDialog, colors, $mdMedia) {
      $scope.colors = [];

      var primaryModifiers = ["50", "100", "200", "300", "400", "600", "700", "800", "900"];
      var accentModifiers  = ["A100", "A200", "A400", "A700"];

      colors.forEach(function(color) {
        $scope.colors.push(color);
        if (color.primary) {
          primaryModifiers.forEach(function(modifier) {
            $scope.colors.push({name: color.name + "-" + modifier});
          });
        }
        if (color.accent) {
          accentModifiers.forEach(function(modifier) {
            $scope.colors.push({name: color.name + "-" + modifier});
          });
        }
        if (color.primary && !color.accent) {
          $scope.colors.push({offset: true});
        }
      });

      $scope.cancel = $mdDialog.cancel;

      this.select = function(color) {
        this.color = color;
      };

      this.save = function() {
        $mdDialog.hide(this.color);
      };

      $scope.showFooters = function() {
        return $mdMedia("gt-md");
      };

      $scope.isFullscreen = function() {
        return $mdMedia("xs") || $mdMedia("sm");
      };
    }
  })
