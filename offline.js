if (navigator.serviceWorker) {
  console.log("Registering service worker...");
  navigator.serviceWorker.register("service-worker.js").then(function() {
    console.log("Service worker registration complete.");
  }).catch(function(e) {
    console.log(e);
  });
} else {
  console.log("Service workers are not supported.");
}
