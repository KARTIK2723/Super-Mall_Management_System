
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaa8lyNfFAZatQgWaouK1hMvpqmFDe8YI",
  authDomain: "supermall-project-c6423.firebaseapp.com",
  projectId: "supermall-project-c6423",
  storageBucket: "supermall-project-c6423.firebasestorage.app",
  messagingSenderId: "818913076919",
  appId: "1:818913076919:web:1e991b359d4974cc880f32",
  measurementId: "G-WR78TP2C0C"
};

firebase.initializeApp(firebaseConfig);

// Services
const auth = firebase.auth();
const db = firebase.firestore();