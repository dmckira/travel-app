import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCiM5vsGxlTvZaDJ2dMp1rNh_luX7WNjTc",
  authDomain: "travel-app-bd-47b61.firebaseapp.com",
  projectId: "travel-app-bd-47b61",
  storageBucket: "travel-app-bd-47b61.appspot.com",
  messagingSenderId: "451825058512",
  appId: "1:451825058512:web:e152759bc8d3c44e0514d5"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };