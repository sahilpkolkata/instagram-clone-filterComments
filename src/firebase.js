import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAQ98y0i4u2GkavZdY_BUEZGCAJd-7ZWuk",
  authDomain: "instagram-clone-dd2af.firebaseapp.com",
  databaseURL: "https://instagram-clone-dd2af.firebaseio.com",
  projectId: "instagram-clone-dd2af",
  storageBucket: "instagram-clone-dd2af.appspot.com",
  messagingSenderId: "36872492409",
  appId: "1:36872492409:web:f6310f6c8acd6ecbf80ba8",
  measurementId: "G-W02VNB2903"
})

const db = firebaseApp.firestore()
const auth = firebaseApp.auth()
const storage = firebaseApp.storage()

export {db, auth, storage}