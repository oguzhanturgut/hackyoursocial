import * as firebase from 'firebase';

// const settings = { timestampsInSnapshots: true };

const firebaseConfig = {
  apiKey: 'AIzaSyDE8pABtUCH2kzGsN-htLQY8yDednivRiQ',
  authDomain: 'ocean-d27d7.firebaseapp.com',
  databaseURL: 'https://ocean-d27d7.firebaseio.com',
  projectId: 'ocean-d27d7',
  storageBucket: 'ocean-d27d7.appspot.com',
  messagingSenderId: '732932278090',
  appId: '1:732932278090:web:2f6389b5472052698663b3',
  measurementId: 'G-3X88ZLXK9L',
};

// Could not remove this into another file it breaks the code
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default { firebaseApp, firebaseConfig };
