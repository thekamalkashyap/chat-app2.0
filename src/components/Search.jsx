import { db } from '../utils/firebase';
import { useAuth } from '../context/AuthContext';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { useState } from 'react';
import Chat from './Chat';

const Search = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');

  const handleSearch = async () => {
    const q = query(collection(db, 'users'), where('email', '==', email));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setEmail(err.code);
      setTimeout(() => {
        setEmail('');
      }, 2000);
    }
  };

  const handleSelect = async () => {
    const combinedEmail =
      currentUser.email > user.email
        ? `${currentUser.email.split('.').join('_')},${user.email
            .split('.')
            .join('_')}`
        : `${user.email.split('.').join('_')},${currentUser.email
            .split('.')
            .join('_')}`;
    try {
      const res = await getDoc(doc(db, 'chats', combinedEmail));

      if (!res.exists()) {
        await setDoc(doc(db, 'chats', combinedEmail), { messages: [] });

        await updateDoc(doc(db, 'userChats', currentUser.email), {
          [combinedEmail + '.userInfo']: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedEmail + '.date']: serverTimestamp(),
        });

        await updateDoc(doc(db, 'userChats', user.email), {
          [combinedEmail + '.userInfo']: {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedEmail + '.date']: serverTimestamp(),
        });
      }
    } catch (err) {
      setEmail(err.code);
      setTimeout(() => {
        setEmail('');
      }, 2000);
    }

    setUser(null);
    setEmail('');
  };

  return (
    <>
      <div className="flex w-full border border-black dark:border-white py-1 md:pb-0 rounded-xl">
        <button
          onClick={handleSearch}
          disabled={email ? false : true}
          className=" disabled:opacity-60 ml-2 "
        >
          <svg
            width="16"
            height="16"
            className="w-5 h-5 mr-3 fill-black dark:fill-white"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </button>
        <input
          type="email"
          value={email}
          placeholder="Search user email"
          onKeyDown={(e) => {
            if (e.key == 'Enter' && email) {
              e.preventDefault();
              handleSearch();
            }
          }}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="px-3 w-full focus:outline-none bg-transparent"
        />
      </div>
      {user && (
        <div className="w-full" onClick={handleSelect}>
          <Chat user={user} />
        </div>
      )}
    </>
  );
};

export default Search;
