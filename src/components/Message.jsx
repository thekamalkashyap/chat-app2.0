import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
function Message({ message, currentUser }) {
  const [typeOfMessage, setTypeOfMessage] = useState();
  const ref = useRef();

  useEffect(() => {
    setTypeOfMessage(
      message.sender == currentUser.displayName ? 'Sender' : 'Receiver'
    );
  }, [typeOfMessage]);

  useEffect(() => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  const isURL = (str) => {
    const regexp =
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div
      ref={ref}
      className={` break-words w-fit max-w-[70vw] px-1 border m-2 ${
        typeOfMessage == 'Sender'
          ? ' border-green-500 ml-auto rounded-l-lg rounded-tr-xl'
          : 'border-gray-500 rounded-r-lg rounded-tl-xl'
      }`}
    >
      {message.image && (
        <div className=" h-20 w-20 m-1 sm:h-24 sm:w-24 relative">
          <Image
            className="rounded-lg"
            src={message.image}
            alt="Image"
            layout="fill"
            priority
          />
        </div>
      )}
      {isURL(message.text) ? (
        <a
          rel="noreferrer"
          target="_blank"
          className="cursor-pointer text-green-500"
          href={
            message.text.indexOf('https://') !== -1 ||
            message.text.indexOf('http://') !== -1
              ? message.text
              : 'https://' + message.text
          }
        >
          {message.text}
        </a>
      ) : (
        message.text
      )}
    </div>
  );
}

export default Message;
