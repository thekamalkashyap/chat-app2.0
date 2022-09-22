import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';

const SignIn = ({ setErr }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = () => {
    signInWithEmailAndPassword(auth, email, password)
      .catch((err) => setErr(err.code))
      .then(() => {
        setTimeout(() => {
          setErr('');
        }, 2000);
      });
  };

  return (
    <div>
      <form className="flex flex-col w-[90vw] max-w-4xl mx-auto space-y-3 p-5 rounded-xl text-black bg-white ">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Ex: iamkamalkumar@proton.me"
          className="bg-transparent border-b border-black focus:outline-none"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label htmlFor="email">Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Ex: BsdD@1464md"
          className="bg-transparent border-b border-black focus:outline-none"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </form>
      <button
        disabled={!email || !password}
        onClick={handleSubmit}
        className="ml-5 dark:mt-5 dark:ml-0 px-3 py-1 rounded-full disabled:opacity-60 border border-green-500 dark:border-none text-green-500 dark:text-black bg-white "
      >
        Get started
      </button>
    </div>
  );
};

export default SignIn;
