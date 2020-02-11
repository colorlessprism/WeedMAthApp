import $ from "jquery";
const firebase = require("firebase/app");
require("firebase/messaging");

var firebaseConfig = {
  apiKey: "AIzaSyD9CxsZAUXhInzTfJF4Ptq8eTChZKKCNmY",
  authDomain: "weedmath-app.firebaseapp.com",
  databaseURL: "https://weedmath-app.firebaseio.com",
  projectId: "weedmath-app",
  storageBucket: "weedmath-app.appspot.com",
  messagingSenderId: "823057714829",
  appId: "1:823057714829:web:5b91f8e487d322917edcc4",
  measurementId: "G-8XWZPKNT76",
  serverKey:
    "AAAAv6IQDo0:APA91bEsoY4-9GIlEjPPlp8yKHaKECf5vl3DFM5WOp4BgUVT-2LfiuKZNwLq7hAsCB3V1e4x-D0sZXyj8yA8Kkn7cwZXZQ95kYnPYm6459d34RPIydWYL3c14EmJ6pS9atirnjS0AM3w"
};

var scope = window.location.pathname.split("/index")[0];
scope = scope.split("/")[1];
const topic = scope;

//console.log("[DBG] Topic used:", topic);

if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker
    .register("./firebase-messaging-sw.js", {
      scope: "./firebase-cloud-messaging-push-scope"
    })
    .then(function(registration) {
      if ("undefined" !== typeof messaging.b) delete messaging.b;
      firebase.messaging().useServiceWorker(registration);
      //console.log("[FCM] Registered w/Scope:", registration.scope);
    })
    .catch(function(error) {
      console.error("[FCM] SW Error:", error);
    });
} else {
  console.log("[FCM] Push Not Supported");
  $("#messages").hide();
  updateUIForPushNotSupported();
}

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.usePublicVapidKey(
  "BBOoJz4pXBArLEq91Kh57DKKSTwT3Fsd9dYwjbscw0-zAFsJ2qnZLwnqrgc8PJH-2Kde_hsSKVGsSMMDble6oig"
);

function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    console.log("[FCM] New Token:", currentToken);
    setTokenSentToServer(true);
  } else {
    console.log("[FCM] Active Token:", currentToken);
  }
}

messaging.onTokenRefresh(() => {
  messaging
    .getToken()
    .then(refreshedToken => {
      //console.log("[FCM] Token refreshed");
      setTokenSentToServer(false);
      sendTokenToServer(refreshedToken);
      subscribeTokenToTopic(refreshedToken, topic);
      resetUI();
    })
    .catch(err => {
      console.log("[FCM] Unable to retrieve refreshed token:", err);
    });
});

messaging.onMessage(payload => {
  appendMessage(payload);
  //console.log(payload);
});

function appendMessage(payload) {
  clearMessages();
  $("#messages").show();
  const messagesElement = document.querySelector("#messages");
  const dataElement = document.createElement("pre");
  const bodyElement = document.createElement("pre");
  dataElement.textContent = payload.notification.title;
  bodyElement.textContent = payload.notification.body;
  messagesElement.appendChild(dataElement);
  messagesElement.appendChild(bodyElement);
}

function clearMessages() {
  const messagesElement = document.querySelector("#messages");
  while (messagesElement.hasChildNodes()) {
    messagesElement.removeChild(messagesElement.lastChild);
  }
  $("#messages").hide();
}

function clearUI() {
  clearMessages();
  updateUIForPushPermissionRequired();
  setTokenSentToServer(false);
}

function resetUI() {
  // clearMessages();
  messaging
    .getToken()
    .then(currentToken => {
      if (currentToken) {
        sendTokenToServer(currentToken);
        updateUIForPushEnabled(currentToken);
        subscribeTokenToTopic(currentToken, topic);
      } else {
        //console.log("[FCM] No Token. Request permission to generate one");
        updateUIForPushPermissionRequired();
        setTokenSentToServer(false);
      }
    })
    .catch(err => {
      console.log("[FCM] Error Retrieving Token:", err);
      updateUIForPushNotSupported();
      setTokenSentToServer(false);
    });
}

function isTokenSentToServer() {
  return window.localStorage.getItem("sentToServer") === "1";
}

function setTokenSentToServer(sent) {
  window.localStorage.setItem("sentToServer", sent ? "1" : "0");
}

const askPermission = document.getElementById("requestPermission");
askPermission.addEventListener(
  "click",
  function() {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        //console.log("[FCM] Notifications Granted");
        resetUI();
      } else {
        updateUIForPushNotSupported();
        console.log("[FCM] Notifications Unavailable");
      }
    });
  },
  false
);

const removeToken = document.getElementById("deleteToken");
removeToken.addEventListener(
  "click",
  function() {
    messaging
      .getToken()
      .then(currentToken => {
        messaging
          .deleteToken(currentToken)
          .then(() => {
            //console.log("[FCM] Token Deleted");
            setTokenSentToServer(false);
            clearUI();
          })
          .catch(err => {
            console.log("[FCM] Error Removing Token:", err);
          });
      })
      .catch(err => {
        console.log("[FCM] Error Getting Token:", err);
      });
  },
  false
);

function updateUIForPushEnabled(currentToken) {
  $("#token_div").show();
  $("#permission_div").hide();
}

function updateUIForPushPermissionRequired() {
  $("#token_div").hide();
  $("#permission_div").show();
}

function updateUIForPushNotSupported() {
  $("#token_div").hide();
  $("#permission_div").hide();
}

function subscribeTokenToTopic(currentToken, topic) {
  fetch(
    "https://iid.googleapis.com/iid/v1/" +
      currentToken +
      "/rel/topics/" +
      topic,
    {
      method: "POST",
      headers: new Headers({
        Authorization: "key=" + firebaseConfig.serverKey,
        "Content-Type": "application/json",
        "Content-Length": "0"
      })
    }
  )
    .then(response => {
      if (response.status < 200 || response.status >= 400) {
        console.log(
          "[FCM] Error subscribing: " +
            response.status +
            " - " +
            response.text()
        );
      }
      //console.log('[FCM] Topic subscription: "' + topic + '"');
    })
    .catch(error => {
      console.error("[FCM] Topic Error:", error);
    });
}

resetUI();
