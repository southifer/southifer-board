// Import the functions you need from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDx08qsU5hHKvbtR5uTk6yJ1cTnYX83fvM",
  authDomain: "noir-e.firebaseapp.com",
  projectId: "noir-e",
  storageBucket: "noir-e.appspot.com",
  messagingSenderId: "130664010649",
  appId: "1:130664010649:web:182091dfb3a1720ed1b908",
  measurementId: "G-TCCR8559GV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Cloud Messaging and request permission
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");

      // Get registration token
      const token = await getToken(messaging, { vapidKey: "BAKh2d_4cxhXex-dbk5cDvnSVuPBkQ9yUilV8TdGYHXCooHSF-yWc17tzBGEgFN5cfASq1R9_Y9bjuza7j7imIY" });
      console.log("FCM Token:", token);

      // Send this token to your server for sending notifications
    } else {
      console.log("Unable to get permission to notify.");
    }
  } catch (error) {
    console.error("Error getting permission for notifications", error);
  }
};

// Handle incoming messages when the app is in the foreground
onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  new Notification(notificationTitle, notificationOptions);
});
