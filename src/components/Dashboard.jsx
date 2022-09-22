import React from 'react';
import Image from 'next/image';
import Chats from './Chats';
import config from '../utils/config.json';

const Dashboard = () => {
  return (
    <>
      <div className="flex md:divide-x dark:divide-gray-600">
        <div className="w-full md:w-[40vw]">
          <Chats />
        </div>
        <div className="hidden md:flex w-[60vw] h-screen flex-col justify-center items-center">
          <div className=" h-32 w-32 my-3 relative">
            <Image src={config.logo} alt="G" layout="fill" priority />
          </div>
          <h1 className="uppercase font-semibold text-3xl">{config.name}</h1>
          <p className="w-1/2 text-center mt-5 text-xl opacity-60">
            Send and receive messages with guftgoon. A open source alternative
            to all modern realtime chat applications out their.
          </p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
