// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  // Your Firebase configuration object, same as in firebase.js
  apiKey: "AIzaSyBDLFsNGNZJFOOoYWjWoyxToPrAWXTvgOw",
  authDomain: "messanger-4cf18.firebaseapp.com",
  projectId: "messanger-4cf18",
  storageBucket: "messanger-4cf18.firebasestorage.app",
  messagingSenderId: "63404196071",
  appId: "1:63404196071:web:826101d58502917ff9e242",
  measurementId: "G-C726CP6XZF",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
