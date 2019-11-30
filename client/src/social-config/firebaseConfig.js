import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
};

// Could not remove this into another file it breaks the code
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default { firebaseApp, firebaseConfig };
