import React from "react";
import ReactDOM from "react-dom";
import Login from "./login.js";
//import * as _firebase from "./_firebase";
//import * as _auth from "./_auth";
import $ from "jquery";
import firebase from "firebase/app";
require("firebase/auth");

var config = {
  apiKey: "AIzaSyD9CxsZAUXhInzTfJF4Ptq8eTChZKKCNmY",
  authDomain: "weedmath-app.firebaseapp.com",
  databaseURL: "https://weedmath-app.firebaseio.com",
  projectId: "weedmath-app",
  storageBucket: "weedmath-app.appspot.com",
  messagingSenderId: "823057714829",
  appId: "1:823057714829:web:5b91f8e487d322917edcc4",
  measurementId: "G-8XWZPKNT76"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }

  render() {
    return (
      <div className="App">
        <Login />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

function init() {
  //set displayName in "auth.js" to link topic name that sender
  //change the import "./_auth" to "./auth" in order to commit change on login
  //change the import back to "./_auth" after linking user with topic
  //_firebase.init();
  //_auth.init();
}

firebase.auth().onAuthStateChanged(function(user) {
  const loginStatus = document.getElementById("login-status");
  if (user) {
    loginStatus.textContent = "logged in";
    $("#logout-btn").show();
    $("#login-btn").hide();
    $("#root").hide();
    $("#base").show();
  } else {
    loginStatus.textContent = "logged out";
    $("#logout-btn").hide();
    $("#login-btn").show();
    $("#root").show();
    $("#base").hide();
  }
});

document.getElementById("login-btn").addEventListener("click", function() {
  handleSignIn();
});
document.getElementById("logout-btn").addEventListener("click", function() {
  handleSignOut();
});

function handleSignIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function() {})
    .catch(function(error) {
      //const errorCode = error.code;
      //const errorMessage = error.message;
      //console.log(errorCode);
      //console.log(errorMessage);
    });
}

function handleSignOut() {
  firebase
    .auth()
    .signOut()
    .then(function() {})
    .catch(function(error) {
      //console.log(error);
    });
}

document.addEventListener("load", init(), false);

const serverKey =
  "AAAAv6IQDo0:APA91bEsoY4-9GIlEjPPlp8yKHaKECf5vl3DFM5WOp4BgUVT-2LfiuKZNwLq7hAsCB3V1e4x-D0sZXyj8yA8Kkn7cwZXZQ95kYnPYm6459d34RPIydWYL3c14EmJ6pS9atirnjS0AM3w";

document.getElementById("send").addEventListener("click", function(e) {
  if (window.confirm("Are you ready to send the message?")) {
    sendPushMessage();
  } else {
    e.preventDefault();
  }
});

function sendPushMessage() {
  var msgTitle = document.getElementById("msgTitle").value;
  var msgL1 = document.getElementById("msgL1").value;
  var msgL2 = document.getElementById("msgL2").value;
  var msgL3 = document.getElementById("msgL3").value;

  var scope = firebase.auth().currentUser.displayName;
  const topic = scope;
  const to = "/topics/" + topic;
  //console.log("[DBG] Topic sent to:", to);
  console.log("[DBG] Click action:", "https://weedmath.app/" + topic);

  const msgBody = [msgL1, msgL2, msgL3].filter(Boolean).join("\n");

  let notification = {
    title: msgTitle,
    body: msgBody,
    click_action: "https://weedmath.app/" + topic,
    icon: "/images/36x36.png"
  };

  fetch("---https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: new Headers({
      Authorization: "key=" + serverKey,
      "Content-Type": "application/json",
      "Content-Length": "0"
    }),
    body: JSON.stringify({ notification, to })
  })
    .then(response => {
      if (response.status < 200 || response.status >= 400) {
        console.log(
          "Error Sending Message: " + response.status + " - " + response.text()
        );
        window.alert(
          "Message Error: " + response.status + " - " + response.text()
        );
      }
      console.log("[FCM] Message Sent");
      window.alert("Message Sent to Subscribers for: " + topic);
    })
    .catch(error => {
      console.error("[FCM] Network Error: ", error);
      window.alert("Network Error: " + error);
    });
}
