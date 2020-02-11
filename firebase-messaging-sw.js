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
  measurementId: "G-8XWZPKNT76"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  const notificationTitle = "WeedMath";
  const notificationOptions = payload.data;
  //console.log("popUp: ", notificationOptions);

  return this.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
