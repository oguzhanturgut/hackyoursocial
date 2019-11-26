import * as firebase from 'firebase';

// const settings = { timestampsInSnapshots: true };

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

firebase.initializeApp(firebaseConfig);

export default { firebase, firebaseConfig };
