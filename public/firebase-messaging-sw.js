importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyBL-237uZVTkJwyCxBo29Vy09ASkiupj-4",
  authDomain: "studentprojectrepo.firebaseapp.com",
  projectId: "studentprojectrepo",
  storageBucket: "studentprojectrepo.appspot.com",
  messagingSenderId: "1091320260631",
  appId: "1:1091320260631:web:7e4828c44c17c2257b1452",
  measurementId: "G-W0FVWXSY3E"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);

  // Call a function to handle the notification
  handleBackgroundMessage(payload);
});

function handleBackgroundMessage(payload) {
  const notificationTitle = payload.notification.title;
  const notificationBody = payload.notification.body;
  const notificationImage = payload.notification.image;

  const notificationOptions = {
    body: notificationBody,
    icon: notificationImage ? atob(notificationImage) : null,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}
