importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyC8UHmnpf_yo2tXMBHk-897lL-VnX8pVTk",
    authDomain: "attention-b923d.firebaseapp.com",
    databaseURL: "https://attention-b923d.firebaseio.com",
    projectId: "attention-b923d",
    storageBucket: "attention-b923d.appspot.com",
    messagingSenderId: "357995852275",
    appId: "1:357995852275:web:9c144fd2517203d05f2286",
    measurementId: "G-HKFYEMRZ9S"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = { body: payload.notification.body };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
