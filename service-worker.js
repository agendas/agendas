var version = 'v3.3::';

self.addEventListener("install", function(event) {
  console.log("WORKER: Installing service worker...");
  event.waitUntil(
    caches.open(version + "agendas").then(function(cache) {
      var directories = [
        "add-provider",
        "agenda",
        "agenda-settings",
        "app-dialog",
        "auth",
        "console/add",
        "console/dashboard",
        "console/detail",
        "console/request",
        "console/sidenav",
        "creator",
        "editor",
        "filter",
        "home",
        "provider-dialog",
        "settings",
        "setup-dialog",
        "sidenav",
        "tag-color-picker",
        "tags",
        "toolbar",
        "username",
        "wallpaper"
      ];
      var files = [
        "",
        "agenda/completed.html",
        "agenda/notes.html",
        "timepicker/timepicker.js",
        "agendas.js",
        "agendas.svg",
        "auth-providers.js",
        "colors.js",
        "credits.js",
        "index.html",
        "lib/angular-material.min.css",
        "style.css",
        "utils.js",
        "wallpapers.js"
      ];
      var libraries = [
        "angular-animate.min",
        "angular-aria.min",
        "angular-marked.min",
        "angular-material.min",
        "angular-messages.min",
        "angular-ui-router.min",
        "angular.min",
        "chrono.min",
        "firebase-firestore",
        "firebase",
        "marked"
      ];
      directories.forEach(function(directory) {
        var components = directory.split("/");
        files.push(directory + "/" + components[components.length - 1] + ".html");
        files.push(directory + "/" + components[components.length - 1] + ".js");
      });
      libraries.forEach(function(library) {
        files.push("lib/" + library + ".js");
      });
      console.log(files);
      return cache.addAll(files.map(function(file) {
        return "/" + file;
      }));
    })
  );
});

self.addEventListener("fetch", function(event) {
  //console.log("WORKER: Processing fetch event...");
  if (event.request.method !== "GET") {
    console.log("WORKER: Fetch request ignored.");
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      var networked = fetch(event.request).then(function(response) {
        var cacheCopy = response.clone();
        //console.log("WORKER: Got response from network");
        caches.open(version + "agendas").then(function(cache) {
          cache.put(event.request, cacheCopy);
        }).then(function() {
          //console.log("WORKER: Fetch response stored in cache.");
        });
        return response;
      }).catch(function(e) {
        //console.log("WORKER: Fetch request failed: ", e);
        return new Response("<h1>Agendas in unavailable right now</h1><p>Try connecting to the Internet.</p>", {
          status: 503,
          statusText: "Service Unavailable",
          headers: new Headers({
            "Content-Type": "text/html"
          })
        })
      });

      return cached || networked;
    })
  );
});

self.addEventListener("activate", function(event) {
  console.log("WORKER: Activating service worker...");
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(key) {
        return !key.startsWith(version);
      }).map(function(key) {
        return caches.delete(key);
      }))
    }).then(function() {
      console.log("WORKER: Activate finished.")
    })
  );
});
