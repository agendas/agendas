angular.module("agendasApp")
  .component("taskCreator", {
    templateUrl: "creator/creator.html",
    bindings: {
      onAddTask: "&",
      onAddTag: "&?",
      tags: "=?"
    },
    controller: function($scope, $timeout, colors) {
      this.$onInit = () => {
        var repeats = new Map(Object.entries({
          daily: "day", "each day": "day", "every day": "day",
          "each weekday": "weekday", "every weekday": "weekday",
          weekly: "week", "each week": "week", "every week": "week",
          "every other week": "2-weeks", "every 2 weeks": "2-weeks", "every two weeks": "2-weeks",
          monthly: "month", "each month": "month", "every month": "month",
          yearly: "year", "each year": "year", "every year": "year"
        }));

        var completed = ["complete", "completed", "done", "already", "check", "checkmark", "checked", "hide", "hidden"];

        var priorities = new Map(Object.entries({
          none: 0, low: 1, medium: 2, high: 3, urgent: 4, important: 4, asap: 4, required: 4, needed: 4
        }));

        var nextId = 1;

        $scope.tags = this.tags;
        $scope.colors = colors;

        $scope.items = [];
        $scope.matches = [];
        $scope.selectedMatch = null;
        $scope.hasDeadlineChip = false;
        $scope.hasRepeatChip = false;
        $scope.hasCompletedChip = false;
        $scope.hasPriorityChip = false;
        $scope.tagChips = {};

        $scope.addMatch = function(match) {
          if ($scope.matches.length < 1) {
            $scope.selectedMatch = 0;
          }

          $scope.matches.push(match);
        };

        $scope.removeMatch = function(index) {
          $scope.matches.splice(index);
          if ($scope.selectedMatch === index) {
            $scope.selectedMatch = $scope.matches.length > 0 ? 0 : null;
          }
        };

        $scope.refreshMatches = function(text) {
          $scope.matches = [];
          $scope.selectedMatch = null;

          if (!$scope.hasDeadlineChip) {
            var date = chrono.parse(text);
            if (date.length > 0 && text.endsWith(date[0].text)) {
              var deadline = date[0].start.date();
              if (date[0].start.isCertain("weekday") && !date[0].start.isCertain("day")) {
                var now = new Date();
                now.setHours(0);
                now.setMinutes(0);
                now.setSeconds(0);
                now.setMilliseconds(0);
                if (deadline < now) {
                  deadline.setDate(deadline.getDate() + 7);
                }
              }
              $scope.addMatch({type: "deadline", icon: "today", text: date[0].text, deadline: deadline, time: date[0].start.isCertain("hour")});
            }
          }

          var lowerCaseText = text.toLowerCase();

          $scope.tags.forEach(function(tag) {
            if (tag.name && tag.name.length > 0 && lowerCaseText.endsWith(tag.name.toLowerCase()) && !$scope.tagChips[tag.name]) {
              $scope.addMatch({type: "tag", icon: "local_offer", text: tag.name, color: tag.color, key: tag.key});
            }
          });

          if (!$scope.hasRepeatChip) {
            repeats.forEach(function(repeat, repeatText) {
              if (text.toLowerCase().endsWith(repeatText)) {
                $scope.addMatch({type: "repeat", icon: "cached", text: repeatText, repeat: repeat});
              }
            });
          };

          if (!$scope.hasCompletedChip) {
            completed.forEach(function(completeText) {
              if (text.toLowerCase().endsWith(completeText)) {
                $scope.addMatch({type: "completed", icon: "done", text: completeText});
              }
            });
          }

          if (!$scope.hasPriorityChip) {
            priorities.forEach(function(priority, priorityText) {
              if (text.toLowerCase().endsWith(priorityText)) {
                $scope.addMatch({type: "priority", icon: "error", text: priorityText, priority: priority});
              }
            });
          }
        };

        $scope.hasFocus = function() {
          return !!document.querySelector("task-creator input:focus, task-creator input:active");
        };

        $scope.complete = function(match) {
          var active = document.activeElement;
          var index  = Array.prototype.slice.call(active.parentElement.parentElement.children).indexOf(active.parentElement);

          match.id = nextId;
          nextId++;

          $scope.items.splice(index + 1, 0, match);

          $timeout(function() {
            document.querySelector("task-creator > div.task-input > span:nth-child(" + (index + 2) + ") > *").focus();
          }, 0, false);

          if (match.type === "deadline") {
            $scope.hasDeadlineChip = true;
          } else if (match.type === "tag") {
            $scope.tagChips[match.text] = true;
          } else if (match.type === "repeat") {
            $scope.hasRepeatChip = true;
          } else if (match.type === "completed") {
            $scope.hasCompletedChip = true;
          } else if (match.type === "priority") {
            $scope.hasPriorityChip = true;
          }

          $scope.items[index].text = $scope.items[index].text.slice(0, -1 * (match.text.length));
          $scope.matches = [];
          $scope.selectedMatch = null;
        };

        $scope.removeItem = function(index) {
          if ($scope.items[index].type === "deadline") {
            $scope.hasDeadlineChip = false;
          }
          if ($scope.items[index].type === "tag") {
            delete $scope.tagChips[$scope.items[index].text];
          }
          if ($scope.items[index].type === "repeat") {
            $scope.hasRepeatChip = false;
          }
          if ($scope.items[index].type === "completed") {
            $scope.hasCompletedChip = false;
          }
          if ($scope.items[index].type === "priority") {
            $scope.hasPriorityChip = false;
          }
          $scope.items.splice(index, 1);
          if ($scope.items.length > 0) {
            document.querySelector("task-creator > div.task-input > span:nth-child(" + index + ") > *").focus();
          }
          if ($scope.items.length > index && $scope.items[index - 1].type === "text" && $scope.items[index].type === "text") {
            $scope.items[index - 1].text += " " + $scope.items[index].text;
            $scope.removeItem(index);
          }
        };

        $scope.keyEvent = function(item, index, event) {
          switch (event.keyCode) {
            case 8:
              var element = document.querySelector("task-creator > div.task-input > span:nth-child(" + (index + 1) + ") > *");
              if (element.tagName !== "INPUT") {
                $scope.removeItem(index);
                event.preventDefault();
              } else if (element.selectionStart < 1) {
                if (index > 0 && (event.target.tagName !== "INPUT" || event.target.selectionStart <= 0)) {
                  event.target.blur();
                  var element = document.querySelector("task-creator > div.task-input > span:nth-child(" + (index) + ") > *")
                  element.focus();
                  if (element.tagName === "INPUT") {
                    element.selectionStart = element.value.length + 1;
                  }
                  event.preventDefault();
                  $scope.matches = [];
                  $scope.selectedMatch = null;
                }
              }
              break;
            case 13:
              if ($scope.selectedMatch !== null) {
                $scope.complete($scope.matches[$scope.selectedMatch]);
                event.preventDefault();
                event.stopPropagation();
              } else {
                $scope.$ctrl.addTask();
              }
              break;
            case 37:
              if (index > 0 && (event.target.tagName !== "INPUT" || event.target.selectionStart <= 0)) {
                var element = document.querySelector("task-creator > div.task-input > span:nth-child(" + (index) + ") > *")
                element.focus();
                event.target.blur();
                if (element.tagName === "INPUT") {
                  element.selectionStart = element.value.length + 1;
                }
                event.preventDefault();
                $scope.matches = [];
                $scope.selectedMatch = null;
              }
              break;
            case 38:
              if ($scope.selectedMatch !== 0 && $scope.selectedMatch !== null) {
                $scope.selectedMatch--;
                event.preventDefault();
                event.stopPropagation();
              }
              break;
            case 39:
              if (event.target.tagName !== "INPUT" || event.target.selectionStart >= item.text.length) {
                if ((index >= $scope.items.length - 1 && event.target.tagName !== "INPUT") || ($scope.items[index + 1] && $scope.items[index].type !== "text" && $scope.items[index + 1].type !== "text")) {
                  console.log("Creating new input...");
                  $scope.items.splice(index + 1, 0, {id: nextId, type: "text", text: ""});
                  nextId++;
                }
                if (index >= 0 && index < $scope.items.length - 1) {
                  $timeout(function() {
                    var element = document.querySelector("task-creator > div.task-input > span:nth-child(" + (index + 2) + ") > *");
                    console.log(element);
                    element.focus();
                    event.target.blur();
                    if (element.tagName === "INPUT") {
                      element.selectionStart = 0;
                    }
                    event.preventDefault();
                  }, 0, false);
                  $scope.matches = [];
                  $scope.selectedMatch = null;
                }
              }
              break;
            case 40:
              if ($scope.selectedMatch !== $scope.matches.length - 1 && $scope.selectedMatch !== null) {
                $scope.selectedMatch++;
                event.preventDefault();
                event.stopPropagation();
              }
              break;
            default:
              break;
          }
        };

        $scope.clickEvent = function(event) {
          if ($scope.items.length > 0) {
            document.querySelector("task-creator > .task-input > span:nth-child(" + $scope.items.length + ") > *").focus();
          } else {
            $scope.items.push({id: nextId, type: "text", text: ""});
            nextId++;
            $timeout(function() {
              document.querySelector("task-creator > .task-input > span:first-child > input").focus();
            }, 0, false);
          }
        };

        $scope.keypressEvent = function(index, event) {
          if ($scope.items[index + 1] && $scope.items[index + 1].type === "text") {
            $scope.items[index + 1].text = event.key + $scope.items[index + 1].text;
            var element = document.querySelector("task-creator > div.task-input > span:nth-child(" + (index + 2) + ") > *")
            element.focus();
            $timeout(function() {
              element.selectionStart = 1;
              element.selectionEnd = 1;
            }, 0, false);
          } else {
            $scope.items.splice(index + 1, 0, {id: nextId, type: "text", text: event.key});
            nextId++;
            $timeout(function() {
              document.querySelector("task-creator > .task-input > span:nth-child(" + (index + 2) + ") > *").focus();
            }, 0, false);
          }
          event.preventDefault();
        };

        $scope.removeIfEmpty = function(item, index) {
          if (item.text.length < 1) {
            $scope.items.splice(index, 1);
          }
        };

        $scope.getTextWidth = function(text) {
          if (text.length < 1) {
            return 1;
          }

          var measure = document.querySelector("task-creator > .measuring-div");
          measure.innerText = text;
          var width = measure.offsetWidth + 10;
          measure.innerText = "";
          return width;
        };

        this.addTask = function() {
          var task = {name: "", completed: false};

          $scope.items.forEach(function(item) {
            if (item.type === "text") {
              if (task.name.length > 0 && item.text.length > 0) {
                task.name += " ";
              }
              task.name += item.text;
            } else if (item.type === "deadline") {
              task.deadline = item.deadline;
              task.deadlineTime = !!item.time;
            } else if (item.type === "tag") {
              if (!task.tags) {
                task.tags = {};
              }
              task.tags[item.key] = true;
            } else if (item.type === "repeat") {
              task.repeat = item.repeat;
              if (!$scope.hasDeadlineChip) {
                task.deadline = new Date();
                task.deadline.setHours(0);
                task.deadline.setMinutes(0);
                task.deadline.setSeconds(0);
                task.deadline.setMilliseconds(0);
              }
            } else if (item.type === "completed") {
              task.completed = true;
            } else if (item.type === "priority") {
              task.priority = item.priority;
            }
          });

          this.onAddTask({task: task});

          $scope.items = [{id: 0, type: "text", text: ""}];
          $scope.matches = [];
          $scope.hasDeadlineChip = false;
          $scope.hasRepeatChip = false;
          $scope.hasCompletedChip = false;
          $scope.hasPriorityChip = false;
          $scope.tagChips = {};
          $scope.selectedMatch = null;

          document.querySelector("task-creator input").focus();
        };

        $scope.getColor = function(color) {
          return color === "black" ? {color: "grey-900"} : (color ? {color: color} : {})
        };
      };
    }
  })
