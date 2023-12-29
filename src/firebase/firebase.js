// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getAuth , setPersistence, browserSessionPersistence} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBL-237uZVTkJwyCxBo29Vy09ASkiupj-4",
  authDomain: "studentprojectrepo.firebaseapp.com",
  projectId: "studentprojectrepo",
  storageBucket: "studentprojectrepo.appspot.com",
  messagingSenderId: "1091320260631",
  appId: "1:1091320260631:web:7e4828c44c17c2257b1452",
  measurementId: "G-W0FVWXSY3E"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const firestore = getFirestore(firebase);
const analytics = getAnalytics(firebase);
const auth = getAuth(firebase);
const storage = getStorage(firebase);
setPersistence(auth, browserSessionPersistence)
export { firestore, storage, auth };