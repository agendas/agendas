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
  .controller("AgendasUIController", function($scope, $googleDrive, $mdSidenav, $controller, $mdDialog) {
    angular.extend(this, $controller("AgendasController", {$scope: $scope}));
    $scope.toggleSidenav = function(sidenav) {
      return $mdSidenav(sidenav).toggle();
    };
    $scope.showGoogleDriveDialog = function() {
      $mdDialog.show($mdDialog.confirm().parent(angular.element(document.querySelector("body"))).clickOutsideToClose(true)
        .title('Use Google Drive')
        .textContent("Connect to Google Drive to sync and share your agendas.")
        .cancel("Remind me later").ok('Connect to Drive')
      ).then(function() {
        $scope.authorize();
      });
    };
    $scope.$watch("isAuthenticated", function() {
      ($scope.isAuthenticated == 0) ? $scope.showGoogleDriveDialog() : "";
    });
  })
  .factory("$agendaParser", function() {
    var agendaParser = {};

    agendaParser.listAgendas = function() {
      var list = localStorage.getItem("agendas");
      return list ? JSON.parse(list) : [];
    };

    agendaParser.emptyAgenda = function(agendaName) { return {
      properties: {
        name: agendaName,
        dateModified: new Date(),
        dateCreated: new Date()
      },
      categories: [],
      items: []
    }};

    agendaParser.agendaKey = function(agendaName) {
      return "agendas_" + agendaName;
    }

    agendaParser.addAgenda = function(agendaName) {
      var list = agendaParser.listAgendas();
      if (list.includes(agendaName)) {
        return false;
      }

      localStorage.setItem(agendaParser.agendaKey(agendaName), JSON.stringify(agendaParser.emptyAgenda()));

      list.push(agendaName);
      localStorage.setItem("agendas", JSON.stringify(list));
      return true;
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

      var agenda = {};
      try {
        agenda = JSON.parse(agendaJSON);
      } catch (jsonError) {
        return {error: "Agenda " + agendaName + " is invalid."};
      }

      agenda.properties.dateModified = new Date(agenda.properties.dateModified);
      agenda.properties.dateCreated  = new Date(agenda.properties.dateCreated);

      return agenda;
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
