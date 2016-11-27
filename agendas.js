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
  .value("wallpapers", [
    {
      id: "amazon-rainforest",
      url: "https://c1.staticflickr.com/7/6091/6285070575_1cfae9eb7d_b.jpg",
      name: "Amazon Rainforest"
    },
    {
      id: "times-square",
      url: "https://upload.wikimedia.org/wikipedia/commons/1/19/Times_Square,_New_York_City_(HDR).jpg",
      name: "Times Square"
    },
    {
      id: "sushi",
      url: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Western_Sushi.jpg",
      name: "Sushi"
    },
    {
      id: "mlg",
      url: "https://i.ytimg.com/vi/rosclr8QUqo/maxresdefault.jpg",
      name: "MLG"
    },
    {
      id: "doge",
      url: "http://vignette1.wikia.nocookie.net/sanicsource/images/9/97/Doge.jpg/revision/latest?cb=20160112233015",
      name: "Doge"
    },
    {
      id: "custom",
      name: "Custom"
    }
  ])
  .controller("AgendasUIController", function($scope, $agendaSorter, $mdSidenav, $controller, $mdDialog, $mdComponentRegistry, $filter, $rootScope, $mdMedia, $timeout, quickAddSamples, wallpapers, colors) {

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
        if (result) {
          var agendaRef = firebase.database().ref("/agendas/").push();
          agendaRef.child("name").set(result).then(function() {
            firebase.database().ref("/permissions/").child(agendaRef.key).child($scope.currentUser.uid).set("editor").then(function() {
              $scope.agendasRef.child(agendaRef.key).set(true);
            });
          });
        }
      });
    };

    $scope.agendas = Object.create(null);
    $scope.agendasList = [];

    $scope.$watch("currentUser", function() {
      if ($scope.currentUser) {
        $scope.fullScreenModal = false;
        $scope.agendasRef = firebase.database().ref("/users/" + $scope.currentUser.uid + "/agendas");

        $scope.agendasRef.on("child_added", function(data) {
          firebase.database().ref("/agendas/" + data.key).on("value", function(snapshot) {
            $scope.agendas[snapshot.key] = snapshot.val();
            $timeout(function() {
              $scope.agendasList = Object.keys($scope.agendas);
            });
          });
        });
      } else {
        $scope.fullScreenModal = true;
      }
    });

    $scope.resetTasks = function() {
      $scope.tasks = {};
      $scope.taskGroups = [];

      $scope.categories = {};
      $scope.categoryList = [];

      $scope.schedule = {};
    };

    $scope.resetTasks();

    $scope.selectAgenda = function(agenda) {
      $scope.selectedAgenda = agenda;
    };

    $scope.$watch("selectedAgenda", function() {
      $scope.resetTasks();
      if ($scope.selectedAgenda) {
        $scope.agendaRef = firebase.database().ref("/agendas/" + $scope.selectedAgenda);
        $scope.categoriesRef = firebase.database().ref("/categories/" + $scope.selectedAgenda);
        $scope.tasksRef = firebase.database().ref("/tasks/" + $scope.selectedAgenda);
        $scope.scheduleRef = firebase.database().ref("/schedules/" + $scope.selectedAgenda);

        $scope.tasksRef.on("child_added", function(data) {
          $scope.tasks[data.key] = data.val();
          $timeout($scope.refreshTasks);
        });

        $scope.tasksRef.on("child_changed", function(data) {
          $scope.tasks[data.key] = data.val();
          $timeout($scope.refreshTasks);
        });

        $scope.tasksRef.on("child_removed", function(data) {
          delete $scope.tasks[data.key];
          $timeout($scope.refreshTasks);
        });

        $scope.categoriesRef.on("child_added", function(data) {
          $scope.categories[data.key] = data.val();
          $timeout($scope.refreshCategories);
        });

        $scope.categoriesRef.on("child_changed", function(data) {
          $scope.categories[data.key] = data.val();
          $timeout($scope.refreshCategories);
        });

        $scope.categoriesRef.on("child_removed", function(data) {
          delete $scope.categories[data.key];
          $timeout($scope.refreshCategories);
        });

        $scope.scheduleRef.on("value", function(data) {
          $scope.schedule = data.val();
        });

        $scope.taskCreationAllowed = true;
      } else {
        $scope.agendaRef = null;
        $scope.permissionsRef = null;
        $scope.categoriesRef = null;
        $scope.tasksRef = null;
        $scope.scheduleRef = null;

        $scope.taskCreationAllowed = false;
      }
    });

    $scope.newTask = function() {
      $scope.tasksRef.push().set({
        name: "New task"
      });
    };

    $scope.selectedTasks = [];

    $scope.selectTask = function(task, event) {
      $scope.viewTaskDetail(task);
    };

    $scope.refresh = angular.noop;

    $scope.refreshTasks = function() {
      $scope.taskGroups = $agendaSorter.separateDeadlines(Object.keys($scope.tasks).map(function(input) {
        var task = $scope.tasks[input];
        task.key = input;
        return task;
      }));
    };

    $scope.refreshCategories = function() {
      $scope.categoryList = Object.keys($scope.categories).map(function(input) {
        var category = $scope.categories[input];
        category.key = input;
        return category;
      });
    };

    $scope.completeTask = function(task) {
      var next = undefined;
      var deadline = new Date(task.deadline);
      if (task.deadline) {
        if (task.repeat == "day") {
          next = new Date(deadline.getTime() + (24 * 60 * 60 * 1000));
        } else if (task.repeat == "weekday") {
          next = new Date(deadline.getTime() + (24 * 60 * 60 * 1000));
          while ((next.getDay() == 0) || (next.getDay() == 6)) {
            next = new Date(next.getTime() + (24 * 60 * 60 * 1000));
          }
        } else if (task.repeat == "week") {
          next = new Date(deadline.getTime() + (7 * 24 * 60 * 60 * 1000));
        } else if (task.repeat == "2-weeks") {
          next = new Date(deadline.getTime() + (14 * 24 * 60 * 60 * 1000));
        } else if (task.repeat == "month") {
          next = new Date(deadline.getTime() + (30 * 24 * 60 * 60 * 1000));
        } else if (task.repeat == "year") {
          next = new Date(deadline.getFullYear() + 1, deadline.getMonth(), deadline.getDate(), 0, 0, 0, 0);
        }
      }
      if (next) {
        next.setHours(0);
        next.setMinutes(0);
        next.setSeconds(0);
        next.setMilliseconds(0);
      }
      if (task.completed && next && (!task.repeatEnds || (next <= new Date(task.repeatEnds)))) {
        $scope.tasksRef.child(task.key).child("deadline").set((new Date(
          next.getFullYear(),
          next.getMonth(),
          next.getDate(),
          deadline.getHours(),
          deadline.getMinutes(),
          deadline.getSeconds(),
          deadline.getMilliseconds()
        )).toJSON());
      } else {
        $scope.tasksRef.child(task.key).child("completed").set(task.completed);
      }
    };

    $scope.category = undefined;
    $scope.selectedTask = null;
    $scope.viewTaskDetail = function(task) {
      $scope.selectedTask = task;
      $scope.selectedTask.deadlineDate = task.deadline ? new Date(task.deadline) : undefined;
      console.log(task);
      console.log(deadline);
      if ($scope.selectedTask.deadline && $scope.selectedTask.deadlineTime) {
        var deadline = new Date($scope.selectedTask.deadline);
        $scope.selectedTask.time = deadline.getHours() * 60 + deadline.getMinutes();
        console.log($scope.selectedTask.time);
      } else {
        $scope.selectedTask.time = undefined;
      }
      $scope.selectedTask.repeat = task.repeat ? task.repeat : "";
      // $scope.selectedBlock = undefined;
      // if ($scope.selectedTask.category !== undefined && $scope.agendaForTask(task).raw.properties.schedule && !$scope.agendaForTask(task).raw.properties.schedule.deleted) {
        // $scope.generateBlocks($scope.selectedTask.category);
      // }
      $scope.toggleSidenav("agendas-task-detail");
    };

    /* $scope.selectedTasks = [];
    $scope.clearSelection = function() {
      for (var task of $scope.selectedTasks) {
        task.selected = false;
      }
      $scope.selectedTasks = [];
    }

    $scope.hideMultipleDeadlineChange = function() {
      $scope.showingMultipleDeadlineChange = false;
      $scope.multipleDeadline = undefined;
    };
    $scope.confirmMultipleDeadlineChange = function() {
      for (var task of $scope.selectedTasks) {
        var agenda = $scope.agendaForTask(task);
        var t = agenda.getTask(task.id);
        t.deadline = $scope.multipleDeadline;
        t.deadlineTime = false;
        agenda.saveAgenda();
      }
      $scope.selectedTasks = [];
      $scope.refresh();
      $scope.hideMultipleDeadlineChange();
    } */

    $scope.taskDetailIsOpen = function() {
      return false;
    };
    $scope.saveTaskDetail = function() {
      if ($scope.selectedTask) {
        var task = {};
        task.name = $scope.selectedTask.name;
        if ($scope.selectedTask.deadlineDate) {
          var hours = 0;
          var minutes = 0;
          if ($scope.selectedTask.time !== undefined) {
            hours = Math.floor($scope.selectedTask.time / 60);
            minutes = $scope.selectedTask.time - (hours * 60)
          }
          task.deadline = (new Date(
            $scope.selectedTask.deadlineDate.getFullYear(),
            $scope.selectedTask.deadlineDate.getMonth(),
            $scope.selectedTask.deadlineDate.getDate(),
            hours,
            minutes,
            0,
            0
          )).toJSON();
          if ($scope.selectedTask.deadlineTime) {
            task.deadlineTime = true;
          }
          task.repeat = $scope.selectedTask.repeat ? $scope.selectedTask.repeat : "";
          task.repeatEnds = (task.repeat && $scope.selectedTask.repeatEnds) ? $scope.selectedTask.repeatEnds : "";
        }
        if ($scope.selectedTask.category) {
          task.category = $scope.selectedTask.category;
        }

        if ($scope.selectedTask.notes) {
          task.notes = $scope.selectedTask.notes;
        }
        task.completed = $scope.selectedTask.completed || false;

        $scope.tasksRef.child($scope.selectedTask.key).set(task);

        $scope.selectedTask = null;
      }
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
        $scope.tasksRef.child($scope.selectedTask.key).remove().then(function() {
          $scope.selectedTask = null;
          $scope.toggleSidenav("agendas-task-detail");
        });
      });
    };

    /* $scope.deleteSelectedTasks = function(event) {
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
    }; */

    $scope.blocks = [];
    $scope.generateBlocks = function(category) {
      $scope.blocks = [];
      if (category === undefined) {
        return;
      }
      // Get the control points.
      var schedule = $scope.schedule;
      var days = Object.keys(schedule.days);
      var points = schedule.points;
      var blocks = Object.keys(schedule.blocks).map(function(input) {
        return schedule.blocks[input];
      });
      if (Object.keys(points).length <= 0) {
        return;
      }
      // Sort the control points.
      points = $agendaSorter.sort(Object.keys(points).map(function(input) {
        return points[input];
      }).filter(function(v) {
        var d = (new Date(v.date)).getDay();
        return d > 0 || d < 6;
      }), function(a, b) {
        return new Date(a.date) > new Date(b.date);
      });
      // Select the most recent control point.
      var now = new Date();
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      now.setMilliseconds(0);
      for (var j = 0; j < 7; j++) {
        var d = new Date(now.getTime() + (j * 24 * 60 * 60 * 1000));
        if (d.getDay() == 0 || d.getDay() == 6) {
          continue;
        }
        var recentPoint = -1;
        var freeDays = 0;
        for (var i = points.length - 1; i >= 0; i--) {
          var pointDate = new Date(points[i].date);
          if (pointDate <= d && points[i].type !== "free" && pointDate.getDay() > 0 && pointDate.getDay() < 6) {
            recentPoint = i;
            break;
          } else if (pointDate.getTime() == d.getTime()) {
            recentPoint = -1;
            break;
          } else if (points[i].type == "free" && pointDate < d) {
            freeDays++;
          }
        }
        if (recentPoint == -1) {
          continue;
        }
        // Calculate the number of weekends.
        var weekends = Math.floor((d.getTime() - pointDate.getTime()) / (7 * 24 * 60 * 60 * 1000)) + ((pointDate.getDay() > d.getDay()) ? 1 : 0);
        // What day is today?
        var day = days[Math.round((((d.getTime() - pointDate.getTime()) / (24 * 60 * 60 * 1000)) - (freeDays + (2 * weekends)) + days.indexOf(points[recentPoint].type)) % days.length)];
        // Find the blocks that the category occurs in.
        for (var b of blocks) {
          if (b[day] == category) {
            if (b.time !== undefined) {
              $scope.blocks.push(new Date(d.getTime() + (b.time * 60 * 1000)));
            } else {
              $scope.blocks.push(new Date(d.getTime()));
            }
          }
        }
      }
    };
    $scope.refreshBlocks = function() {
      if ($scope.selectedTask.category) {
        return new Promise(function(resolve, reject) {
          $scope.generateBlocks($scope.selectedTask.category);
          resolve();
        });
      } else {
        $scope.generateBlocks(undefined);
      }
    };
    $scope.$watch("selectedBlock", function() {
      if (!isNaN($scope.selectedBlock)) {
        var date = $scope.blocks[parseInt($scope.selectedBlock)];
        $scope.selectedTask.deadlineDate = new Date(date.getTime());
        $scope.selectedTask.deadline = new Date(date.getTime());
        if (date.getTime() % (24 * 60 * 60 * 1000) != 0) {
          $scope.selectedTask.deadlineTime = true;
          $scope.selectedTask.time = (date.getHours() * 60) + date.getMinutes();
        } else {
          $scope.selectedTask.deadlineTime = false;
          $scope.selectedTask.time = undefined;
        }
      }
    });

    $scope.newCategory = function() {
      $scope.selectedTask.category = undefined;
      $mdDialog.show($mdDialog.prompt().clickOutsideToClose(true)
        .title("New Category in \"" + $scope.agendas[$scope.selectedAgenda].name + "\"")
        .textContent("Give your category a name.")
        .placeholder("Name")
        .cancel("Cancel")
        .ok("Done")
      ).then(function(name) {
        if (name) {
          var category = $scope.categoriesRef.push();

          category.set({name: name}).then(function() {
            $timeout(function() {
              $scope.refreshCategories();
              $scope.selectedTask.category = category.key;
            });
          });
        }
      });
    };

    $scope.showAgendaEditor = function(name, event) {
      $mdDialog.show({
        controller: "AgendaEditorController",
        locals: {
          agenda: name,
          refresh: function() {
            $scope.refresh();
          },
          settings: $scope.settings
        },
        templateUrl: "agenda-editor.html",
        escapeToClose: false,
        targetEvent: event
      }).then(function() {
        $scope.refresh();
      });
    };

    $scope.settings = JSON.parse(localStorage.getItem("agendas-settings") || "{}");
    $scope.showCompleted = $scope.settings.showCompleted || false;
    $scope.openSettings = function(event) {
      $mdDialog.show({
        controller: "AgendasSettingsController",
        templateUrl: "settings.html",
        escapeToClose: false,
        targetEvent: event
      }).then(function() {
        $scope.settings = JSON.parse(localStorage.getItem("agendas-settings") || "{}");
        $scope.showCompleted = $scope.settings.showCompleted || false;
        $scope.refreshWallpaper();
      });
    };

    $scope.refreshWallpaper = function() {
      var wallpaper = $scope.settings.wallpaper || {id: "amazon-rainforest"};
      for (var w of wallpapers) {
        if (w.id == wallpaper.id) {
          $scope.wallpaper = {"background-image": "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('" + (w.url || wallpaper.customURL) + "')"}
          break;
        }
      }
    };
    $scope.refreshWallpaper();

    $scope.xs = $mdMedia("xs");
    $scope.$watch(function() {
      return $mdMedia("xs");
    }, function(newValue) {
      $scope.xs = newValue;
    });

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

    $scope.getColor = function(color) {
      return colors[color];
    }

    $scope.googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    $scope.githubAuthProvider = new firebase.auth.GithubAuthProvider();

    var signInSuccess = function(result) {
      $scope.isLoading = false;
      $scope.$apply();
    };

    var signInFailure = function(error) {
      console.log(error);

      $scope.isLoading = false;
      $scope.$apply();
    };

    $scope.signInWithGoogle = function() {
      firebase.auth().signInWithPopup($scope.googleAuthProvider).then(signInSuccess).catch(signInFailure);
      $scope.isLoading = true;
    };

    $scope.signInWithGithub = function() {
      firebase.auth().signInWithPopup($scope.githubAuthProvider).then(signInSuccess).catch(signInFailure);
      $scope.isLoading = true;
    };

    firebase.auth().onAuthStateChanged(function(user) {
      $scope.currentUser = user;
      $scope.$apply();
    });

    $scope.signOut = function() {
      firebase.auth().signOut();
    };

    $scope.migrateCallbacks = [];

    $scope.migrate = function() {
      $scope.fullScreenModal = true;
      $scope.migration = true;
      document.getElementById("migration-iframe").setAttribute("src", "http://anli5005.github.io/agendas/migrate.html");
      window.onmessage = function(e) {
        if (e.data.ready) {
          e.source.postMessage({name: "Agendas 2.0"}, "http://anli5005.github.io");
        } else if (e.data.agendas) {
          $timeout(function() {
            $scope.migration = false;
            $scope.migrating = true;
            $timeout(function() {
              $scope.startMigrating(e.data.agendas);
            }, 500);
          });
        }
      };
    };

    $scope.cancelMigration = function() {
      $scope.fullScreenModal = false;
      $scope.migration = false;
      document.getElementById("migration-iframe").setAttribute("src", "");
    };

    $scope.$watch("fullScreenModal", function() {
      if ($scope.fullScreenModal) {
        $mdSidenav("agendas-navigation-sidenav").close();
      }
    });

    $scope.startMigrating = function(agendas) {
      for (var agenda of agendas) {
        (function() {
          var agendaRef = firebase.database().ref("/agendas/").push();
          var a = agenda;
          agendaRef.child("name").set(agenda.properties.name).then(function() {
            firebase.database().ref("/permissions/").child(agendaRef.key).child($scope.currentUser.uid).set("editor").then(function() {
              var categories = {};
              var categoryList = [];
              var categoriesRef = firebase.database().ref("/categories/").child(agendaRef.key);
              var i = 0;
              for (var category of a.categories) {
                if (!category.deleted) {
                  var key = categoriesRef.push().key;
                  categories[key] = {};
                  if (category.name) {
                    categories[key].name = category.name;
                  }
                  if (category.color) {
                    categories[key].color = category.color;
                  }
                  categoryList[i] = key;
                  i++;
                }
              }
              categoriesRef.set(categories).then(function() {
                var tasks = {};
                var tasksRef = firebase.database().ref("/tasks/").child(agendaRef.key);
                for (var task of a.items) {
                  if (!task.deleted) {
                    var t = {};
                    for (var p of ["name", "deadlineTime", "repeat", "repeatEnds", "notes", "completed"]) {
                      if (task[p]) {
                        t[p] = task[p];
                      }
                    }
                    if (task.category !== undefined) {
                      t.category = categoryList[task.category];
                    }
                    if (task.deadline) {
                      t.deadline = (new Date(task.deadline)).toJSON();
                      console.log(task.deadline);
                      console.log(t.deadline);
                    }
                    tasks[tasksRef.push().key] = t;
                  }
                }
                tasksRef.set(tasks).then(function() {
                  $scope.agendasRef.child(agendaRef.key).set(true);
                });

                if (a.properties.schedule && !a.properties.schedule.deleted) {
                  var scheduleRef = firebase.database().ref("/schedules/").child(agendaRef.key);
                  var daysRef = scheduleRef.child("days");
                  var days = {};
                  var daysArray = [];
                  var i = 0;
                  for (var day of a.properties.schedule.block.days) {
                    var key = daysRef.push().key;
                    days[key] = day.name;
                    daysArray[i] = key;
                    i++;
                  }
                  daysRef.set(days).then(function() {
                    var blocksRef = scheduleRef.child("blocks");
                    var blocks = {};
                    var i = 0;
                    for (var block of a.properties.schedule.block.blocks) {
                      var b = {};
                      if (block.start !== undefined) {
                        b.time = block.start;
                      }
                      var j = 0;
                      for (var day of a.properties.schedule.block.days) {
                        if (day.categories[i] !== undefined) {
                          b[daysArray[j]] = categoryList[day.categories[i]];
                        }
                        j++;
                      }
                      blocks[blocksRef.push().key] = b;
                      i++;
                    }
                    blocksRef.set(blocks);

                    var pointsRef = scheduleRef.child("points");
                    var points = {};
                    for (var point of a.properties.schedule.block.points) {
                      points[pointsRef.push().key] = {
                        date: point.date,
                        type: (point.type == "none") ? "free" : daysArray[parseInt(point.type)]
                      };
                    }
                    pointsRef.set(points);
                  });
                }
              });
            });
          });
        })();
      }
      $scope.migrating = false;
      $scope.fullScreenModal = false;
    };
  })
  .controller("AgendaEditorController", function($scope, agenda, colors, $mdDialog, refresh, settings, $timeout) {
    $scope.settings = settings;
    $scope.today = new Date();
    $scope.init = function() {
      /*$scope.agenda = $agendaParser.getAgenda(agendaName);
      $scope.name = agendaName;

      $scope.schedule = $scope.agenda.raw.properties.schedule || {type: "block"};
      $scope.schedule.use = !!$scope.agenda.raw.properties.schedule && !$scope.agenda.raw.properties.schedule.deleted;
      if (!$scope.schedule.block) {
        $scope.schedule.block = {
          blocks: [],
          days: [],
          points: []
        };
      }
      $scope.scheduleModified = false;
      $scope.archived = $scope.agenda.raw.properties.archived;

      $scope.refresh();*/

      $scope.categories = {};
      $scope.categoryList = [];
      $scope.name = "";
      $scope.scheduleLoaded = false;
      $scope.scheduleExists = false;

      $scope.agendaRef = firebase.database().ref("/agendas/" + agenda);
      $scope.nameRef = $scope.agendaRef.child("name");
      $scope.permissionsRef = firebase.database().ref("/permissions/" + agenda);
      $scope.categoriesRef = firebase.database().ref("/categories/" + agenda);
      $scope.scheduleRef = firebase.database().ref("/schedules/" + agenda);

      $scope.nameRef.once("value").then(function(data) {
        $scope.originalName = data.val();
        $scope.name = data.val();
      });

      $scope.categoriesRef.on("child_added", function(data) {
        $scope.categories[data.key] = data.val();
        $timeout($scope.refresh);
      });

      $scope.categoriesRef.on("child_changed", function(data) {
        if ($scope.categories[data.key]) {
          $scope.categories[data.key] = data.val();
          $timeout($scope.refresh);
        }
      });

      $scope.categoriesRef.on("child_removed", function(data) {
        delete $scope.categories[data.key];
        $timeout($scope.refresh);
      });

      $scope.scheduleRef.once("value").then(function(data) {
        if (data.exists()) {
          $scope.schedule = data.val();
          $scope.schedule.use = true;
          $scope.scheduleExists = true;
        } else {
          $scope.schedule = {
            use: false,
            blocks: {},
            days: {},
            points: {}
          };
        }
        $timeout(function() {
          $scope.scheduleLoaded = true;
        });
      }).catch(function(e) {
        console.log(e);
      });
    };
    $scope.refresh = function() {
      $scope.categoryList = Object.keys($scope.categories);
    };
    $scope.colors = Object.keys(colors).map(function(input) {
      return {name: input, color: colors[input]};
    });
    $scope.deleteCategory = function(category) {
      delete $scope.categories[category];
      $scope.refresh();
    };
    $scope.addCategory = function() {
      $scope.categories[$scope.categoriesRef.push().key] = {
        name: "Category"
      }
      $scope.refresh();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.saveAndDismiss = function() {
      /*if ($scope.schedule.use) {
        delete $scope.schedule.use;
        if ($scope.schedule.deleted) {
          delete $scope.schedule.deleted;
        }
        $scope.agenda.raw.properties.schedule = $scope.schedule;
        if ($scope.scheduleModified) {
          $scope.agenda.raw.properties.schedule.modified = new Date();
        }
      } else if (!!$scope.agenda.raw.properties.schedule && !$scope.agenda.raw.properties.schedule.deleted) {
        $scope.agenda.raw.properties.schedule = {deleted: new Date()};
      }*/
      if ($scope.name && $scope.originalName != $scope.name) {
        $scope.nameRef.set($scope.name);
      }

      $scope.categoriesRef.set($scope.categories);

      if ($scope.scheduleDirty) {
        if ($scope.schedule.use) {
          var s = $scope.schedule;
          var r = $scope.scheduleRef;
          r.child("days").set(s.days).then(function() {
            r.child("blocks").set(s.blocks);
            r.child("points").set(s.points);
          });
        } else if ($scope.scheduleExists) {
          $scope.scheduleRef.remove();
        }
      }
      /*if ($scope.archived != $scope.agenda.raw.properties.archived) {
        $scope.agenda.raw.properties.archiveModified = new Date();
      }
      $scope.agenda.saveAgenda();*/
      $mdDialog.hide();
    };

    $scope.deleteAgenda = function(event) {
      $mdDialog.show($mdDialog.confirm().clickOutsideToClose(true).targetEvent(event)
        .title("Delete Agenda \"" + $scope.name + "\"?!")
        .textContent("You're about to delete " + $scope.name + ". This cannot be undone.")
        .cancel("Cancel")
        .ok("Delete")
      ).then(function() {
        $scope.permissionsRef.once("value").then(function(data) {
          for (var user of Object.keys(data.val())) {
            firebase.database().ref("/users/").child(user).child("agendas").child(agenda).remove();
          }

          $scope.agendaRef.remove();
          $scope.categoriesRef.remove();
          firebase.database().ref("/tasks/").child(agenda).remove();
          $scope.scheduleRef.remove();

          $scope.permissionsRef.remove();
        });
      });
    };

    $scope.setScheduleDirty = function(isDirty) {
      $scope.scheduleDirty = isDirty;
    }

    $scope.newBlock = function() {
      $scope.schedule.blocks[$scope.scheduleRef.child("blocks").push().key] = {};
      $scope.setScheduleDirty(true);
    };
    $scope.deleteBlock = function(index) {
      delete $scope.schedule.blocks[index];
      $scope.setScheduleDirty(true);
    };

    $scope.newDay = function() {
      $scope.schedule.days[$scope.scheduleRef.child("days").push().key] = "";
      $scope.setScheduleDirty(true);
    };
    $scope.deleteDay = function(index) {
      delete $scope.schedule.days[index];
      $scope.setScheduleDirty(true);
    };

    $scope.showPointCreation = function() {
      $scope.selectedPoint = {id: -1};
    };
    $scope.editPoint = function(point) {
      $scope.selectedPoint = {id: point, date: new Date($scope.schedule.points[point].date), type: $scope.schedule.points[point].type};
    }
    $scope.cancelPoint = function() {
      $scope.selectedPoint.id = undefined;
    };
    $scope.savePoint = function() {
      var point = {date: $scope.selectedPoint.date.toJSON(), type: $scope.selectedPoint.type};
      if ($scope.selectedPoint.id === -1) {
        $scope.schedule.points[$scope.scheduleRef.child("points").push().key] = point;
      } else {
        $scope.schedule.points[$scope.selectedPoint.id] = point;
      }
      $scope.selectedPoint.id = undefined;
      $scope.setScheduleDirty(true);
    };
    $scope.removePoint = function() {
      delete $scope.schedule.points[$scope.selectedPoint.id];
      $scope.selectedPoint.id = undefined;
      $scope.setScheduleDirty(true);
    };

    $scope.init();
  })
  .directive("scheduleCategoryChooser", function() { return {
    templateUrl: "category-chooser.html",
    scope: {
      value: "=ngModel",
      change: "&ngChange"
    },
    restrict: "E",
    transclude: true,
    controller: function($scope) {
      $scope.categories = [];
      this.addCategory = function(scope) {
        $scope.categories.push(scope);
      };
      $scope.selectOption = function(option, value) {
        $scope.option = option;
        $scope.value = value;
      };
      $scope.$watch("categories.length", function() {
        for (var i = 0; i < $scope.categories.length; i++) {
          if ($scope.categories[i].value === $scope.value) {
            $scope.option = i;
            break;
          }
        }
      });
      $scope.$watch("value", function() {
        $scope.change();
      });
    }
  }})
  .directive("scheduleCategoryOption", function() { return {
    template: "",
    transclude: false,
    restrict: "E",
    scope: {
      value: "=value",
      name: "@name",
      color: "@color",
      disabled: "=disabled"
    },
    require: "^^scheduleCategoryChooser",
    link: function(scope, element, attrs, chooser) {
      chooser.addCategory(scope);
    }
  }})
  .directive("controlPoint", function() { return {
    template: "<div layout='column' layout-align='center center'><md-icon md-colors=\"{background: '{{color}}'}\">{{icon}}</md-icon><div ng-transclude></div></div>",
    transclude: true,
    restrict: "E",
    scope: {
      icon: "@icon",
      selected: "=selected"
    },
    controller: function($scope) {
      $scope.color = "primary";
      $scope.$watch("selected", function() {
        $scope.color = $scope.selected ? "blue" : "primary";
      });
    }
  }})
  .directive("timePicker", function() { return {
    template: "<md-input-container md-no-float md-is-error='error'><input ng-model='input' ng-change='updateValue()' type='text' /></md-input-container>",
    transclude: false,
    restrict: "E",
    scope: {
      use24Hours: "=use24Hours",
      value: "=ngModel"
    },
    controller: function($scope) {
      $scope.error = false;
      $scope.$watch("value", function() {
        var value = $scope.value;
        if (!isNaN(value)) {
          var hour = Math.floor(value / 60);
          var minute = value - (hour * 60);
          var minuteStr = (minute < 10) ? ("0" + minute) : minute;
          if ($scope.use24Hours) {
            $scope.input = hour + ":" + minuteStr;
          } else {
            var pm = (hour >= 12);
            var hr = hour - (pm ? 12 : 0);
            $scope.input = ((hr <= 0) ? 12 : hr) + ":" + minuteStr + (pm ? "pm" : "am");
          }
        } else {
          $scope.input = "";
        }
      });
      $scope.updateValue = function() {
        if ($scope.input === "") {
          $scope.error = false;
          $scope.value = undefined;
        } else {
          var results = /^ *0*([12]?[0123456789]) *: *([012345][0123456789]) *(am|pm)? *$/i.exec($scope.input);
          if (results && (results.length >= 3) && (results.length <= 4)) {
            var hour = parseInt(results[1]);
            var minute = parseInt(results[2]);
            if (!results[3]) {
              $scope.error = (hour >= 24);
              if (hour < 24) {
                $scope.value = hour * 60 + minute;
              }
            } else {
              if (hour <= 12) {
                hour = (hour == 12) ? 0 : hour;
                hour = (results[3].toLowerCase() == "pm") ? (hour + 12) : hour;
                $scope.error = false;
                $scope.value = hour * 60 + minute;
              } else {
                $scope.error = true;
              }
            }
          } else {
            $scope.error = true;
          }
        }
      };
    }
  }})
  .directive("wallpaperPicker", function() { return {
    templateUrl: "wallpaper-picker.html",
    transclude: false,
    restrict: "E",
    scope: {
      value: "=ngModel"
    },
    controller: function($scope, wallpapers) {
      $scope.wallpapers = wallpapers;
      $scope.value = $scope.value || {id: "amazon-rainforest", url: ""};
    }
  }})
  .controller("AgendasSettingsController", function($scope, $mdDialog) {
    $scope.settings = JSON.parse(localStorage.getItem("agendas-settings") || "{}");
    $scope.cancel = $mdDialog.cancel;
    $scope.saveAndDismiss = function() {
      localStorage.setItem("agendas-settings", JSON.stringify($scope.settings));
      $mdDialog.hide();
    }
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
  .filter("toDateString", function() { return function(input) {
    return (new Date(input)).toDateString();
  }})
  .filter("timeFilter", function() { return function(input) {
    if (input) {
      var date = new Date(input);
      return ((date.getHours() % 12 == 0) ? 12 : (date.getHours() % 12)) + ":" + ((date.getMinutes() < 10) ? ("0" + date.getMinutes()) : date.getMinutes()) + ((date.getHours() / 12 >= 1) ? "pm" : "am");
    } else {
      return "";
    }
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
  .filter("pointTypeFilter", function() { return function(input, days) {
    return input == "free" ? "Free day" : days[input];
  }})
  .value("quickAddSamples", [
    "Do work today",
    "Rent instrument by Saturday",
    "Work on essay for English",
    "Cook today for Family",
    "Meow"
  ]);
