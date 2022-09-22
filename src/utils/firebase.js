import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBd0WzrG9kPMxtd-_DYz4Rv60fsWSnj88k',
  authDomain: 'chat-app2-0-ae7f7.firebaseapp.com',
  projectId: 'chat-app2-0-ae7f7',
  storageBucket: 'chat-app2-0-ae7f7.appspot.com',
  messagingSenderId: '1026159898313',
  appId: '1:1026159898313:web:8e96ca14fd51d278d72718',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
