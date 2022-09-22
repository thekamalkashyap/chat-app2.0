import React, { useState } from 'react';
import { auth, db, storage } from '../utils/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

const SignUp = ({ setErr }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const date = new Date().getTime();
      const storageRef = ref(storage, `${name + date}`);

      await uploadBytesResumable(storageRef, image).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateProfile(res.user, {
              displayName: name,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, 'users', res.user.email), {
              uid: res.user.uid,
              displayName: name,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, 'userChats', res.user.email), {});
          } catch (err) {
            setErr(err.code);
            setTimeout(() => {
              setErr('');
            }, 2000);
          }
        });
      });
    } catch (err) {
      setErr(err.code);
      setTimeout(() => {
        setErr('');
      }, 2000);
    }
  };
  return (
    <div>
      <form className="flex flex-col w-[90vw] max-w-4xl mx-auto space-y-3 p-5 rounded-xl text-black bg-white ">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Ex: Kamal Kashyap"
          className="bg-transparent border-b border-black focus:outline-none"
          required
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Ex: iamkamalkumar@proton.me"
          className="bg-transparent border-b border-black focus:outline-none"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="email">Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Ex: BsdD@1464md"
          className="bg-transparent border-b border-black focus:outline-none"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <label
          htmlFor="profileImage"
          className="cursor-pointer flex items-center gap-2"
        >
          <svg
            width="40"
            height="40"
            className="fill-green-500"
            viewBox="0 0 16 16"
          >
            <path d="M5 8c0-1.657 2.343-3 4-3V4a4 4 0 0 0-4 4z" />
            <path d="M12.318 3h2.015C15.253 3 16 3.746 16 4.667v6.666c0 .92-.746 1.667-1.667 1.667h-2.015A5.97 5.97 0 0 1 9 14a5.972 5.972 0 0 1-3.318-1H1.667C.747 13 0 12.254 0 11.333V4.667C0 3.747.746 3 1.667 3H2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1h.682A5.97 5.97 0 0 1 9 2c1.227 0 2.367.368 3.318 1zM2 4.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0zM14 8A5 5 0 1 0 4 8a5 5 0 0 0 10 0z" />
          </svg>
          <span>{image && image.name}</span>
        </label>
        <input
          type="file"
          name="profileImage"
          id="profileImage"
          className="hidden"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </form>
      <button
        disabled={!name || !email || !password}
        onClick={handleSubmit}
        className="ml-5 dark:mt-5 dark:ml-0 px-3 py-1 rounded-full disabled:opacity-60 border border-green-500 dark:border-none text-green-500 dark:text-black bg-white "
      >
        Get started
      </button>
    </div>
  );
};

export default SignUp;
