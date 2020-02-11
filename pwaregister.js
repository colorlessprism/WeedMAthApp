if ("serviceWorker" in navigator) {
  if (navigator.serviceWorker.controller) {
    //console.log("[PWA] Active SW, no need to register");
  } else {
    navigator.serviceWorker
      .register("pwabuilder-sw.js", {
        scope: "./"
      })
      .then(function(reg) {
        //console.log("[PWA] SW Registered on scope: " + reg.scope);
      });
  }
}
