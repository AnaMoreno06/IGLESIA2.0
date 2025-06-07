// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyDsLOgpAcsANPHwiJ6IJwGy528eZMAQNPA",
  authDomain: "iglesia-52bb6.firebaseapp.com",
  projectId: "iglesia-52bb6",
  storageBucket: "iglesia-52bb6.appspot.com",
  messagingSenderId: "436887569868",
  appId: "1:436887569868:web:3232cf05d9c117763fc969",
  measurementId: "G-CJPJZ1TP4T"
};


firebase.initializeApp(firebaseConfig);

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      
      window.location.href = "/HTML/inicio.html";
    })
    .catch((error) => {
      alert("Error: " + error.message);
      console.error(error);
    });
}

