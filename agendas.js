angular.module("agendasApp", ["ngMaterial", "ngMessages"])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme("default").primaryPalette("green").accentPalette("orange").warnPalette("red");
  })
  .value("colors", {red: "F44336", pink: "E91E63", purple: "9C27B0",
                    "deep-purple": "673AB7", indigo: "3F51B5", blue: "2196F3",
                    "light-blue": "03A9F4", cyan: "00BCD4", teal: "009688",
                    green: "4CAF50", "light-green": "8BC34A", lime: "CDDC39",
                    yellow: "FFEB3B", amber: "FFC107", orange: "FF9800",
                    "deep-orange": "FF5722", brown: "795548", grey: "9E9E9E",
                    "blue-grey": "607D8B", black: "000000"
  })
  .controller("AgendasController", function($scope, $agendaParser, $googleDrive) {

    $scope.agendaForTask = function(task) {
      return $agendaParser.getAgenda(task.agenda);
    }

    // Establish a connection to Google Drive.
    var CLIENT_ID = "153820900287-94r8o59pghaud0grrvkfcs1foedkbc6g.apps.googleusercontent.com";
    var SCOPES    = ["https://www.googleapis.com/auth/drive.appfolder", "https://www.googleapis.com/auth/drive.metadata.readonly"];

    var scope = $scope;

    function handleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        scope.$apply(function($scope) {
          $scope.isAuthenticated = 1;
        });
        $googleDrive.loadApis(function() {
          scope.$apply(function($scope) {
            $scope.apiLoaded = true;
          });
        });
      } else {
        scope.$apply(function($scope) {
          $scope.isAuthenticated = 0;
        });
      }
    }

    $scope.isAuthenticated = 2;
    $scope.apiLoaded = false;
    $scope.checkAuth = function() {
      $googleDrive.checkAuth(CLIENT_ID, SCOPES, handleAuthResult);
    };
    $scope.authorize = function() {
      $googleDrive.authorize(CLIENT_ID, SCOPES, handleAuthResult);
    };

  })
  .controller("AgendasUIController", function($scope, $agendaParser, $agendaSorter, $googleDrive, $mdSidenav, $controller, $mdDialog, $mdComponentRegistry, $filter, $rootScope, $mdMedia, quickAddSamples) {
    angular.extend(this, $controller("AgendasController", {$scope: $scope}));

    $scope.toggleSidenav = function(sidenav) {
      return $mdSidenav(sidenav).toggle();
    };

    $scope.showGoogleDriveDialog = function() {
      $mdDialog.show($mdDialog.confirm().clickOutsideToClose(true)
        .title('Use Google Drive')
        .textContent("Connect to Google Drive to sync and share your agendas.")
        .cancel("Remind me later").ok('Connect to Drive')
      ).then(function() {
        $scope.authorize();
      });
    };

    $scope.showAgendaCreationDialog = function(event) {
      $mdDialog.show($mdDialog.prompt().clickOutsideToClose(true).targetEvent(event)
        .title("New agenda")
        .textContent("Give your new agenda a name.")
        .placeholder("Name")
        .cancel("Cancel").ok("Done")
      ).then(function(result) {
        if ((typeof result == "string") && (result != "")) {
          if ($agendaParser.newAgenda(result)) { // TODO: Error handling!!!
            $scope.refresh();
          }
        }
      });
    };

    $scope.agendaList = [];
    $scope.refresh = function() {
      $scope.clearSelection();
      $scope.agendaList = $agendaParser.listAgendas();
      $scope.taskCreationAllowed = false;
      if ((typeof $scope.selectedAgenda != "string") && $scope.selectedAgenda) {
        $scope.selectedAgenda = $agendaParser.getAgenda($scope.selectedAgenda.name());
        if ($scope.selectedAgenda.error == "Agenda does not exist") {
          $scope.selectedAgenda = undefined;
        } else if (!$scope.selectedAgenda.error) {
          $scope.tasks = $agendaSorter.separateDeadlines($scope.selectedAgenda.tasks());
          $scope.taskCreationAllowed = true;
          $rootScope.agenda = $scope.selectedAgenda.name();
        } else {
          console.warn($scope.selectedAgenda.error);
        }
      } else if ($scope.selectedAgenda == "today") {
        $scope.populateToday();
        $rootScope.agenda = "Today";
      } else if ($scope.selectedAgenda == "week") {
        $scope.populateWeek();
        $rootScope.agenda = "Week";
      } else if ($scope.selectedAgenda == "all") {
        $scope.populateAll();
        $rootScope.agenda = "All";
      }
      if (!$scope.selectedAgenda) {
        $scope.tasks = [];
        $rootScope.agenda = "None";
        $scope.screen = "sidebar";
      } else {
        $scope.screen = "detail";
      }
    };

    $scope.$on("driveSyncFinished", function() {
      console.log("Drive Sync Finished");
      $scope.$apply(function($scope) {
        $scope.refresh();
      });
    });

    $scope.selectedAgenda = null;
    $scope.tasks = [];
    $scope.categories = [];

    $scope.selectAgenda = function(agenda) {
      if ($agendaParser.listAgendas().includes(agenda)) {
        // Select the agenda
        $scope.selectedAgenda = {name:function(){return agenda;}};
        $scope.refresh();
      }
    };
    $scope.selectToday = function() {
      $scope.selectedAgenda = "today";
      $scope.refresh();
    };
    $scope.selectWeek = function() {
      $scope.selectedAgenda = "week";
      $scope.refresh();
    };
    $scope.selectAllTasks = function() {
      $scope.selectedAgenda = "all";
      $scope.refresh();
    };

    $scope.populateToday = function() {
      $scope.populateAll();
      var now = new Date();
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      now.setMilliseconds(0);
      var tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000));
      $scope.tasks = $scope.tasks.filter(function(group) {
        return (new Date(group.deadline)) <= tomorrow;
      });
    };
    $scope.populateWeek = function() {
      $scope.populateAll();
      var now = new Date();
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      now.setMilliseconds(0);
      var nextWeek = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
      $scope.tasks = $scope.tasks.filter(function(group) {
        return (new Date(group.deadline)) < nextWeek;
      });
    };
    $scope.populateAll = function() {
      var agendas = $agendaParser.listAgendas();
      var tasks = [];
      var categories = [];
      for (var agenda of agendas) {
        for (var task of $agendaParser.getAgenda(agenda).tasks()) {
          tasks.push(task);
        }
      }
      $scope.tasks = $agendaSorter.separateDeadlines(tasks);
      $scope.categories = [];
    };

    $scope.completeTask = function(task) {
      var agenda = $scope.agendaForTask(task);
      var now = new Date();
      var next = undefined;
      if (task.deadline) {
        if (task.repeat == "day") {
          next = new Date(task.deadline.getTime() + (24 * 60 * 60 * 1000));
        } else if (task.repeat == "weekday") {
          next = task.deadline;
          while ((next.getDay() > 0) && (next.getDay() < 6)) {
            next = new Date(next.getTime() + (24 * 60 * 60 * 1000));
          }
        } else if (task.repeat == "week") {
          next = new Date(task.deadline.getTime() + (7 * 24 * 60 * 60 * 1000));
        } else if (task.repeat == "2-weeks") {
          next = new Date(task.deadline.getTime() + (14 * 24 * 60 * 60 * 1000));
        } else if (task.repeat == "month") {
          next = new Date(task.deadline.getTime() + (30 * 24 * 60 * 60 * 1000));
        } else if (task.repeat == "year") {
          next = new Date(task.deadline.getFullYear() + 1, task.deadline.getMonth(), task.deadline.getDate(), 0, 0, 0, 0);
        }
      }
      if (next) {
        next.setHours(0);
        next.setMinutes(0);
        next.setSeconds(0);
        next.setMilliseconds(0);
      }
      if (task.completed && next && (!task.repeatEnds || (next <= task.repeatEnds))) {
        agenda.getTask(task.id).deadline = new Date(
          next.getFullYear(),
          next.getMonth(),
          next.getDate(),
          task.deadline.getHours(),
          task.deadline.getMinutes(),
          task.deadline.getSeconds(),
          task.deadline.getMilliseconds()
        );
      } else {
        agenda.getTask(task.id).completed = task.completed;
      }
      agenda.saveAgenda();
      $scope.refresh();
    };

    $scope.showCompleted = false;

    $scope.category = undefined;
    $scope.selectedTask = null;
    $scope.detailTheme = "default";
    $scope.viewTaskDetail = function(task) {
      $scope.selectedTask = task;
      $scope.selectedTask.deadlineDate = task.deadline ? new Date(task.deadline) : undefined;
      if ($scope.selectedTask.deadline && $scope.selectedTask.deadlineTime) {
        var deadline = new Date($scope.selectedTask.deadline);
        var deadlineTime = new Date(1970, 0, 1, deadline.getHours(), deadline.getMinutes(), 0, 0, 0);
        $scope.selectedTask.time = ((deadlineTime.getMinutes() % 15) == 0) ? deadlineTime.toJSON() : "";
      } else {
        $scope.selectedTask.time = "";
      }
      $scope.categories = $scope.agendaForTask(task).categories();
      $scope.category = (typeof $scope.selectedTask.category == "undefined") ? undefined : ("category-" + $scope.selectedTask.category);
      $scope.selectedTask.repeat = task.repeat ? task.repeat : "";
      $scope.toggleSidenav("agendas-task-detail");
    };

    $scope.selectedTasks = [];
    $scope.clearSelection = function() {
      for (var task of $scope.selectedTasks) {
        task.selected = false;
      }
      $scope.selectedTasks = [];
    }
    $scope.selectTask = function(task, event) {
      if (event.shiftKey) {
        task.selected = !task.selected;
        if (task.selected) {
          $scope.selectedTasks.push(task);
        } else {
          $scope.selectedTasks.splice($scope.selectedTasks.indexOf(task), 1);
        }
      } else {
        $scope.clearSelection();
        $scope.viewTaskDetail(task);
      }
    }


    $scope.taskDetailIsOpen = function() {
      return false;
    };
    $scope.saveTaskDetail = function() {
      if ($scope.selectedTask) {
        var agenda = $scope.agendaForTask($scope.selectedTask);
        var task = agenda.getTask($scope.selectedTask.id)
        task.name = $scope.selectedTask.name;
        if ($scope.selectedTask.deadlineDate) {
          if ($scope.selectedTask.time == "") {
            $scope.selectedTask.deadline = new Date(1970, 0, 1, 0, 0, 0, 0);
            $scope.selectedTask.deadlineTime = false;
          } else {
            $scope.selectedTask.deadline = new Date($scope.selectedTask.time);
            $scope.selectedTask.deadlineTime = true;
          }
          task.deadline = new Date(
            $scope.selectedTask.deadlineDate.getFullYear(),
            $scope.selectedTask.deadlineDate.getMonth(),
            $scope.selectedTask.deadlineDate.getDate(),
            $scope.selectedTask.deadline.getHours(),
            $scope.selectedTask.deadline.getMinutes(),
            0,
            0
          );
          task.deadlineTime = $scope.selectedTask.deadlineTime;
          task.repeat = $scope.selectedTask.repeat ? $scope.selectedTask.repeat : undefined;
          task.repeatEnds = (task.repeat && $scope.selectedTask.repeatEnds) ? $scope.selectedTask.repeatEnds : undefined;
        } else {
          task.deadline = undefined;
          task.deadlineTime = false;
          task.repeat = undefined;
          task.repeatEnds = undefined;
        }
        if ($scope.category && ($scope.category.slice(0, 9) == "category-")) {
          task.category = parseInt($scope.category.slice(9));
        } else {
          task.category = undefined;
        }
        task.completed = $scope.selectedTask.completed;

        agenda.saveAgenda();
        $scope.selectedTask = null;
      }
      $scope.category = undefined;
      $scope.categories = [];
      $scope.refresh();
    };

    $mdComponentRegistry.when("agendas-task-detail").then(function(sidenav) {
      $scope.taskDetailIsOpen = angular.bind(sidenav, sidenav.isOpen);
    });
    $scope.$watch("taskDetailIsOpen()", function(newValue, oldValue) {
      if (!newValue && oldValue) {
        $scope.saveTaskDetail();
      }
    }, true);

    $scope.deleteSelectedTask = function(event) {
      $mdDialog.show($mdDialog.confirm().clickOutsideToClose(true).targetEvent(event)
        .title("Delete \"" + $scope.selectedTask.name + "\"?")
        .textContent("Once you hit delete, \"" + $scope.selectedTask.name + "\" will be gone forever.")
        .cancel("Cancel")
        .ok("Delete")
      ).then(function() {
        var agenda = $scope.agendaForTask($scope.selectedTask);
        agenda.deleteTask($scope.selectedTask.id);
        $scope.selectedTask = null;
        agenda.saveAgenda();
        $scope.toggleSidenav("agendas-task-detail");
      });
    };

    $scope.deleteSelectedTasks = function(event) {
      $mdDialog.show($mdDialog.confirm().clickOutsideToClose(true).targetEvent(event)
        .title("Delete " + $scope.selectedTasks.length + " tasks?")
        .textContent("This action cannot be undone.")
        .cancel("Cancel")
        .ok("Delete")
      ).then(function() {
        for (var task of $scope.selectedTasks) {
          var agenda = $scope.agendaForTask(task);
          agenda.deleteTask(task.id);
          agenda.saveAgenda();
        }
        $scope.refresh();
      });
    };

    $scope.newTask = function() {
      var id = $scope.selectedAgenda.newTask("New Task");
      $scope.selectedAgenda.saveAgenda();
      $scope.refresh();
      var tasks = $scope.selectedAgenda.tasks();
      for (var i = tasks.length - 1; i >= 0; i--) {
        if (tasks[i].id == id) {
          $scope.viewTaskDetail(tasks[i]);
          break;
        }
      }
    };

    $scope.generateTimes = function() {
      var times = [{name: "None", value: "", date: false}];
      var currentHour = (new Date()).getHours();
      for (var hour = currentHour; (hour != currentHour) || (times.length <= 1); hour += ((hour >= 23) ? -23 : 1)) {
        for (var minute = 0; minute < 60; minute += 15) {
          var time = {
            value: (new Date(1970, 0, 1, hour, minute, 0, 0)).toJSON()
          };
          time.name = $filter("timeFilter")(new Date(time.value));
          times.push(time);
        }
      }
      return times;
    };
    $scope.times = $scope.generateTimes();

    $scope.$watch("category", function(newValue) {
      if (newValue) {
        if (newValue == "none") {
          $scope.category = undefined;
        } else if (newValue == "new") {
          var agenda = $scope.agendaForTask($scope.selectedTask);
          $mdDialog.show($mdDialog.prompt().clickOutsideToClose(true)
            .title("New Category in \"" + agenda.name() + "\"")
            .textContent("Give your category a name.")
            .placeholder("Name")
            .cancel("Cancel")
            .ok("Done")
          ).then(function(name) {
            if (name) {
              var categoryExists = false;
              for (var category in $scope.categories) {
                if (category.name == name) {
                  categoryExists = true;
                  break;
                }
              }
              if (!categoryExists) {
                var category = agenda.newCategory(name);
                $scope.categories.push({name: name, color: undefined, id: category});
                $scope.category = "category-" + category;
                agenda.saveAgenda();
              } else {
                $scope.category = undefined;
              }
            } else {
              $scope.category = undefined;
            }
          }, function() {
            $scope.category = undefined;
          });
        }
      }
    });

    $scope.showAgendaEditor = function(name, event) {
      $mdDialog.show({
        controller: "AgendaEditorController",
        locals: {
          agendaName: name,
          refresh: function() {
            $scope.refresh();
          }
        },
        templateUrl: "agenda-editor.html",
        escapeToClose: false,
        targetEvent: event
      }).then(function() {
        $scope.refresh();
      });
    };

    $scope.shouldShowCategoryCircle = function(task) {
      var category = task.category;
      var agenda = $scope.agendaForTask(task);
      return (category != undefined && agenda.categoryExists(category)) && agenda.getCategory(category).color;
    };

    $scope.refresh();

    $scope.$watch("isAuthenticated", function() {
      ($scope.isAuthenticated == 0) ? $scope.showGoogleDriveDialog() : "";
    });

    $scope.xs = $mdMedia("xs");
    $scope.$watch(function() {
      return $mdMedia("xs");
    }, function(newValue) {
      $scope.xs = newValue;
    });

    $scope.sync = function() {
      $googleDrive.sync();
    };

    $scope.quickAdd = function(event) {
      $mdDialog.show($mdDialog.prompt().clickOutsideToClose(true).targetEvent(event)
        .title("Quick Add")
        .textContent("This feature is still in development.")
        .placeholder($filter("pickRandomItem")(quickAddSamples))
        .cancel("Cancel")
        .ok("Add")
      ).then(function(response) {
        if (response) {
          var regex = /^(.*?)( +(by|due) +(.+?)| +(today|tomorrow))?( +(in|for) +(.*))?$/;
          var data = regex.exec(response);
          if (data[0]) {
            var name = data[1];
            var deadline = data[4] || data[5];
            var categoryName = data[8];
            var categoryId = undefined;
            for (var category of $scope.selectedAgenda.categories()) {
              if (category.name === categoryName) {
                categoryId = category.id;
                break;
              }
            }
            var deadlineDate = undefined;
            var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            if (deadline == "today") {
              deadlineDate = new Date();
            } else if (deadline == "tomorrow") {
              deadlineDate = new Date(Date.now() + (24 * 60 * 60 * 1000));
            } else if (weekdays.includes(deadline)) {
              var index = weekdays.indexOf(deadline);
              var today = (new Date()).getDay();
              deadlineDate = new Date(Date.now() + ((((index < today) ? (index + 7) : index) - today) * 24 * 60 * 60 * 1000));
            }
            $scope.selectedAgenda.newTask(name, deadlineDate, deadlineDate ? false : undefined, categoryId);
            $scope.selectedAgenda.saveAgenda();
            $scope.refresh();
          }
        }
      });
    };
  })
  .controller("AgendaEditorController", function($scope, $agendaParser, agendaName, colors, $mdDialog, refresh) {
    $scope.init = function() {
      $scope.agenda = $agendaParser.getAgenda(agendaName);
      $scope.name = agendaName;
      $scope.refresh();
    };
    $scope.refresh = function() {
      $scope.categories = $scope.agenda.categories();
    };
    $scope.colors = [];
    for (var color in colors) {
      if (colors.hasOwnProperty(color)) {
        $scope.colors.push({name: color, color: colors[color]})
      }
    }
    $scope.saveCategory = function(category) {
      var original = $scope.agenda.getCategory(category.id);
      original.name = category.name;
      if (category.color == "") {
        original.color = undefined;
        category.color = undefined;
      } else {
        original.color = category.color;
      }
      original.dateModified = new Date();
    };
    $scope.deleteCategory = function(category) {
      $scope.categoriesDeleted = true;
      $scope.agenda.deleteCategory(category.id);
      $scope.refresh();
    };
    $scope.addCategory = function() {
      $scope.agenda.newCategory("Category");
      $scope.refresh();
    };
    $scope.categoriesDeleted = false;

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.saveAndDismiss = function() {
      if ($scope.categoriesDeleted) {
        $scope.agenda.tasks();
      }
      if ($scope.name && $scope.agenda.name() != $scope.name) {
        $scope.renameAgenda();
      }
      $scope.agenda.saveAgenda();
      $mdDialog.hide();
    };

    $scope.renameAgenda = function() {
      if (!$agendaParser.listAgendas().includes($scope.name)) {
        $agendaParser.newAgenda($scope.name);
        $scope.agenda.raw.properties.name = $scope.name;
        $agendaParser.deleteAgenda(agendaName);
      }
    };
    $scope.deleteAgenda = function(event) {
      var l = $scope.agenda.tasks().length;
      $mdDialog.show($mdDialog.confirm().clickOutsideToClose(true).targetEvent(event)
        .title("Delete Agenda \"" + agendaName + "\"?!")
        .textContent("You're about to delete \"" + agendaName + "\" and its " + l + " task" + ((l == 1) ? "" : "s") + ". This cannot be undone.")
        .cancel("Cancel")
        .ok("Delete")
      ).then(function() {
        $agendaParser.deleteAgenda(agendaName);
        refresh();
      });
    };

    $scope.init();
  })
  .factory("$agendaParser", function() {
    var agendaParser = {};

    function Agenda(agenda) {
      this.raw = agenda;
    }

    Agenda.prototype = {
      tasks: function() {
        var tasks = [];
        var i = 0;
        for (var task of this.raw.items) {
          if (!task.deleted) {
            var object = {};
            for (var property in task) {
              if (property == "deadline" || property == "dateCreated" || property == "repeatEnds") {
                object[property] = (typeof task[property] == "undefined") ? task[property] : new Date(task[property]);
              } else if (property == "category" && typeof task.category == "number") {
                object[property] = this.categoryExists(task[property]) ? task[property] : undefined;
              } else if (task.hasOwnProperty(property)) {
                object[property] = task[property];
              }
            }
            object.agenda = this.name();
            object.id = i;
            tasks.push(object);
          }
          i++;
        }
        return tasks;
      },
      categories: function() {
        var categories = [];
        var i = 0;
        for (var category of this.raw.categories) {
          if (!category.deleted) {
            var object = {};
            for (var property in category) {
              if (property == "dateCreated") {
                object[property] = (typeof category[property] == "date") ? category[property] : new Date(category[property]);
              } else if (category.hasOwnProperty(property)) {
                object[property] = category[property];
              }
            }
            object.id = i;
            categories.push(object);
          }
          i++;
        }
        return categories;
      },
      name: function() {
        return this.raw.properties.name;
      },
      dates: function() {
        var dates = {};
        for (var item of [["modified", "dateModified"], ["created", "dateCreated"]]) {
          var date = this.raw.properties[item[1]];
          dates[item[0]] = (typeof date == "date") ? date : new Date(date);
        }
        return dates;
      },

      modified: function() {
        this.raw.properties.dateModified = new Date();
      },

      taskExists: function(id) {
        return (((id >= 0) && (id < this.raw.items.length)) && !(this.raw.items[id].deleted));
      },

      newTask: function(name, deadline, deadlineTime, category) {
        var task = {name: name};
        if (deadline) {
          task.deadline = deadline;
          task.deadlineTime = deadlineTime;
        }
        if (category !== undefined) {
          task.category = category;
        }
        task.dateCreated = new Date();
        task.dateModified = new Date();
        task.completed = false;
        this.raw.items.push(task);
        return this.raw.items.length - 1;
      },

      getTask: function(id) {
        if (this.taskExists(id)) {
          var task = this.raw.items[id];
          task.dateCreated = (typeof task.dateCreated != "date") ? new Date(task.dateCreated) : task.dateCreated;
          if (task.category != undefined && !this.categoryExists(task.category)) {
            task.category = undefined;
          }
          task.dateModified = new Date();
          return task;
        }
      },

      deleteTask: function(id) {
        if (this.taskExists(id)) {
          this.raw.items[id] = {deleted: new Date()};
        }
      },

      newCategory: function(name, color) {
        var category = {name: name, color: color, dateCreated: new Date(), dateModified: new Date()};
        this.raw.categories.push(category);
        return this.raw.categories.length - 1;
      },

      categoryExists: function(id) {
        return (((id >= 0) && (id < this.raw.categories.length)) && !(this.raw.categories[id].deleted));
      },

      deleteCategory: function(id) {
        if (this.categoryExists(id)) {
          this.raw.categories[id] = {deleted: new Date()};
        }
      },

      getCategory: function(id) {
        if (this.categoryExists(id)) {
          var category = this.raw.categories[id];
          category.dateCreated = (typeof category.dateCreated != "date") ? new Date(category.dateCreated) : category.dateCreated;
          return category;
        }
      },

      saveAgenda: function() {
        this.modified();
        localStorage.setItem(agendaParser.agendaKey(this.name()), JSON.stringify(this.raw));
      }

    };

    agendaParser.listAgendas = function() {
      var list = localStorage.getItem("agendas");
      return list ? JSON.parse(list) : [];
    };

    agendaParser.emptyAgenda = function(agendaName) { return new Agenda({
      properties: {
        name: agendaName,
        dateModified: new Date(),
        dateCreated: new Date()
      },
      categories: [],
      items: []
    });};

    agendaParser.agendaKey = function(agendaName) {
      return "agendas_" + agendaName;
    }

    agendaParser.newAgenda = function(agendaName) {
      var list = agendaParser.listAgendas();
      var actualName = agendaName;
      while (list.includes(actualName)) {
        actualName += "-";
      }

      localStorage.setItem(agendaParser.agendaKey(actualName), JSON.stringify(agendaParser.emptyAgenda(agendaName).raw));

      list.push(actualName);
      localStorage.setItem("agendas", JSON.stringify(list));
      return agendaParser.getAgenda(actualName);
    };

    agendaParser.parseAgenda = function(agendaJSON) {
      var agenda = {};
      try {
        agenda = JSON.parse(agendaJSON);
      } catch (jsonError) {
        return {error: "Agenda is invalid."};
      }

      return new Agenda(agenda);
    };

    agendaParser.getAgenda = function(agendaName) {
      var list = agendaParser.listAgendas();
      if (!list.includes(agendaName)) {
        return {error: "Agenda does not exist"};
      }

      var agendaJSON = localStorage.getItem(agendaParser.agendaKey(agendaName));
      if (!agendaJSON) {
        return {error: "Agenda is corrupted."};
      }

      return agendaParser.parseAgenda(agendaJSON);
    };

    agendaParser.deleteAgenda = function(agenda) {
      if (agendaParser.listAgendas().includes(agenda)) {
        var agendas = agendaParser.listAgendas();
        var index = agendas.indexOf(agenda);
        if (index >= 0) {
          agendas.splice(agendas.indexOf(agenda), 1);
          localStorage.setItem("agendas", JSON.stringify(agendas));
          localStorage.removeItem(agendaParser.agendaKey(agenda));
        }
      }
    };

    return agendaParser;
  })
  .factory("$agendaSorter", function() {
    var agendaSorter = {};

    agendaSorter.sort = function(a, test) { // TODO: Replace with native sort()
      var array = a.slice();
      var swaps = 0;
      for (var passes = 0; (swaps > 0) || (passes < 1); passes++) {
        swaps = 0;
        for (var i = 1; i < (array.length - passes); i++) {
          var a = array[i - 1];
          var b = array[i];
          if (test(a, b)) {
            array[i - 1] = b;
            array[i]     = a;
            swaps++;
          }
        }
      }
      return array;
    };

    agendaSorter.deadlineSort = function(a, b) {
      var dateA = new Date(a.deadline);
      var dateB = new Date(b.deadline);
      for (var date of [dateA, dateB]) {
        if (date) {
          date.setHours(0);
          date.setMinutes(0);
          date.setSeconds(0);
          date.setMilliseconds(0);
        }
      }
      if (!a.deadline && !b.deadline) {
        return (b.completed && !a.completed);
      } else if (!a.deadline || !b.deadline) {
        return (b.deadline && !a.deadline);
      } else if (dateA.getTime() == dateB.getTime()) {
        if (a.completed && !b.completed) {
          return true;
        } else if (b.completed && !a.completed) {
          return false;
        } else if (a.deadlineTime && !b.deadlineTime) {
          return false;
        } else if (b.deadlineTime && !a.deadlineTime) {
          return true;
        } else if (a.deadlineTime) {
          return a.date > b.date;
        }
        return false;
      } else {
        return dateA > dateB;
      }
    };

    agendaSorter.separateDeadlines = function(a) {
      var tasks = agendaSorter.sort(a, agendaSorter.deadlineSort);
      var dates = [];
      var current = null;
      var i = 0;
      for (var task of tasks) {
        var date = new Date(task.deadline);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        if (!current) {
          current = {deadline: task.deadline ? date : undefined, tasks: []};
        }
        current.tasks.push(task);
        i++;
        if (tasks.length > i) {
          var nextDate = null;
          if (tasks[i].hasOwnProperty("deadline") && typeof tasks[i].deadline != "undefined") {
            nextDate = new Date(tasks[i].deadline);
            nextDate.setHours(0);
            nextDate.setMinutes(0);
            nextDate.setSeconds(0);
            nextDate.setMilliseconds(0);
            if (nextDate.getTime() != current.deadline.getTime()) {
              dates.push(current);
              current = null;
            }
          } else if (current.deadline) {
            dates.push(current);
            current = null;
          }
        }
      }
      if (current) {
        dates.push(current);
      }
      return dates;
    };

    return agendaSorter;
  })
  .factory("$googleDrive", function($rootScope, $agendaParser, $agendaSorter) {
    var buildMultipart = function(parts) {
      var boundary = Math.random().toString(36).slice(2);
      var mime = "multipart/mixed; boundary=\"" + boundary + "\"";
      var body = [];
      for (var part of parts) {
        body.push("\r\n--" + boundary + "\r\n");
        body.push("Content-Type: " + part.mimeType + "\r\n\r\n");
        body.push(part.content);
      }
      body.push("\r\n--" + boundary + "--");
      return {
        mimeType: mime,
        body: body.join("")
      };
    };

    var mergeProperties = function(local, online) {
      return local;
    };

    var mergeTasks = function(local, online) {
      // Decide if each task needs to be merged
      var needsMerge   = [];
      var newOnline    = [];
      var newLocal     = [];
      var deletedTasks = [];

      var deleted = 0;
      for (var i = 0; i < local.length; i++) {
        var task = local[i];
        task.id = i - deleted;
        // Try to obtain a task's online counterpart
        if (online.length > i) {
          var onlineTask = online[i];
          onlineTask.id = i;
          // Is the local task deleted?
          if (task.deleted) {
            // Is the online task deleted?
            if (onlineTask.deleted) {
              // Delete this task.
              task.deleted = ((new Date(task.deleted)) < (new Date(onlineTask.deleted))) ? new Date(task.deleted) : new Date(onlineTask.deleted);
              deletedTasks.push(task);
            } else if ((new Date(task.deleted)) > (new Date(onlineTask.dateCreated))) {
              // Delete this task.
              deletedTasks.push(task);
            } else {
              // This task was created online.
              newOnline.push(onlineTask);
            }
          } else if (onlineTask.deleted) {
            // When was the local task created?
            if ((new Date(task.dateCreated)) > (new Date(onlineTask.created))) {
              // This task was created locally.
              newLocal.push(task);
            } else {
              // Delete this task.
              deletedTasks.push(onlineTask);
            }
          } else {
            // Are these tasks the same?
            if ((new Date(task.dateCreated)).getTime() == (new Date(onlineTask.dateCreated)).getTime()) {
              // These tasks need to be merged.
              needsMerge.push({local: task, online: onlineTask});
            } else {
              // This task was created both locally and online.
              newLocal.push(task);
              newOnline.push(onlineTask);
            }
          }
        } else {
          // Has the task been deleted?
          if (task.deleted) {
            // Exclude the task
            console.log("Task excluded");
            deleted++;
          } else {
            // This task was created locally.
            newLocal.push(task);
          }
        }
      }
      // Add the rest of the tasks
      for (var i = 0; i < online.length; i++) {
        var task = online[i];
        if (typeof task.id != "number") {
          task.id = i;
          newOnline.push(task);
        }
      }
      var shouldUpload = (newLocal.length > 0) || (deletedTasks.length > 0);
      // Merge tasks
      var mergedTasks = [];
      for (var task of needsMerge) {
        // Merge a single task.
        if (!task.local.dateModified && !task.online.dateModified) {
          mergedTasks.push(task.online);
        } else if (!task.online.dateModified) {
          shouldUpload = true;
          mergedTasks.push(task.local);
        } else {
          var localDate = new Date(task.local.dateModified);
          var onlineDate = new Date(task.online.dateModified);
          mergedTasks.push((localDate > onlineDate) ? task.local : task.online);
          if (localDate > onlineDate) {
            shouldUpload = true;
          }
        }
      }
      // Assign new IDs to locally created tasks
      var totalLength = needsMerge.length + newOnline.length + deletedTasks.length;
      for (var i = 0; i < newLocal; i++) {
        var task = newLocal[i];
        task.id = totalLength + i;
      }
      // Combine everything
      var unsorted = mergedTasks.concat(newOnline, newLocal, deletedTasks);
      // Sort the tasks by ID
      var merged = $agendaSorter.sort(unsorted, function(a, b) {
        return a.id > b.id;
      });
      // Remove id properties
      for (var task of merged) {
        delete task.id;
      }
      // We're done! Phew.
      console.log({merged: merged, needsMerge: needsMerge, mergedTasks: mergedTasks, newOnline: newOnline, newLocal: newLocal, deletedTasks: deletedTasks, unsorted: unsorted});
      return {tasks: merged, shouldUpload: shouldUpload};
    };

    var mergeAgendas = function(local, online) {
      var properties = mergeProperties(local.raw.properties, online.raw.properties);
      var categories = mergeTasks(local.raw.categories, online.raw.categories);
      var items      = mergeTasks(local.raw.items, online.raw.items);
      var merged     = {agenda: {properties: properties, categories: categories.tasks, items: items.tasks}, shouldUpload: categories.shouldUpload || items.shouldUpload};
      console.log(merged);
      return merged;
    };

    var finalizeSyncing = function(folder, response) {
      var list = response.result.files;
      var localList = $agendaParser.listAgendas();
      var localDriveIds = [];
      for (var name of localList) {
        var agenda = $agendaParser.getAgenda(name);
        if (agenda.raw.properties.driveId) {
          // The agenda is already in Google Drive
          var deleted = true;
          for (var file of list) {
            if (file.id == agenda.raw.properties.driveId) {
              localDriveIds.push(file.id);
              deleted = false;
              break;
            }
          }
          if (deleted) {
            // Delete the agenda locally
            $agendaParser.deleteAgenda(name);
            $rootScope.$broadcast("driveSyncFinished");
          } else {
            var downloadRequest = gapi.client.drive.files.get({
              fileId: agenda.raw.properties.driveId,
              alt: "media"
            });
            (function() {
              var agendaName = name;
              var local = agenda;
              downloadRequest.then(function(response) {
                if (response.status == 200) {
                  var merged = mergeAgendas(local, $agendaParser.parseAgenda(response.body));
                  var agenda = $agendaParser.getAgenda(agendaName);
                  agenda.raw = merged.agenda;
                  agenda.saveAgenda();
                  $rootScope.$broadcast("driveSyncFinished");
                  // Update the agenda
                  if (merged.shouldUpload) {
                    var fileId = agenda.raw.properties.driveId;
                    delete agenda.raw.properties.driveId;
                    var multipart = buildMultipart([
                      {
                        mimeType: "application/json",
                        content: JSON.stringify({
                          name: agenda.name(),
                          mimeType: "application/json"
                        })
                      },
                      {
                        mimeType: "application/json",
                        content: JSON.stringify(agenda.raw)
                      }
                    ]);
                    gapi.client.request({
                      path: "/upload/drive/v3/files/" + fileId,
                      method: "PATCH",
                      params: {
                        uploadType: "multipart"
                      },
                      headers: {"Content-Type": multipart.mimeType},
                      body: multipart.body
                    }).then(function(response) {
                      console.log(response);
                    });
                  }
                }
              });
            })();
          }
        } else {
          // The agenda needs to be uploaded to Google Drive
          var multipart = buildMultipart([
            {
              mimeType: "application/json",
              content: JSON.stringify({
                name: agenda.name(),
                mimeType: "application/json",
                parents: [folder.id]
              })
            },
            {
              mimeType: "application/json",
              content: JSON.stringify(agenda.raw)
            }
          ]);
          var request = gapi.client.request({
            path: "/upload/drive/v3/files",
            method: "POST",
            params: {
              uploadType: "multipart"
            },
            headers: {"Content-Type": multipart.mimeType},
            body: multipart.body
          });
          (function() {
            var agendaName = name;
            request.then(function(response) {
              console.log(response);
              if (response.result.id) {
                var agenda = $agendaParser.getAgenda(agendaName);
                agenda.raw.properties.driveId = response.result.id;
                agenda.saveAgenda();
                $rootScope.$broadcast("driveSyncFinished");
              }
            });
          })();
        }
      }
      for (var file of list) {
        console.log(file);
        if (!localDriveIds.includes(file.id) && file.parents.includes(folder.id)) {
          // Has the agenda been deleted locally?
          // Download the agenda.
          var downloadRequest = gapi.client.drive.files.get({
            fileId: file.id,
            alt: "media"
          });
          (function() {
            var metadata = file;
            downloadRequest.then(function(response) {
              console.log("Downloaded agenda " + metadata.name);
              if (response.status == 200) {
                var agenda = $agendaParser.newAgenda(metadata.name);
                agenda.raw = response.result;
                agenda.raw.properties.driveId = metadata.id;
                agenda.saveAgenda();
                $rootScope.$broadcast("driveSyncFinished");
              }
            });
          })();
        }
      }
    };

    return {
      checkAuth: function(CLIENT_ID, SCOPES, handler) {
        gapi.auth.authorize({
          client_id: CLIENT_ID,
          scope: SCOPES,
          immediate: true
        }, handler);
      },
      authorize: function(CLIENT_ID, SCOPES, handler) {
        gapi.auth.authorize({
          client_id: CLIENT_ID,
          scope: SCOPES,
          immediate: false
        }, handler);
      },
      loadApis: function(callback) {
        gapi.client.load("drive", "v3", callback);
      },

      buildMultipart: buildMultipart,
      mergeAgendas: mergeAgendas,

      sync: function(folder) {
        gapi.client.drive.files.list({
          spaces: "appDataFolder",
          fields: "files(id,name,parents,mimeType)"
        }).then(function(response) {
          var agendaFolderFound = false;
          for (var file of response.result.files) {
            if (file.mimeType == "application/vnd.google-apps.folder" && file.name == "agendas") {
              agendaFolderFound = true;
              finalizeSyncing(file, response);
              break;
            }
          }
          if (!agendaFolderFound) {
            var list = response;
            gapi.client.drive.files.create({
              resource: {
                name: "agendas",
                mimeType: "application/vnd.google-apps.folder",
                parents: ["appDataFolder"]
              }
            }).then(function(response) {
              finalizeSyncing(file, list);
            });
          }
        });
        console.log("Syncing");
      }
    };
  })
  .filter("dateFilter", function() { return function(input) {
    if (!input) {
      return "No deadline";
    }

    var inputDate = new Date(input);
    inputDate.setHours(0);
    inputDate.setMinutes(0);
    inputDate.setSeconds(0);
    inputDate.setMilliseconds(0);

    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    var difference = Math.floor((inputDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    if (difference == 0) {
      return "Today";
    } else if (inputDate < today) {
      return (difference * -1) + " " + ((difference == -1) ? "day" : "days") + " ago";
    } else if (difference == 1) {
      return "Tomorrow";
    } else if (difference < 7) {
      return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][inputDate.getDay()] + " (" + inputDate.toLocaleDateString() + ")";
    } else {
      return inputDate.toLocaleDateString();
    }
  }})
  .filter("timeFilter", function() { return function(input) {
    return input ? (((input.getHours() % 12) == 0) ? 12 : (input.getHours() % 12)) + ":" + ((input.getMinutes() == 0) ? "00" : input.getMinutes()) + ((input.getHours() / 12 >= 1) ? "pm" : "am") : "";
  }})
  .filter("tasksListFilter", function() { return function(input, showCompleted) {
    return showCompleted ? input : input.filter(function(value) {
      var incompleteTaskFound = false;
      for (var task of value.tasks) {
        if (!task.completed) {
          incompleteTaskFound = true;
          break;
        }
      }
      return incompleteTaskFound;
    });
  }})
  .filter("completedTaskExclusionFilter", function() { return function(input, showCompleted) {
    return showCompleted ? input : input.filter(function(task) {
      return !task.completed;
    });
  }})
  .filter("categoryNamingFilter", function() { return function(input, agenda, selectedAgenda) {
    var prefix = (typeof selectedAgenda == "string") ? agenda.name() : "";
    var category = (input != undefined && agenda.categoryExists(input)) ? agenda.getCategory(input).name : "";
    return prefix + ((prefix && category) ? " | " : "") + category;
  }})
  .filter("categoryColorFilter", function(colors) { return function(input, agenda) {
    return agenda ? ((input != undefined && agenda.categoryExists(input)) ? colors[agenda.getCategory(input).color] : false) : colors[input];
  }})
  .filter("pickRandomItem", function() { return function(input) {
    return input[Math.floor(Math.random() * input.length)];
  }})
  .value("quickAddSamples", [
    "Do work today",
    "Rent instrument by Saturday",
    "Work on essay for English",
    "Cook today for Family"
  ]);
