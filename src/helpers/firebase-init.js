import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import firebaseConfig from '@/config/firebase.js'

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

export default db

