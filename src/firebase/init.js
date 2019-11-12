import firebase from 'firebase';
var firebaseConfig = {
    //config API
  };

  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  firebaseApp.firestore().settings({timestampsInSnapshots:true});

  export default firebaseApp.firestore()
