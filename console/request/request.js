angular.module("agendasApp")
  .component("consoleRequest", {
    templateUrl: "console/request/request.html",
    bindings: {
      type: "@",
      app: "="
    },
    controller: function($scope, $rootScope, $mdDialog) {
      var emails = $rootScope.user.providerData.map(function(data) {
        return data.email;
      });
      $scope.emails = [];
      emails.forEach(function(email) {
        if (!$scope.emails.includes(email)) {
          $scope.emails.push(email);
        }
      });

      this.cancel = $mdDialog.cancel;
      this.request = function(email, amount, reason) {
        if (this.type === "maxapps") {

        } else {
          $scope.saving = true;
          firebase.database().ref("/apps/" + this.app + "/request").set({
            email: email,
            amount: parseInt(amount),
            reason: reason
          }).then(function() {
            $mdDialog.hide();
          }).catch(function() {
            $scope.saving = false;
            $scope.$digest();
          });
        }
      };
    }
  })
