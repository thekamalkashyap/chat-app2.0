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
import { toast } from 'react-toastify';

const Search = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useAuth();
  const [number, setNumber] = useState('');

  const handleSearch = async () => {
    const q = query(
      collection(db, 'users'),
      where('phoneNumber', '==', number)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      toast.error(err.code);
    }
  };

  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, 'chats', combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });

        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedId + '.userInfo']: {
            uid: user.uid,
            phoneNumber: user.phoneNumber,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });

        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId + '.userInfo']: {
            uid: currentUser.uid,
            phoneNumber: currentUser.phoneNumber,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });
      }
    } catch (err) {
      toast.error(err);
    }

    setUser(null);
    setNumber('');
  };

  return (
    <>
      <div className="flex w-full border border-black dark:border-white py-1 md:pb-0 rounded-xl">
        <button
          onClick={handleSearch}
          disabled={number ? false : true}
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
          value={number}
          placeholder="Search phone number"
          onKeyDown={(e) => {
            if (e.key == 'Enter' && number) {
              e.preventDefault();
              handleSearch();
            }
          }}
          onChange={(e) => {
            setNumber(e.target.value);
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
