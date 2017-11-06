angular.module("agendasApp")
  .component("agenda", {
    templateUrl: "agenda/agenda.html",
    controller: function($scope, $timeout, $stateParams, $mdMedia, $mdDialog, $filter, $transitions, $rootScope, db) {
      $scope.destroy = function() {
        /*window.removeEventListener("scroll", $scope.scrollHandler);
        window.removeEventListener("resize", $scope.scrollHandler);*/
        $scope.unsubscribe.forEach(function(detach) {
          detach();
        });

        $scope.agendaRef = null;
        $scope.categoriesRef = null;
        $scope.tasksRef = null;
        $scope.incompleteRef = null;
        $scope.completeRefs = null;
        $scope.permissionRef = null;

        $scope.agenda = {};
        $scope.permissions = {};
        $scope.categories = [];
        $scope.tasks = {};
        $scope.tasksArray = [];
        $scope.completed = {};
        $scope.completedTasksArray = [];
        $scope.unsubscribe = [];
        $scope.unsubscribeIncomplete = null;
        //$scope.completedTasks = [];

        $scope.selectedTask = null;
      };

      $scope.unsubscribe = [];

      $scope.agendaRef     = db.collection("agendas").doc($stateParams.agenda);
      $scope.categoriesRef = $scope.agendaRef.collection("tags");
      $scope.tasksRef      = $scope.agendaRef.collection("tasks");
      $scope.incompleteRef = $scope.tasksRef.where("completed", "==", false);

      $scope.showCompleted = !!$rootScope.showCompleted;

      var refreshScheduled = false;
      $scope.refreshSoon = function() {
        if (!refreshScheduled) {
          $timeout(function() {
            console.log("Running digest...");
            refreshScheduled = false;
            //$scope.refreshCompletedTasks();
            $timeout();
          }, 200, false);
          refreshScheduled = true;
        }
      };

      $scope.agenda = {};
      $scope.unsubscribe.push($scope.agendaRef.onSnapshot(function(value) {
        $scope.agenda = value.data();
        $scope.refreshSoon();
      }));

      $scope.permissions = {};

      firebase.auth().onAuthStateChanged(function(user) {
        $scope.permissionRef = $scope.agendaRef.collection("permissions").doc(user.uid);
        $scope.permissions = {};
        $scope.unsubscribe.push($scope.permissionRef.onSnapshot(function(value) {
          $scope.permissions = value.data();
          $scope.refreshSoon();
        }));
      });

      $scope.categories = [];
      $scope.categoryObj = {};

      $scope.unsubscribe.push($scope.categoriesRef.onSnapshot(function(tags) {
        tags.docChanges.forEach(function(change) {
          var data = change.doc;
          if (change.type === "added") {
            var category = data.data();
            category.key = data.id;
            $scope.categories.push(category);

            $scope.categoryObj[data.id] = data.data();
          } else if (change.type === "modified") {
            for (var category of $scope.categories) {
              if (category.key === data.id) {
                category.name  = data.data().name;
                category.color = data.data().color;
                break;
              }
            }

            $scope.categoryObj[data.id] = data.data();
          } else if (change.type === "removed") {
            var i = 0;
            for (var category of $scope.categories) {
              if (category.key === data.id) {
                $scope.categories.splice(i, 1);
                break;
              }
              i++;
            }

            delete $scope.categoryObj[data.id];
          }
        });
        $scope.refreshSoon();
      }));

      $scope.tasks = {};
      $scope.tasksArray = [];
      $scope.completed = {};
      //$scope.completedTasks = [];

      $scope.refreshCompletedTasks = function() {
        /*$scope.completedTasks = $scope.tasksArray.filter(function(task) {
          return !$scope.tasks[task].completed;
        });*/
      };

      $scope.unsubscribe.push($scope.incompleteRef.onSnapshot(function(tasks) {
        tasks.docChanges.forEach(function(change) {
          var data = change.doc;
          console.log(change.type);
          if (change.type === "added") {
            $scope.tasks[data.id] = data.data();
            $scope.completed[data.id] = !!data.data().completed;
            if ($scope.tasksArray.length < 1) {
              $scope.tasksArray.push(data.id);
            } else {
              var start = 0;
              var end = $scope.tasksArray.length - 1;
              var deadline = new Date(data.data().deadline);
              var toAdd = data.data();

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

              $scope.tasksArray.splice(start, 0, data.id);
            }
          } else if (change.type === "modified") {
            var oldDeadline = $scope.tasks[data.id].deadline && new Date($scope.tasks[data.id].deadline);
            var newDeadline = data.data().deadline && new Date(data.data().deadline);

            if (
              (oldDeadline && !newDeadline) ||
              (newDeadline && !oldDeadline) ||
              (oldDeadline && oldDeadline.getTime()) !== (newDeadline && newDeadline.getTime()) ||
              $scope.tasks[data.id].deadlineTime != data.data().deadlineTime ||
              $scope.tasks[data.id].completed != data.data().completed ||
              ($scope.tasks[data.id].priority || 0) !== (data.data().priority || 0)
            ) {
              $scope.tasksArray.splice($scope.tasksArray.indexOf(data.id), 1);

              if ($scope.tasksArray.length < 1) {
                $scope.tasksArray.push(data.id);
              } else {
                var start = 0;
                var end = $scope.tasksArray.length - 1;
                var toAdd = data.data();

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

                $scope.tasksArray.splice(start, 0, data.id);
              }
            }

            $scope.completed[data.id] = data.data().completed;
            $scope.tasks[data.id] = data.data();
            console.log($scope.tasks);
            console.log(data.data());
            console.log(data.id);
          } else if (change.type === "removed") {
            $scope.tasksArray.splice($scope.tasksArray.indexOf(data.id), 1);
            //$scope.completedTasks.splice($scope.completedTasks.indexOf(data.id), 1);
            delete $scope.tasks[data.id];
            delete $scope.completed[data.id];
          }
        });
        $scope.refreshSoon();
      }));

      var lastTask = null;

      $scope.paginateCompletedTasks = function() {
        var query = $scope.tasksRef.where("completed", "==", true).orderBy("deadline", "desc").limit(20);
        if (lastTask) {
          query = query.startAfter(lastTask);
        }
        $scope.completeRefs.push(query);
        $scope.unsubscribe.push(query.onSnapshot(function(tasks) {
          lastTask = tasks.docs[tasks.size - 1];
          tasks.docChanges.forEach(function(change) {
            var data = change.doc;
            if (change.type === "added") {
              $scope.tasks[data.id] = data.data();
              $scope.completed[data.id] = !!data.data().completed;
              if ($scope.completedTasksArray.length < 1) {
                $scope.completedTasksArray.push(data.id);
              } else {
                var start = 0;
                var end = $scope.completedTasksArray.length - 1;
                var deadline = new Date(data.data().deadline);
                var toAdd = data.data();

                while (end >= start) {
                  if (end < 0 || start > $scope.completedTasksArray.length) {
                    break;
                  }

                  var index = Math.floor((start + end) / 2);
                  var task = $scope.tasks[$scope.completedTasksArray[index]];
                  var compare = -taskComparator(task, toAdd);

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

                $scope.completedTasksArray.splice(start, 0, data.id);
              }
            } else if (change.type === "modified") {
              var oldDeadline = $scope.tasks[data.id].deadline && new Date($scope.tasks[data.id].deadline);
              var newDeadline = data.data().deadline && new Date(data.data().deadline);

              if (
                (oldDeadline && !newDeadline) ||
                (newDeadline && !oldDeadline) ||
                (oldDeadline && oldDeadline.getTime()) !== (newDeadline && newDeadline.getTime()) ||
                $scope.tasks[data.id].deadlineTime != data.data().deadlineTime ||
                $scope.tasks[data.id].completed != data.data().completed ||
                ($scope.tasks[data.id].priority || 0) !== (data.data().priority || 0)
              ) {
                $scope.completedTasksArray.splice($scope.tasksArray.indexOf(data.id), 1);

                if ($scope.completedTasksArray.length < 1) {
                  $scope.completedTasksArray.push(data.id);
                } else {
                  var start = 0;
                  var end = $scope.completedTasksArray.length - 1;
                  var toAdd = data.data();

                  while (end >= start) {
                    if (end < 0 || start > $scope.completedTasksArray.length) {
                      break;
                    }

                    var index = Math.floor((start + end) / 2);
                    var task = $scope.tasks[$scope.completedTasksArray[index]];
                    var compare = -taskComparator(task, toAdd);

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

                  $scope.completedTasksArray.splice(start, 0, data.id);
                }

                $scope.completed[data.id] = data.data().completed;
                $scope.tasks[data.id] = data.data();
              } else if (change.type === "removed") {
                $scope.completedTasksArray.splice($scope.completedTasksArray.indexOf(data.id), 1);
                //$scope.completedTasks.splice($scope.completedTasks.indexOf(data.id), 1);
                delete $scope.tasks[data.id];
                delete $scope.completed[data.id];
              }
            }
          });
          $scope.refreshSoon();
        }));
      };

      $scope.viewCompletedTasks = function(event) {
        if (!$scope.completeRefs) {
          $scope.completeRefs = [];
          $scope.completedTasksArray = [];
          $scope.paginateCompletedTasks();
        }

        $mdDialog.show({
          targetEvent: event,
          templateUrl: "agenda/completed.html",
          fullscreen: $mdMedia("sm") || $mdMedia("xs"),
          locals: {
            completedTasksArray: $scope.completedTasksArray,
            tasks: $scope.tasks,
            completed: $scope.completed,
            completeTask: $scope.completeTask,
            getTags: $scope.getTags,
            getMdColor: $scope.getMdColor,
            getDeadlineString: $scope.getDeadlineString,
            categoryObj: $scope.categoryObj,
            permissions: $scope.permissions,
            completeRefs: $scope.completeRefs,
            paginateCompletedTasks: $scope.paginateCompletedTasks
          },
          controller: function($scope, $mdDialog, completedTasksArray, tasks, completed, completeTask, getTags, getMdColor, getDeadlineString, categoryObj, permissions, completeRefs, paginateCompletedTasks) {
            $scope.tasksArray = completedTasksArray;
            $scope.tasks = tasks;
            $scope.completed = completed;
            $scope.hide = $mdDialog.hide;
            $scope.completeTask = completeTask;
            $scope.getTags = getTags;
            $scope.getMdColor = getMdColor;
            $scope.getDeadlineString = getDeadlineString;
            $scope.categoryObj = categoryObj;
            $scope.permissions = permissions;

            $scope.showTaskEditor = function(task) {
              $scope.selectedTask = task;
            };

            $scope.hideTaskEditor = function() {
              $scope.selectedTask = null;
            };

            $scope.paginate = function() {
              console.log("Paginating...");
              if ($scope.tasksArray.length >= completeRefs.length * 20) {
                paginateCompletedTasks();
              }
            };
          }
        })
      };

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
              $scope.tasksRef.doc(taskKey).update({deadline: next});
              return;
            }
          } else if (next) {
            $scope.tasksRef.doc(taskKey).update({deadline: next});
            return;
          }
        }
        $scope.tasksRef.doc(taskKey).update({completed: $scope.completed[taskKey]});
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
        $scope.tasksRef.add(task);
      };

      $scope.getTags = function(task, key) {
        if (task && task.tags) {
          return Object.keys(task.tags);
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
