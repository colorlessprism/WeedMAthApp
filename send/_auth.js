import $ from "jquery";
const firebase = require("firebase/app");
require("firebase/auth");

export function init() {
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
}

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
