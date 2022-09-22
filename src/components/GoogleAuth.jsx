import googleLogo from '../../public/google.png';
import Image from 'next/image';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { setDoc, doc } from 'firebase/firestore';

const GoogleAuth = ({ setErr }) => {
  const provider = new GoogleAuthProvider();
  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      try {
        await setDoc(doc(db, 'users', res.user.email), {
          uid: res.user.uid,
          displayName: res.user.displayName,
          email: res.user.email,
          photoURL: res.user.photoURL,
        });

        await setDoc(doc(db, 'userChats', res.user.email), {});
      } catch (err) {
        setErr(err.code);
        setTimeout(() => {
          setErr('');
        }, 2000);
      }
    } catch (err) {
      setErr(err.code);
      setTimeout(() => {
        setErr('');
      }, 2000);
    }
  };
  return (
    <div className=" flex flex-col justify-center items-center">
      <button
        onClick={signInWithGoogle}
        className="flex items-center py-2 pr-3 border border-gray-500 text-green-500 font-bold rounded-lg cursor-pointer"
      >
        <div className=" relative h-7 w-7 mx-2">
          <Image src={googleLogo} alt="G" layout="fill" priority />
        </div>
        Sign in With Google
      </button>
    </div>
  );
};

export default GoogleAuth;
