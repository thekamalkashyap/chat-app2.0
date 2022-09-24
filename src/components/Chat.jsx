import Image from 'next/image';
import ghost from '../../public/ghost.png';
function Chat({ user, lastMessage }) {
  return (
    <>
      <div className="mt-3 rounded-lg flex items-center py-2 dark:hover:bg-[#313131] hover:bg-gray-100 cursor-pointer ">
        <div className=" h-10 w-10 sm:h-12 sm:w-12 mx-3 relative">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName[0]}
              layout="fill"
              className="rounded-full"
              priority
            />
          ) : (
            <Image
              src={ghost}
              alt={user.displayName[0]}
              layout="fill"
              className="rounded-full"
              priority
            />
          )}
        </div>
        <div>
          <h1>{user.displayName}</h1>
          <h3 className="opacity-60">{lastMessage?.text}</h3>
        </div>
      </div>
    </>
  );
}

export default Chat;
