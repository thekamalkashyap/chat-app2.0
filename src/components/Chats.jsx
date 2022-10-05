import Search from './Search';
import { useChat } from '../context/ChatContext';
import Chat from './Chat';
import { doc, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db, auth } from '../utils/firebase';
import { useAuth } from '../context/AuthContext';
import Router from 'next/router';
import { signOut } from 'firebase/auth';
import Image from 'next/image';
import ghost from '../../public/ghost.png';

function Chats() {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const { dispatch } = useChat();

  useEffect(() => {
    if (currentUser && currentUser.email) {
      const unsub = onSnapshot(
        doc(db, 'userChats', currentUser.email),
        (doc) => {
          setChats(doc.data());
        }
      );
      return () => {
        unsub();
      };
    }
  }, [currentUser]);

  return (
    <div className="relative">
      <div className="text-xl flex justify-between items-center pl-5 h-[3rem] sm:text-2xl md:text-3xl font-bold text-green-500">
        <span>Chats</span>
      </div>
      <div className="min-h-[2.5rem] ">
        <Search />
      </div>
      <div className="overflow-y-auto h-[calc(100vh-9.5rem)]">
        {chats &&
          Object.entries(chats)
            ?.sort((a, b) => b[1].date - a[1].date)
            .map((chat) => (
              <div
                key={chat[0]}
                onClick={() => {
                  dispatch({ type: 'CHANGE_USER', payload: chat[1].userInfo });
                  if (Router.pathname == '/') {
                    Router.replace('/chat/');
                  }
                }}
              >
                <Chat
                  user={chat[1].userInfo}
                  lastMessage={chat[1].lastMessage}
                />
              </div>
            ))}
      </div>
      <div className="border-t dark:border-gray-600 h-[4rem] px-5 pt-2 flex items-start justify-between">
        <button
          className="text-green-600"
          onClick={() => {
            signOut(auth);
          }}
        >
          Sign Out
        </button>
        <span className="mr-7 mt-1">
          {currentUser && currentUser.displayName}
        </span>
        <svg
          className="fill-green-500 mt-2 cursor-pointer"
          onClick={() => {
            document.getElementById('portal').classList.toggle('hidden');
          }}
          width="24"
          height="24"
          viewBox="0 0 16 16"
        >
          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
        </svg>
      </div>
      <div
        id="portal"
        onClick={() => {
          document.getElementById('portal').classList.toggle('hidden');
        }}
        className=" hidden absolute overflow-scroll bottom-[4.5rem] right-2 bg-[#313131] p-2 pr-10 rounded-xl"
      >
        {currentUser && (
          <>
            <div className="flex flex-col mb-2 text-xl md:text-xl">
              <div className="flex items-center space-x-3">
                <div className=" relative h-12 w-12">
                  {currentUser.photoURL ? (
                    <Image
                      src={currentUser.photoURL}
                      alt={currentUser.displayName[0]}
                      layout="fill"
                      className="rounded-full"
                    />
                  ) : (
                    <Image
                      src={ghost}
                      alt="U"
                      layout="fill"
                      className="rounded-full"
                    />
                  )}
                </div>
                <h2 className="text-[#797979]">
                  {currentUser.displayName ? currentUser.displayName : 'User'}
                </h2>
              </div>
              <div>
                <h1 className="text-lg md:text-xl break-words">
                  {currentUser.phoneNumber}
                  {console.log(currentUser)}
                </h1>
              </div>
              <div className="text-green-500 flex flex-col items-start space-y-2 mt-5">
                <button>Profile</button>
                <button
                  className="text-green-600"
                  onClick={() => {
                    signOut(auth);
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Chats;
