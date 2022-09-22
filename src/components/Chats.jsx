import Search from './Search';
import { useChat } from '../context/ChatContext';
import Chat from './Chat';
import { doc, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db, auth } from '../utils/firebase';
import { useAuth } from '../context/AuthContext';
import Router from 'next/router';
import { signOut } from 'firebase/auth';
import InstallApp from './InstallApp';

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
    <>
      <div className="text-xl flex justify-between items-center pl-5 h-[4rem] sm:text-2xl md:text-3xl font-bold text-green-500">
        <span>Chats</span>
        <InstallApp />
      </div>
      <div className="overflow-y-auto h-[calc(100vh-8rem)]">
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
      <div className="border-t  dark:border-gray-600 h-[4rem] px-5 pt-2 flex items-start justify-between">
        <button
          className="text-green-600"
          onClick={() => {
            signOut(auth);
          }}
        >
          Sign Out
        </button>
        <span className="mr-7">{currentUser && currentUser.displayName}</span>
        <button
          id="addChat"
          onClick={() => {
            let addChat = document.getElementById('addChat');
            document.getElementById('portal').classList.toggle('hidden');
            addChat.innerText = addChat.innerText == '+' ? 'x' : '+';
          }}
          className="text-2xl text-green-500 z-20"
        >
          +
        </button>
      </div>
      <div
        id="portal"
        onClick={() => {
          document.getElementById('portal').classList.add('hidden');
          let addChat = document.getElementById('addChat');
          addChat.innerText = addChat.innerText == '+' ? 'x' : '+';
        }}
        className=" hidden h-screen w-full backdrop-brightness-75 backdrop-blur-sm fixed top-0 left-0 z-10"
      >
        <div className=" h-screen w-screen flex flex-col justify-center items-center">
          <div className="w-1/2 py-4">
            <svg
              width="40"
              height="40"
              className="fill-green-500 cursor-pointer"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
              />
            </svg>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex z-20 flex-col bg-[#353535a4] p-5 rounded-xl w-1/2"
          >
            <Search />
          </div>
        </div>
      </div>
    </>
  );
}

export default Chats;
