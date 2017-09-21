angular.module("agendasApp")
  .component("tagEditor", {
    templateUrl: "tags/tags.html",
    bindings: {
      categories: "="
    },
    controller: function($scope, colors, $stateParams, $timeout) {
      $scope.categories = this.categories;

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
      });

      $scope.categoriesRef = firebase.database().ref("/categories").child($stateParams.agenda);

      this.addTag = function() {
        var tag = {name: "Tag"};
        var tagRef = $scope.categoriesRef.push();
        tagRef.set(tag);
      };

      this.saveTag = function(category) {
        if (!category.saving) {
          category.saving = true;
          $timeout(function() {
            category.saving = false;
            $scope.categoriesRef.child(category.key).set({
              name: category.name || "",
              color: category.color || null
            });
          }, 1000);
        }
      };

      this.deleteTag = function(key) {
        $scope.categoriesRef.child(key).remove();
      };
    }
  })
