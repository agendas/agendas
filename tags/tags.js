angular.module("agendasApp")
  .component("tagEditor", {
    templateUrl: "tags/tags.html",
    bindings: {
      categories: "="
    },
    controller: function($scope, colors, $stateParams, $timeout, $mdDialog, $mdMedia) {
      $scope.categories = this.categories;
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

      this.openColorPicker = function(category, event) {
        var saveTag = this.saveTag;
        $mdDialog.show({
          template: "<tag-color-picker color='$ctrl.category.color' name='$ctrl.category.name'></tag-color-picker>",
          controller: angular.noop,
          controllerAs: "$ctrl",
          bindToController: true,
          locals: {category: category},
          targetEvent: event,
          fullscreen: $mdMedia("xs") || !$mdMedia("sm")
        }).then(function(color) {
          category.color = color;
          saveTag(category);
        });
      };
    }
  })
