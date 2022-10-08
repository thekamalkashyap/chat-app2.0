import React, { useEffect, useState } from 'react';
import {
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import Router from 'next/router';
import { db, storage } from '../utils/firebase';
import Message from '../components/Message';
import { getDownloadURL, uploadBytesResumable, ref } from 'firebase/storage';
import Chats from '../components/Chats';
const Chat = () => {
  const { data } = useChat();
  const { currentUser } = useAuth();
  const { user } = data;
  const [messages, setMessages] = useState();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (data.chatId == 'null') {
      Router.replace('/');
    }
  }, [data]);
  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages);
      }
    });
    return () => {
      unSub();
    };
  }, [data]);
  const send = async () => {
    document.getElementById('inputbox').innerText = '';
    if (image) {
      const storageRef = ref(
        storage,
        `${currentUser.displayName}${Timestamp.now().nanoseconds}`
      );
      await uploadBytesResumable(storageRef, image).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          await updateDoc(doc(db, 'chats', data.chatId), {
            messages: arrayUnion({
              id: Timestamp.now().nanoseconds,
              text,
              sender: currentUser.uid,
              date: Timestamp.now(),
              image: downloadURL,
            }),
          });
        });
      });
    } else if (text) {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: Timestamp.now().nanoseconds,
          text,
          sender: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId + '.lastMessage']: {
        text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    });
    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: {
        text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    });
    setImage(null);
    setText('');
  };

  return (
    <>
      <div className="flex md:divide-x  dark:divide-gray-600">
        <div className="hidden md:block w-[40vw]">
          <Chats />
        </div>
        <div className="w-full md:w-[60vw]">
          <div className="h-[3rem] border-b dark:border-gray-600 px-5 flex items-center justify-between md:justify-end">
            <button
              onClick={() => {
                Router.replace('/');
              }}
              className="text-green-500 md:hidden text-xl sm:text-2xl md:text-3xl font-bold"
            >
              &#60; Chats
            </button>
            <div>
              <h1>{user.displayName}</h1>
            </div>
          </div>
          <div className="h-[calc(100vh-7rem)] overflow-y-auto">
            {messages &&
              messages.map((message) => (
                <div key={message.id}>
                  <Message message={message} currentUser={currentUser} />
                </div>
              ))}
          </div>
          <div className="flex absolute right-0 bottom-0 md:w-[60vw] w-full bg-white dark:bg-[#212121] min-h-[4rem] md:border-l border-t dark:border-gray-600">
            <label htmlFor="image" className=" px-2 cursor-pointer my-auto">
              <svg
                className="fill-green-500"
                width="24"
                height="24"
                viewBox="0 0 16 16"
              >
                <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
              </svg>
            </label>
            <input
              type="file"
              name="image"
              id="image"
              className="hidden"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
            <div
              contentEditable
              id="inputbox"
              placeholder="Aa"
              className="focus:outline-none empty:before:opacity-50 empty:before:content-[attr(placeholder)] px-3 mt-4 w-full max-h-[10rem] overflow-y-scroll "
              onInput={(e) => {
                setText(e.currentTarget.textContent.trim());
              }}
              onKeyDown={(e) => {
                if (e.key == 'Enter' && e.currentTarget.textContent.trim()) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button
              onClick={send}
              disabled={!text && !image}
              className="px-2 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
