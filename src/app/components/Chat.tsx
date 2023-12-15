'use client';

import React, { ChangeEvent, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';

const Chat = () => {
  const [inputMessage, setInputMessage] = useState<string>('');

  // const messages = (e: ChangeEvent<HTMLInputElement>) => {
  //   setInputMessage(e.target.value);
  //   console.log('1', inputMessage);
  //   console.log('2', e.target.value);
  // };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      text: inputMessage,
      sender: 'user',
      createdAt: serverTimestamp(),
    };
    //メッセージをFirestoreに保存
    const roomDocRef = doc(db, 'rooms', 'repe6D9ms5J6vWIhJez3');
    const messageRef = collection(roomDocRef, 'messages');
    await addDoc(messageRef, messageData);

    setInputMessage('');
  };

  return (
    <div className="bg-gray-500 h-full p-4 flex flex-col">
      <h1 className="text-2xl text-white font-semibold mb-4">Room 1</h1>
      <div className="flex-grow overflow-y-auto mb-4">
        <div className="text-right">
          <div className="bg-blue-500 inline-block rounded px-4 py-2 mb-2">
            <p>どうも</p>
          </div>
        </div>

        <div className="text-left">
          <div className="bg-green-500 inline-block rounded px-4 py-2 mb-2">
            <p>どうしました</p>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 relative">
        <input
          value={inputMessage}
          type="text"
          placeholder="メッセージ"
          className="border-2 rounded w-full pr-10 focus:outline-none p-2"
          onChange={(e) => setInputMessage(e.target.value)}
        />

        <button
          className="absolute inset-y-0 right-2 flex items-center"
          onClick={() => sendMessage()}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default Chat;
