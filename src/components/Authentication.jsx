import React, { useState } from 'react';
import config from '../utils/config.json';
import { toast } from 'react-toastify';
import { auth, db } from '../utils/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

const Authentication = () => {
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha',
      {
        size: 'invisible',
      },
      auth
    );
  };

  const GenerateOtp = async (e) => {
    e.preventDefault();
    if (number.length >= 12) {
      generateRecaptcha();
      setIsOtpGenerated(true);
      signInWithPhoneNumber(auth, number, window.recaptchaVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
        })
        .catch((err) => {
          toast.error(err.code);
          setIsOtpGenerated(false);
        });
    } else {
      toast.error('Invalid Number');
    }
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    let otp = document.getElementById('otp').value;
    if (otp.length == 6) {
      window.confirmationResult
        .confirm(otp)
        .then(async (res) => {
          await setDoc(doc(db, 'users', res.user.uid), {
            uid: res.user.uid,
            displayName: 'user',
            phoneNumber: res.user.phoneNumber,
            photoURL: '',
          });

          await setDoc(doc(db, 'userChats', res.user.uid), {});
        })
        .catch((err) => {
          toast.error(err.code);
        });
    }
  };

  return (
    <>
      <div className="h-[20vh] flex justify-center items-center uppercase font-extrabold text-3xl  ">
        {config.name}
      </div>
      <div className=" flex flex-col flex-1 justify-center items-center">
        <h1 className="text-green-500 text-2xl font-semibold my-5 ">Sign in</h1>
        <div className="dark:text-black w-1/2 dark:bg-white rounded-2xl  p-10">
          <form
            className="flex space-y-4 flex-col justify-center mb-2"
            onSubmit={GenerateOtp}
          >
            <label htmlFor="number">Number:</label>
            <input
              className="border-b-2 dark:border-black focus:outline-none w-full bg-transparent "
              type="tel"
              placeholder="+911234567890"
              name="number"
              id="number"
              value={number}
              onKeyDown={(e) => {
                if (e.key == 'Backspace') {
                  setNumber(e.target.value);
                }
              }}
              onChange={(e) => {
                if (e.target.value.length <= 13) {
                  setNumber(e.target.value);
                }
              }}
            />
            <button className=" py-1 rounded-lg text-white font-semibold bg-green-500">
              Generate OTP
            </button>
          </form>
          {isOtpGenerated && (
            <form
              onSubmit={verifyOTP}
              className="flex space-y-4 flex-col justify-center"
              autoComplete="off"
            >
              <label htmlFor="otp">OTP:</label>
              <input
                className="border-b-2 dark:border-black focus:outline-none w-full bg-transparent "
                type="number"
                name="otp"
                id="otp"
                value={otp}
                onKeyDown={(e) => {
                  if (e.key == 'Backspace') {
                    setOtp(e.target.value);
                  }
                }}
                onChange={(e) => {
                  if (e.target.value.length <= 6) {
                    setOtp(e.target.value);
                  }
                }}
              />
              <button className=" rounded-lg py-1 text-white font-semibold bg-green-500">
                Verify
              </button>
            </form>
          )}
        </div>
        <div id="recaptcha"></div>
      </div>
    </>
  );
};

export default Authentication;
