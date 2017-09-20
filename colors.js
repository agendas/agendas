angular.module("agendasApp")
  .factory("colors", function() {
    var colors = [
      {name: "red", primary: true, accent: true},
      {name: "pink", primary: true, accent: true},
      {name: "purple", primary: true, accent: true},
      {name: "deep-purple", primary: true, accent: true},
      {name: "indigo", primary: true, accent: true},
      {name: "blue", primary: true, accent: true},
      {name: "light-blue", primary: true, accent: true},
      {name: "cyan", primary: true, accent: true},
      {name: "teal", primary: true, accent: true},
      {name: "green", primary: true, accent: true},
      {name: "light-green", primary: true, accent: true},
      {name: "lime", primary: true, accent: true},
      {name: "yellow", primary: true, accent: true},
      {name: "amber", primary: true, accent: true},
      {name: "orange", primary: true, accent: true},
      {name: "deep-orange", primary: true, accent: true},
      {name: "brown", primary: true},
      {name: "grey", primary: true},
      {name: "blue-grey", primary: true},
      {name: "black", mdColor: "grey-900"}
    ];

    var primaryModifiers = ["50", "100", "200", "300", "400", "600", "700", "800", "900"];
    var accentModifiers  = ["A100", "A200", "A400", "A700"];

    var result = [];

    colors.forEach(function(color) {
      var colorGroup = [color];
      if (color.primary) {
        primaryModifiers.forEach(function(modifier) {
          colorGroup.push({name: color.name + "-" + modifier});
        });
      }
      if (color.accent) {
        accentModifiers.forEach(function(modifier) {
          colorGroup.push({name: color.name + "-" + modifier});
        });
      }
      result.push(colorGroup);
    });

    return result;
  })
