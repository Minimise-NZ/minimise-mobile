import * as firebase from 'firebase'
import 'firebase/firestore'
import store from './store/index'

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyAjyjXMLbCu6aCMgtZYnBKTftYBf00POlQ',
  authDomain: 'minimise-firestore.firebaseapp.com',
  databaseURL: 'https://minimise-firestore.firebaseio.com',
  projectId: 'minimise-firestore',
  storageBucket: 'minimise-firestore.appspot.com',
  messagingSenderId: '1095768903292'
})

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    store.dispatch('autoLogIn', user.uid)
  } else {
    console.log('user not signed in')
  }
})

export const firestore = firebaseApp.firestore()
const settings = {/* your settings... */ timestampsInSnapshots: true};
  firestore.settings(settings);
