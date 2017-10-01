angular.module("agendasApp")
  .component("agenda", {
    templateUrl: "agenda/agenda.html",
    controller: function($scope, $timeout, $stateParams, $mdMedia, $mdDialog, $filter, $transitions, $rootScope) {
      $scope.destroy = function() {
        /*window.removeEventListener("scroll", $scope.scrollHandler);
        window.removeEventListener("resize", $scope.scrollHandler);*/

        $scope.agendaRef && $scope.agendaRef.off();
        $scope.categoriesRef && $scope.categoriesRef.off();
        $scope.tasksRef && $scope.tasksRef.off();
        $scope.permissionsRef && $scope.permissionsRef.off();

        $scope.agendaRef = null;
        $scope.categoriesRef = null;
        $scope.tasksRef = null;
        $scope.permissionsRef = null;

        $scope.agenda = {};
        $scope.categories = [];
        $scope.permissions = {};
        $scope.tasks = {};
        $scope.tasksArray = [];
        $scope.completed = {};
        //$scope.completedTasks = [];

        $scope.selectedTask = null;
      };

      $scope.agendaRef     = firebase.database().ref("/agendas/" + $stateParams.agenda);
      $scope.categoriesRef = firebase.database().ref("/categories/" + $stateParams.agenda);
      $scope.permissionsRef = firebase.database().ref("/permissions/" + $stateParams.agenda);
      $scope.tasksRef      = firebase.database().ref("/tasks/" + $stateParams.agenda);

      $scope.showCompleted = !!$rootScope.showCompleted;

      var refreshScheduled = false;
      $scope.refreshSoon = function() {
        if (!refreshScheduled) {
          $timeout(function() {
            console.log("Running digest...");
            refreshScheduled = false;
            $scope.refreshCompletedTasks();
            $scope.$digest();
          }, 200, false);
          refreshScheduled = true;
        }
      };

      $scope.agenda = {};
      $scope.agendaRef.on("value", function(value) {
        $scope.agenda = value.val();
        $scope.refreshSoon();
      });

      $scope.categories = [];
      $scope.categoryObj = {};

      $scope.categoriesRef.on("child_added", function(data) {
        var category = data.val();
        category.key = data.key;
        $scope.categories.push(category);

        $scope.categoryObj[data.key] = data.val();

        $scope.refreshSoon();
      });

      $scope.categoriesRef.on("child_changed", function(data) {
        for (var category of $scope.categories) {
          if (category.key === data.key) {
            category.name  = data.child("name").val();
            category.color = data.child("color").val();
            break;
          }
        }

        $scope.categoryObj[data.key] = data.val();

        $scope.$digest();
      });

      $scope.categoriesRef.on("child_removed", function(data) {
        var i = 0;
        for (var category of $scope.categories) {
          if (category.key === data.key) {
            $scope.categories.splice(i, 1);
            break;
          }
          i++;
        }

        delete $scope.categoryObj[data.key];

        $scope.$digest();
      });

      $scope.permissions = {};

      $scope.permissionsRef.on("child_added", function(data) {
        $scope.permissions[data.key] = data.val();
        $scope.refreshSoon();
      });

      $scope.permissionsRef.on("child_changed", function(data) {
        $scope.permissions[data.key] = data.val();
        $scope.$digest();
      });

      $scope.permissionsRef.on("child_removed", function(data) {
        delete $scope.permissions[data.key];
        $scope.$digest();
      });

      $scope.tasks = {};
      $scope.tasksArray = [];
      $scope.completed = {};
      //$scope.completedTasks = [];

      $scope.refreshCompletedTasks = function() {
        /*$scope.completedTasks = $scope.tasksArray.filter(function(task) {
          return !$scope.tasks[task].completed;
        });*/
      };

      $scope.tasksRef.on("child_added", function(data) {
        $scope.tasks[data.key] = data.val();
        $scope.completed[data.key] = !!data.child("completed").val();
        if ($scope.tasksArray.length < 1) {
          $scope.tasksArray.push(data.key);
        } else {
          var start = 0;
          var end = $scope.tasksArray.length - 1;
          var deadline = new Date(data.child("deadline").val());
          var toAdd = data.val();

          while (end >= start) {
            if (end < 0 || start > $scope.tasksArray.length) {
              break;
            }

            var index = Math.floor((start + end) / 2);
            var task = $scope.tasks[$scope.tasksArray[index]];
            var compare = taskComparator(task, toAdd);

            if (compare > 0) {
              end = index - 1;
            } else if (compare < 0) {
              start = index + 1;
            } else {
              start = index;
              end = index - 1;
              break;
            }
          }

          $scope.tasksArray.splice(start, 0, data.key);
        }

        $scope.refreshSoon();
      });

      $scope.tasksRef.on("child_changed", function(data) {
        var oldDeadline = $scope.tasks[data.key].deadline && new Date($scope.tasks[data.key].deadline);
        var newDeadline = data.val().deadline && new Date(data.val().deadline);

        if (
          (oldDeadline && !newDeadline) ||
          (newDeadline && !oldDeadline) ||
          (oldDeadline && oldDeadline.getTime()) !== (newDeadline && newDeadline.getTime()) ||
          $scope.tasks[data.key].deadlineTime != data.val().deadlineTime ||
          $scope.tasks[data.key].completed != data.val().completed ||
          ($scope.tasks[data.key].priority || 0) !== (data.val().priority || 0)
        ) {
          $scope.tasksArray.splice($scope.tasksArray.indexOf(data.key), 1);

          if ($scope.tasksArray.length < 1) {
            $scope.tasksArray.push(data.key);
          } else {
            var start = 0;
            var end = $scope.tasksArray.length - 1;
            var toAdd = data.val();

            while (end >= start) {
              if (end < 0 || start > $scope.tasksArray.length) {
                break;
              }

              var index = Math.floor((start + end) / 2);
              var task = $scope.tasks[$scope.tasksArray[index]];
              var compare = taskComparator(task, toAdd);

              if (compare > 0) {
                end = index - 1;
              } else if (compare < 0) {
                start = index + 1;
              } else {
                start = index;
                end = index - 1;
                break;
              }
            }

            $scope.tasksArray.splice(start, 0, data.key);
          }

          $scope.completed[data.key] = data.val().completed;
        }

        var needsRefresh = ($scope.tasks[data.key].completed != data.val().completed);

        $scope.tasks[data.key] = data.val();

        if (needsRefresh) {
          $scope.refreshCompletedTasks();
        }

        $scope.$digest();
      });

      $scope.tasksRef.on("child_removed", function(data) {
        $scope.tasksArray.splice($scope.tasksArray.indexOf(data.key), 1);
        $scope.completedTasks.splice($scope.completedTasks.indexOf(data.key), 1);
        delete $scope.tasks[data.key];
        //delete $scope.completed[data.key];

        $scope.$digest();
      });

      $scope.getTasksArray = function() {
        return $scope.showCompleted ? $scope.tasksArray : $scope.completedTasks;
      };

      $scope.completeTask = function(taskKey) {
        var task = $scope.tasks[taskKey];
        if (task.repeat && $scope.completed[taskKey]) {
          var day = 24 * 60 * 60 * 1000;
          var next = null;
          var deadline = new Date(task.deadline);

          if (!task.deadlineTime) {
            deadline.setHours(0);
            deadline.setMinutes(0);
            deadline.setSeconds(0);
            deadline.setMilliseconds(0);
          }

          switch (task.repeat) {
            case "day":
              next = new Date(deadline.getTime() + day);
              break;
            case "weekday":
              next = new Date(deadline.getTime() + day);
              while (next.getDay() === 0 || next.getDay() === 6) {
                next.setDate(next.getDate() + 1);
              }
              break;
            case "week":
              next = new Date(deadline.getTime() + (7 * day));
              break;
            case "2-weeks":
              next = new Date(deadline.getTime() + (14 * day));
              break;
            case "month":
              next = new Date(deadline.getTime());
              next.setMonth(next.getMonth() + 1);
              break;
            case "year":
              next = new Date(deadline.getTime());
              next.setFullYear(next.getFullYear() + 1);
              break;
          }

          if (next && task.repeatEnds) {
            var repeatEnds = new Date(task.repeatEnds);
            repeatEnds.setDate(repeatEnds.getDate() + 1);
            repeatEnds.setHours(0);
            repeatEnds.setMinutes(0);
            repeatEnds.setSeconds(0);
            repeatEnds.setMilliseconds(0);

            console.log(repeatEnds);

            if (next < repeatEnds) {
              $scope.tasksRef.child(taskKey).child("deadline").set(next.toJSON());
              return;
            }
          } else if (next) {
            $scope.tasksRef.child(taskKey).child("deadline").set(next.toJSON());
            return;
          }
        }
        $scope.tasksRef.child(taskKey).child("completed").set($scope.completed[taskKey]);
      };

      $scope.mdMedia = $mdMedia;

      $scope.getDeadlineString = function(deadline, completed) {
        var deadlineDate = new Date(deadline);
        var date = Math.floor((deadlineDate.getTimezoneOffset() * -60000 + deadlineDate.getTime()) / (24 * 60 * 60 * 1000));
        var now  = Math.floor((new Date().getTimezoneOffset() * -60000 + Date.now()) / (24 * 60 * 60 * 1000));
        if (date - now < -1) {
          return completed ? $filter("date")(deadline, "mediumDate") : (now - date) + " days ago";
        } else if (date - now < 0) {
          return "Yesterday";
        } else if (date == now) {
          return "Today";
        } else if (date - now == 1) {
          return "Tomorrow";
        } else if (date - now < 7) {
          return $filter("date")(deadline, "EEEE");
        } else {
          return $filter("date")(deadline, "mediumDate");
        }
      };

      $scope.showTaskEditor = function(task) {
        $scope.selectedTask = task;
      };

      $scope.hideTaskEditor = function() {
        $scope.selectedTask = null;
      };

      $scope.screen = "tasks";

      $scope.goto = function(screen) {
        $scope.screen = screen;
      };

      $scope.addTask = function(task) {
        $scope.tasksRef.push().set(task);
      };

      $scope.getTags = function(task, key) {
        if (task && task.tags) {
          return Object.keys(task.tags);
        } else if (task && task.category) {
          return [task.category];
        }
      };

      $scope.getMdColor = function(color) {
        return color === "black" ? {background: "grey-900"} : (color ? {background: color} : {});
      };

      $transitions.onExit({exiting: "agenda"}, function() {
        console.log("Destroying agenda...");
        $scope.destroy();
      });

      $scope.isOverdue = function(task) {
        if (task && task.deadline) {
          var deadline = new Date(task.deadline);
          if (!task.deadlineTime) {
            deadline.setDate(deadline.getDate() + 1);
            deadline.setHours(0);
            deadline.setMinutes(0);
            deadline.setSeconds(0);
            deadline.setMilliseconds(0);
          }
          return deadline < new Date();
        } else {
          return false;
        }
      };

      $scope.priorities = ["Low", "Medium", "High", "Urgent"];

      $scope.viewNotes = function(name, notes, event) {
        return $mdDialog.show({
          templateUrl: "agenda/notes.html",
          controller: function($scope, $mdDialog) {
            $scope.hide = $mdDialog.hide;
          },
          controllerAs: "$ctrl",
          bindToController: true,
          locals: {name: name, notes: notes},
          targetEvent: event
        });
      };

      /* var scrollTickPending = false;
      var scrollPos = 0;

      $scope.renderedTasks = [];

      $scope.scrollHandler = function() {
        scrollPos = window.scrollY;
        if (!scrollTickPending) {
          $timeout(function() {
            scrollTickPending = false;

            var beforePlaceholder = document.querySelector(".virtual-repeat-start");
            var repeatElement     = document.querySelector(".virtual-repeat");
            var elementSize = 72;
            var beforeOffset = scrollPos + beforePlaceholder.getBoundingClientRect().top;
            var totalSize = $scope.getTasksArray().length * elementSize;

            if (scrollPos < beforeOffset) {
              var elementsToRender = Math.floor((document.documentElement.clientHeight + scrollPos - beforeOffset) / elementSize) + 1;
              $scope.renderedTasks = $scope.getTasksArray().slice(0, elementsToRender);
              beforePlaceholder.style.height = 0;
            } else {
              var start = Math.floor((scrollPos - beforeOffset) / elementSize);
              var end = start + Math.floor((document.documentElement.clientHeight) / elementSize) + 1;
              beforePlaceholder.style.height = (start - 1) * elementSize + "px";
              $scope.renderedTasks = $scope.getTasksArray().slice(start, end);
              console.log(start);
            }

            repeatElement.style.height = totalSize + "px";

            //$timeout();
          }, 100);
          scrollTickPending = true;
        }
      };

      window.addEventListener("scroll", $scope.scrollHandler);
      window.addEventListener("resize", $scope.scrollHandler);
      $scope.$watch("getTasksArray().length", $scope.scrollHandler); */
    }
  })
