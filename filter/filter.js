angular.module("agendasApp")
  .component("filterEditor", {
    templateUrl: "filter/filter.html",
    bindings: {
      filter: "<",
      tagsArray: "=",
      tagsObject: "="
    },
    controller: function($scope, $mdDialog) {
      this.$onInit = () => {
        $scope.filter = Object.assign({}, this.filter);
        $scope.hadFilter = !!this.filter;

        if (!$scope.hadFilter) {
          $scope.filter = {filter: "deadline", type: "today", tags: []};
        }

        /*$scope.$watch("filter.filter", function(newValue, oldValue) {
          if (oldValue) {
            $scope.filter.type = null;
            $scope.filter.from = null;
            $scope.filter.to   = null;
          }
        });*/

        $scope.cancel = $mdDialog.cancel;
        $scope.remove = function() {
          $mdDialog.hide(null);
        };

        $scope.apply = function() {
          $mdDialog.hide($scope.filter);
        };

        var tags = this.tagsArray;

        $scope.getMdColor = function(color) {
          return color === "black" ? {color: "grey-900"} : (color ? {color: color} : {});
        };

        $scope.getMatchingTags = function(text) {
          if (text && text.length > 0) {
            var query = text.toLowerCase();
            return tags.filter(function(category) {
              return category.name.toLowerCase().indexOf(query) === 0;
            })
          } else {
            return [];
          }
        };
      };
    }
  })
