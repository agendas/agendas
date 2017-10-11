angular.module("agendasApp")
  .component("tagEditor", {
    templateUrl: "tags/tags.html",
    bindings: {
      categories: "="
    },
    controller: function($scope, colors, $stateParams, $timeout, $mdDialog, $mdMedia, db) {
      $scope.categories = this.categories;
      $scope.categoriesRef = db.collection("agendas").doc($stateParams.agenda).collection("tags");

      this.addTag = function() {
        var tag = {name: "Tag"};
        $scope.categoriesRef.add(tag);
      };

      this.saveTag = function(category) {
        if (!category.saving) {
          category.saving = true;
          $timeout(function() {
            category.saving = false;
            $scope.categoriesRef.doc(category.key).set({
              name: category.name || "",
              color: category.color || null
            });
          }, 1000);
        }
      };

      this.deleteTag = function(key) {
        $scope.categoriesRef.doc(key).delete();
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
