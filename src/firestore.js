import * as firebase from 'firebase'
import 'firebase/firestore'

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyAjyjXMLbCu6aCMgtZYnBKTftYBf00POlQ',
  authDomain: 'minimise-firestore.firebaseapp.com',
  databaseURL: 'https://minimise-firestore.firebaseio.com',
  projectId: 'minimise-firestore',
  storageBucket: 'minimise-firestore.appspot.com',
  messagingSenderId: '1095768903292'
})

export const firestore = firebaseApp.firestore()
