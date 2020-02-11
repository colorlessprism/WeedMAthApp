import $ from "jquery";
const firebase = require("firebase/app");
require("firebase/auth");

//change topicName to link sender to topic
const topicName = "push";

export function init() {
  firebase.auth().onAuthStateChanged(function(user) {
    const loginStatus = document.getElementById("login-status");
    if (user) {
      loginStatus.textContent = "logged in";
      $("#root").hide();
      $("#base").show();
      displayName();
      handleSignOut();
    } else {
      loginStatus.textContent = "logged out";
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
}

function handleSignIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function() {
      console.log("Name Changed To:", firebase.auth().currentUser.displayName);
    })
    .catch(function(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
}

function handleSignOut() {
  firebase
    .auth()
    .signOut()
    .then(function() {})
    .catch(function(error) {
      console.log(error);
    });
}

function displayName() {
  firebase.auth().currentUser.updateProfile({
    displayName: topicName
  });
}
