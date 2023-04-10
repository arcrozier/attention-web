import { initializeApp } from "firebase/app";
import firebase from "firebase/compat";
import MessagePayload = firebase.messaging.MessagePayload;
import NextFn = firebase.NextFn;
import Observer = firebase.Observer;

const key = "BD_lSto79pwcXtKhH2BCtvf_KMpm3ut6C1ifTIozgLH054fJigE33tR-fqLHRCm13Oms1BYW9coUpqR3Ca5olxk"

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

// See: https://github.com/microsoft/TypeScript/issues/14877
/** @type {ServiceWorkerGlobalScope} */
let self: ServiceWorkerGlobalScope;

function initInSw() {
    // [START messaging_init_in_sw]

    const { initializeApp } = require("firebase/app");
    const { getMessaging } = require("firebase/messaging/sw");

    const firebaseApp = initializeApp({
        apiKey: "AIzaSyC8UHmnpf_yo2tXMBHk-897lL-VnX8pVTk",
        authDomain: "attention-b923d.firebaseapp.com",
        databaseURL: "https://attention-b923d.firebaseio.com",
        projectId: "attention-b923d",
        storageBucket: "attention-b923d.appspot.com",
        messagingSenderId: "357995852275",
        appId: "1:357995852275:web:9c144fd2517203d05f2286",
        measurementId: "G-HKFYEMRZ9S"
    })

    // Retrieve an instance of Firebase Messaging so that it can handle background
    // messages.
    const messaging = getMessaging(firebaseApp);
    // [END messaging_init_in_sw]
}

function onBackgroundMessage() {
    // [START messaging_on_background_message]
    const { getMessaging } = require("firebase/messaging/sw");
    const { onBackgroundMessage } = require("firebase/messaging/sw");

    const messaging = getMessaging();
    onBackgroundMessage(messaging, (payload: NextFn<MessagePayload> | Observer<MessagePayload>) => {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notification here
        const notificationTitle = 'Background Message Title';
        const notificationOptions = {
            body: 'Background Message body.',
            icon: '/firebase-logo.png'
        };

        self.registration.showNotification(notificationTitle,
            notificationOptions);
    });
    // [END messaging_on_background_message]
}