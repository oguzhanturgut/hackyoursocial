import * as firebase from 'firebase';

// const settings = { timestampsInSnapshots: true };

const firebaseConfig = {
  apiKey: 'AIzaSyAIOjdj3MF7tlqCpU435u3ChU7E9t7FpoM',
  authDomain: 'hyf-project-48ef4.firebaseapp.com',
  databaseURL: 'https://hyf-project-48ef4.firebaseio.com',
  projectId: 'hyf-project-48ef4',
  storageBucket: 'hyf-project-48ef4.appspot.com',
  messagingSenderId: '111507724756',
  appId: '1:111507724756:web:a6d88666bc9fad05239e41',
  measurementId: 'G-ZN6XZ9FDZE',
};

// Could not remove this into another file it breaks the code
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default { firebaseApp, firebaseConfig };
