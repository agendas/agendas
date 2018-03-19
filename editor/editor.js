angular.module("agendasApp")
  .component("taskEditor", {
    templateUrl: "editor/editor.html",
    bindings: {
      task: "=",
      key: "=taskKey",
      tagsArray: "=",
      tagsObject: "=",
      onFinish: "&",
      agenda: "=?"
    },
    controller: function($scope, $stateParams, $timeout, $mdDialog, db) {
      this.$onInit = function() {
        var agenda = this.agenda || $stateParams.agenda;
        var key  = this.key;
        var tags = this.tagsArray;
        var tagsObject = this.tagsObject;

        $scope.cancel = this.onFinish;

        this.load = function() {
          $scope.name = this.task.name;
          $scope.completed = !!this.task.completed;
          $scope.deadlineDate = this.task.deadline && new Date(this.task.deadline);
          $scope.deadlineTime = (this.task.deadline && this.task.deadlineTime) ? $scope.deadlineDate.getHours() * 60 + $scope.deadlineDate.getMinutes() : undefined;
          $scope.repeat = this.task.repeat || "";
          $scope.repeatEnds = this.task.repeatEnds && new Date(this.task.repeatEnds);
          $scope.priority = this.task.priority || 0;
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

          var taskTags = $scope.tags && $scope.tags.length > 0 ? {} : null;
          $scope.tags.forEach(function(tag) {
            taskTags[tag.key] = true;
          });

          var task = {
            name: $scope.name,
            completed: $scope.completed,
            deadline: $scope.deadlineDate ? $scope.deadlineDate : null,
            deadlineTime: $scope.deadlineDate ? !!$scope.deadlineTime : null,
            repeat: $scope.deadlineDate ? $scope.repeat : null,
            repeatEnds: $scope.deadlineDate && $scope.repeat && $scope.repeatEnds ? $scope.repeatEnds : null,
            priority: $scope.priority || null,
            notes: $scope.notes || null,
            tags: taskTags
          };

          db.collection("agendas").doc(agenda).collection("tasks").doc(key).set(task).then(function() {
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
            db.collection("agendas").doc(agenda).collection("tasks").doc(key).delete().then(function() {
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
    }
  })
