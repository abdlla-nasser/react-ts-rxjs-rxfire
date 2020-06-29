import * as firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAHzuBZwq2JLxkRUKHs2rtesyN_7LBlcfY",
  authDomain: "rxfire-ts-react-1st-try.firebaseapp.com",
  databaseURL: "https://rxfire-ts-react-1st-try.firebaseio.com",
  projectId: "rxfire-ts-react-1st-try",
  storageBucket: "rxfire-ts-react-1st-try.appspot.com",
  messagingSenderId: "599932988229",
  appId: "1:599932988229:web:3632958c5325d2b5d02c2c"
};

firebase.initializeApp(firebaseConfig);

export default firebase;