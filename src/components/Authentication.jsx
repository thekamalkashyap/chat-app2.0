import React, { useState } from 'react';
import GoogleAuth from './GoogleAuth';
import SignUp from './SignUp';
import SignIn from './SignIn';
import config from '../utils/config.json';

const Authentication = () => {
  const [isNewUser, setIsNewUser] = useState(true);
  const [err, setErr] = useState('');
  return (
    <>
      <div className="h-[20vh] flex justify-center items-center uppercase font-extrabold text-3xl  ">
        {config.name}
      </div>
      <div className="overflow-y-scroll flex flex-col justify-center items-center">
        {isNewUser ? (
          <>
            <SignUp setErr={setErr} />
            {err && (
              <div className=" text-rose-600 border rounded-lg border-rose-500 mb-10 py-2 px-5">
                {err}
              </div>
            )}
            <p>
              Already have an account ?{' '}
              <span
                className="text-green-500 cursor-pointer"
                onClick={() => {
                  setIsNewUser(false);
                }}
              >
                Sign In
              </span>
            </p>
          </>
        ) : (
          <>
            <SignIn setErr={setErr} />
            {err && (
              <div className=" text-rose-600 border rounded-lg border-rose-500 mb-5 py-2 px-5">
                {err}
              </div>
            )}
            <p>
              Don&#39;t have an account ?{' '}
              <span
                className="text-green-500 cursor-pointer"
                onClick={() => {
                  setIsNewUser(true);
                }}
              >
                Sign up
              </span>
            </p>
          </>
        )}

        <span className="my-2">or</span>
        <GoogleAuth setErr={setErr} />
      </div>
    </>
  );
};

export default Authentication;
