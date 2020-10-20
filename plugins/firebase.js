import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

export default (context, inject) => {
  let fireApp;
  if (!firebase.apps.length) {
    const firebaseConfig = {
      apiKey: "AIzaSyB4bj3vp4TIrJCdUrWgcZnSh8A2cQ-yD7Y",
      authDomain: "gabriel-cdb36.firebaseapp.com",
      databaseURL: "https://gabriel-cdb36.firebaseio.com",
      projectId: "gabriel-cdb36",
      storageBucket: "gabriel-cdb36.appspot.com",
      messagingSenderId: "79894115017",
      appId: "1:79894115017:web:7f53435715f68a22619318"
    };
    fireApp = firebase.initializeApp(firebaseConfig);
  } else {
    fireApp = firebase.app();
  }
  inject("fireApp", fireApp);
}
