angular.module("agendasApp")
  .component("consoleSidenav", {
    templateUrl: "console/sidenav/sidenav.html",
    controller: function($scope, $rootScope, $timeout) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          if ($rootScope.developerAppsRef) {
            $rootScope.developerAppsRef.off();
          }
          $rootScope.developerApps = [];
          $rootScope.developerAppsRef = firebase.database().ref("/users/" + user.uid + "/createdApps");
          $rootScope.developerAppsRef.on("child_added", function(data) {
            var app = {key: data.key, ref: firebase.database().ref("/apps/" + data.key + "/name")};
            app.ref.on("value", function(appData) {
              console.log(appData.val());
              app.name = appData.val();
              $timeout();
            });
            console.log(app.key);
            $rootScope.developerApps.push(app);
          });
          $rootScope.developerAppsRef.on("child_removed", function(data) {
            var i = 0;
            for (var app of $rootScope.developerApps) {
              if (app.key === data.key) {
                app.ref.off();
                app.ref = null;
                $rootScope.developerApps.splice(i, 1);
                $timeout();
                break;
              }
              i++;
            }
          });
        } else {
          $rootScope.developerApps = [];
        }
      });
    }
  })
