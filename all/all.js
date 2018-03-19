angular.module("agendasApp")
  .component("all", {
    templateUrl: "all/all.html",
    controller: function($scope, $timeout, $stateParams, $mdMedia, $mdDialog, $filter, $transitions, $rootScope, db) {
      $scope.destroy = function() {
        /*window.removeEventListener("scroll", $scope.scrollHandler);
        window.removeEventListener("resize", $scope.scrollHandler);*/
        Object.keys($scope.unsubscribe).forEach(function(agenda) {
          $scope.unsubscribe[agenda].forEach((detach) => {
            detach();
          });
        });

        $scope.agendasRef = null;
        $scope.categoriesRefs = {};
        $scope.incompleteRefs = {};
        $scope.permissionRefs = {};

        $scope.agendas = {};
        $scope.permissions = {};
        $scope.categories = {};
        $scope.tasks = {};
        $scope.agendaTasks = new Map();
        $scope.currentTasks = $scope.tasks;
        $scope.tasksArray = [];
        $scope.unsubscribe = {};

        $scope.selectedTask = null;
      };

      $scope.unsubscribe = [];

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

      $scope.agendas = {};
      $scope.permissions = {};
      $scope.categories = {};
      $scope.completed = {};
      $scope.permissionRefs = {};
      $scope.categoriesRefs = {};
      $scope.incompleteRefs = {};
      $scope.agendaTasks = new Map();
      $scope.tasks = {};
      $scope.tasksArray = [];
      $scope.currentTasks = $scope.tasks;

      firebase.auth().onAuthStateChanged(() => {
        $scope.agendasRef = db.collection("agendas").where(firebase.auth().currentUser.uid, "==", true);
        $scope.agendasRef.onSnapshot((data) => {
          data.docChanges.forEach((change) => {
            var d = change.doc;
            if (change.type === "added") {
              var agendaRef = db.collection("agendas").doc(d.id);
              $scope.unsubscribe[d.id] = [];

              $scope.agendas[d.id] = d.data().name;

              $scope.permissions[d.id] = {};
              $scope.permissionRefs[d.id] = agendaRef.collection("permissions").doc(firebase.auth().currentUser.uid);
              $scope.unsubscribe[d.id].push($scope.permissionRefs[d.id].onSnapshot(function(value) {
                $scope.permissions[d.id] = value.data();
                $scope.refreshSoon();
              }));

              $scope.categories[d.id] = {};
              $scope.categoriesRefs[d.id] = agendaRef.collection("tags");
              $scope.unsubscribe[d.id].push($scope.categoriesRefs[d.id].onSnapshot(function(tags) {
                tags.docChanges.forEach(function(change) {
                  var data = change.doc;
                  if (change.type === "added") {
                    $scope.categories[d.id][data.id] = data.data();
                  } else if (change.type === "modified") {
                    $scope.categories[d.id][data.id] = data.data();
                  } else if (change.type === "removed") {
                    delete $scope.categories[d.id][data.id];
                  }
                });
                $scope.refreshSoon();
              }));

              $scope.incompleteRefs[d.id] = agendaRef.collection("tasks").where("completed", "==", false);
              $scope.unsubscribe[d.id].push($scope.incompleteRefs[d.id].onSnapshot(function(tasks) {
                tasks.docChanges.forEach(function(change) {
                  var data = change.doc;
                  if (change.type === "added") {
                    $scope.agendaTasks.set(data.id, d.id);
                    $scope.tasks[data.id] = data.data();
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

                    $scope.tasks[data.id] = data.data();
                  } else if (change.type === "removed") {
                    $scope.agendaTasks.delete(data.id);
                    $scope.tasksArray.splice($scope.tasksArray.indexOf(data.id), 1);
                    //$scope.completedTasks.splice($scope.completedTasks.indexOf(data.id), 1);
                    delete $scope.tasks[data.id];
                  }
                });
                $scope.refreshSoon();
              }));
            } else if (change.type === "modified") {
              $scope.agendas[d.id] = d.data().name;
            } else if (change.type === "removed") {
              $scope.unsubscribe[d.id].forEach((detach) => {detach()});

              delete $scope.unsubscribe[d.id];
              delete $scope.permissionRefs[d.id];
              delete $scope.categoriesRefs[d.id];
              delete $scope.incompleteRefs[d.id];

              delete $scope.permissions[d.id];
              delete $scope.categories[d.id];

              var toDelete = {};
              var tasks = $scope.agendaTasks.entries().forEach((entry) => {
                if (entry[1] === d.id) {
                  toDelete[entry[0]] = true;
                  delete $scope.tasks[entry[0]];
                  $scope.agendaTasks.delete(entry[0]);
                }
              });

              $scope.tasksArray = $scope.tasksArray.filter(task => toDelete[task]);

              delete $scope.agendas[d.id];
              $timeout();
            }
          });
        }, console.log);
      });

      $scope.getTasksArray = function() {
        return $scope.tasksArray;
      };

      $scope.completeTask = function(taskKey) {
        delete $scope.completed[taskKey];
        var task = $scope.tasks[taskKey];
        var taskRef = db.collection("agendas").doc($scope.agendaTasks.get(taskKey)).collection("tasks").doc(taskKey);
        if (task.repeat) {
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

            if (next < repeatEnds) {
              taskRef.update({deadline: next});
              return;
            }
          } else if (next) {
            taskRef.update({deadline: next});
            return;
          }
        }
        taskRef.update({completed: true});
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
    }
  })
