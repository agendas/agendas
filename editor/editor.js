angular.module("agendasApp")
  .component("taskEditor", {
    templateUrl: "editor/editor.html",
    bindings: {
      task: "=",
      key: "=taskKey",
      onFinish: "&"
    },
    controller: function($scope, $stateParams, $timeout, $mdDialog) {
      var key = this.key;

      $scope.cancel = this.onFinish;

      this.load = function() {
        $scope.name = this.task.name;
        $scope.completed = !!this.task.completed;
        $scope.deadlineDate = this.task.deadline && new Date(this.task.deadline);
        $scope.deadlineTime = (this.task.deadline && this.task.deadlineTime) ? $scope.deadlineDate.getHours() * 60 + $scope.deadlineDate.getMinutes() : undefined;
        $scope.repeat = this.task.repeat || null;
        $scope.repeatEnd = this.task.repeatEnd;
        $scope.notes = this.task.notes;
      };

      $scope.save = function() {
        if ($scope.deadlineDate && $scope.deadlineTime) {
          $scope.deadlineDate.setHours(Math.floor($scope.deadlineTime / 60));
          $scope.deadlineDate.setMinutes($scope.deadlineTime % 60);
          $scope.deadlineDate.setSeconds(0);
          $scope.deadlineDate.setMilliseconds(0);
        }

        var task = {
          name: $scope.name,
          completed: $scope.completed,
          deadline: $scope.deadlineDate && $scope.deadlineDate.toJSON(),
          deadlineTime: $scope.deadlineDate ? !!$scope.deadlineTime : null,
          repeat: $scope.deadlineDate ? $scope.repeat : null,
          repeatEnd: $scope.deadlineDate && $scope.repeat && $scope.repeatEnd ? $scope.repeatEnd : null,
          notes: $scope.notes || null
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

      this.load();
    }
  })
