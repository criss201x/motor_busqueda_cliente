import firebase from 'firebase/app'
import 'firebase/database';
import 'firebase/analytics';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAaG90RsbLZ95LmmeWhDutBre_O9ZraX8s",
    authDomain: "horarios-y-espacios-fact-tecno.firebaseapp.com",
    databaseURL: "https://horarios-y-espacios-fact-tecno.firebaseio.com",
    projectId: "horarios-y-espacios-fact-tecno",
    storageBucket: "horarios-y-espacios-fact-tecno.appspot.com",
    messagingSenderId: "851789126039",
    appId: "1:851789126039:web:9594060ded8de271",
    measurementId: "G-DWSR3MC0X1"
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);
export const db = firebase.database().ref("/");

firebase.analytics.isSupported().then((isSupported) => {
    if (isSupported) {
        const analytics = firebase.analytics();
    }
})