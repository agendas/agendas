angular.module("agendasApp")
  .component("taskEditor", {
    templateUrl: "editor/editor.html",
    bindings: {
      task: "=",
      key: "=taskKey",
      tagsArray: "=",
      tagsObject: "=",
      onFinish: "&"
    },
    controller: function($scope, $stateParams, $timeout, $mdDialog) {
      var key  = this.key;
      var tags = this.tagsArray;
      var tagsObject = this.tagsObject;

      $scope.cancel = this.onFinish;

      this.load = function() {
        $scope.name = this.task.name;
        $scope.completed = !!this.task.completed;
        $scope.deadlineDate = this.task.deadline && new Date(this.task.deadline);
        $scope.deadlineTime = (this.task.deadline && this.task.deadlineTime) ? $scope.deadlineDate.getHours() * 60 + $scope.deadlineDate.getMinutes() : undefined;
        $scope.repeat = this.task.repeat || null;
        $scope.repeatEnd = this.task.repeatEnd;
        $scope.notes = this.task.notes;
        $scope.tags = ((this.task.tags ? Object.keys(this.task.tags) : null) || (this.task.category ? [this.task.category] : [])).filter(function(key) {
          return tagsObject[key];
        }).map(function(key) {
          return {
            name: tagsObject[key].name,
            color: tagsObject[key].color,
            key: key
          };
        });
      };

      $scope.save = function() {
        if ($scope.deadlineDate && $scope.deadlineTime) {
          $scope.deadlineDate.setHours(Math.floor($scope.deadlineTime / 60));
          $scope.deadlineDate.setMinutes($scope.deadlineTime % 60);
          $scope.deadlineDate.setSeconds(0);
          $scope.deadlineDate.setMilliseconds(0);
        }

        var taskTags = {};
        $scope.tags.forEach(function(tag) {
          taskTags[tag.key] = true;
        });

        var task = {
          name: $scope.name,
          completed: $scope.completed,
          deadline: $scope.deadlineDate ? $scope.deadlineDate.toJSON() : null,
          deadlineTime: $scope.deadlineDate ? !!$scope.deadlineTime : null,
          repeat: $scope.deadlineDate ? $scope.repeat : null,
          repeatEnd: $scope.deadlineDate && $scope.repeat && $scope.repeatEnd ? $scope.repeatEnd : null,
          notes: $scope.notes || null,
          tags: taskTags
        };

        firebase.database().ref("/tasks/" + $stateParams.agenda + "/" + key).set(task).then(function() {
          $scope.cancel();
          $timeout();
        });
      };

      $scope.delete = function(event) {
        $mdDialog.show(
          $mdDialog.confirm()
            .title("Delete \"" + $scope.name + "\"?")
            .cancel("Cancel")
            .ok("Delete")
            .targetEvent(event)
        ).then(function() {
          firebase.database().ref("/tasks/" + $stateParams.agenda + "/" + key).remove().then(function() {
            $scope.cancel();
            $timeout();
          });
        });
      };

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
      }

      this.load();
    }
  })
