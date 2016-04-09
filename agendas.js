angular.module("agendasApp", ["ngMaterial", "ngMessages"])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme("default").primaryPalette("green").accentPalette("orange").warnPalette("red");
  })
  .controller("AgendasController", function($scope, $agendaParser, $googleDrive) {

    // Establish a connection to Google Drive.
    var CLIENT_ID = "Why should you know my Client ID?";
    var SCOPES    = ["https://www.googleapis.com/auth/drive.appfolder", "https://www.googleapis.com/auth/drive.metadata.readonly"];

    var scope = $scope;

    function handleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        scope.$apply(function($scope) {
          $scope.isAuthenticated = 1;
        });
        // loadDriveApi()
      } else {
        scope.$apply(function($scope) {
          $scope.isAuthenticated = 0;
        });
      }
    }

    $scope.isAuthenticated = 2;
    $scope.checkAuth = function() {
      $googleDrive.checkAuth(CLIENT_ID, SCOPES, handleAuthResult);
    };
    $scope.authorize = function() {
      $googleDrive.authorize(CLIENT_ID, SCOPES, handleAuthResult);
    };

  })
  .controller("AgendasUIController", function($scope, $agendaParser, $googleDrive, $mdSidenav, $controller, $mdDialog) {
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
      $scope.agendaList = $agendaParser.listAgendas();
    };
    $scope.refresh();

    $scope.$watch("isAuthenticated", function() {
      ($scope.isAuthenticated == 0) ? $scope.showGoogleDriveDialog() : "";
    });
  })
  .factory("$agendaParser", function() {
    var agendaParser = {};

    function Agenda(agenda) {
      this.raw = agenda;
    }

    Agenda.prototype = {
      tasks: function() {
        return this.raw.items.slice();
      },
      categories: function() {
        return this.raw.categories.slice();
      },
      name: function() {
        return this.raw.properties.name;
      },
      dates: function() {
        var dates = {};
        for (item of [["modified", "dateModified"], ["created", "dateCreated"]]) {
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
        if (category) {
          task.category = category;
        }
        task.dateCreated = new Date();
        this.raw.items.push(task);
        this.modified();
        return task;
      },

      getTask: function(id) {
        if (this.taskExists(id)) {
          var task = this.raw.items[id];
          task.dateCreated = (typeof task.dateCreated != "date") ? new Date(task.dateCreated) : task.dateCreated;
          return task;
        }
      },

      deleteTask: function(id) {
        if (this.taskExists(id)) {
          this.raw.items[id] = {deleted: new Date()};
        }
      },

      saveAgenda: function() {
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
      if (list.includes(agendaName)) {
        return false;
      }

      localStorage.setItem(agendaParser.agendaKey(agendaName), JSON.stringify(agendaParser.emptyAgenda(agendaName).raw));

      list.push(agendaName);
      localStorage.setItem("agendas", JSON.stringify(list));
      return true;
    };

    agendaParser.parseAgenda = function(agendaJSON) {
      var agenda = {};
      try {
        agenda = JSON.parse(agendaJSON);
      } catch (jsonError) {
        return {error: "Agenda " + agendaName + " is invalid."};
      }

      return new Agenda(agenda);
    };

    agendaParser.getAgenda = function(agendaName) {
      var list = agendaParser.listAgendas();
      if (!list.includes(agendaName)) {
        return {error: "Agenda " + agendaName + " does not exist"};
      }

      var agendaJSON = localStorage.getItem(agendaParser.agendaKey(agendaName));
      if (!agendaJSON) {
        return {error: "Agenda " + agendaName + " is corrupted."};
      }

      return agendaParser.parseAgenda(agendaJSON);
    };

    return agendaParser;
  })
  .factory("$googleDrive", function() {
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
      }
    };
  })
