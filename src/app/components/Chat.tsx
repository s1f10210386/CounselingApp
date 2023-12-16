'use client';

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAppContext } from '@/context/AppContext';
import OpenAI from 'openai';
import LoadingIcons from 'react-loading-icons';
import { set } from 'firebase/database';

type Message = {
  text: string;
  sender: string;
  createdAt: Timestamp;
};

const Chat = () => {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    baseURL: 'https://api.openai.iniad.org/api/v1',
    dangerouslyAllowBrowser: true,
  });
  const { selectedRoom } = useAppContext();
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isloading, setIsloading] = useState<boolean>(false);

  const scrollDiv = useRef<HTMLDivElement>(null);

  //各ルームにおけるメッセージを取得
  useEffect(() => {
    if (selectedRoom) {
      const fetchMessages = async () => {
        const roomDocRef = doc(db, 'rooms', selectedRoom);
        const messageCollectionRef = collection(roomDocRef, 'messages');

        const q = query(messageCollectionRef, orderBy('createdAt'));
        //snapshotでリアルタイムに表示されるぽい(この関数についてはまだようわからん)
        const unsubscribe = onSnapshot(q, (snapshot) => {
          //メッセージ全取得
          const newMessages = snapshot.docs.map((doc) => doc.data() as Message);
          setMessages(newMessages);
          console.log('message', messages);
        });

        //常にroom監視するから閉じられたときストップ
        return () => {
          unsubscribe();
        };
      };

      fetchMessages();
    }
  }, [selectedRoom]);

  //メッセージ送信時とかにスクロールする
  useEffect(() => {
    if (scrollDiv.current) {
      const element = scrollDiv.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      text: inputMessage,
      sender: 'user',
      createdAt: serverTimestamp(),
    };
    //メッセージをFirestoreに保存

    const roomDocRef = doc(db, 'rooms', selectedRoom!);
    const messageRef = collection(roomDocRef, 'messages');
    await addDoc(messageRef, messageData);

    setInputMessage('');

    setIsloading(true);
    //GPTからの返信(FBへの保存も込み)
    const gpt3Response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: inputMessage }],
      model: 'gpt-3.5-turbo',
    });
    console.log(gpt3Response);
    const botResponse = gpt3Response.choices[0].message.content;
    await addDoc(messageRef, {
      text: botResponse,
      sender: 'bot',
      createdAt: serverTimestamp(),
    });

    setIsloading(false);
  };

  return (
    <div className="bg-gray-500 h-full p-4 flex flex-col">
      <h1 className="text-2xl text-white font-semibold mb-4">Room 1</h1>
      <div className="flex-grow overflow-y-auto mb-4" ref={scrollDiv}>
        {messages.map((message, index) => (
          <div key={index} className={message.sender === 'user' ? 'text-right' : 'text-left'}>
            <div
              className={
                message.sender === 'user'
                  ? 'bg-blue-500 inline-block rounded px-4 py-2 mb-2'
                  : 'bg-green-500 inline-block rounded px-4 py-2 mb-2'
              }
            >
              <p className="text-white">{message.text}</p>
            </div>
          </div>
        ))}
        {/* これだとsenderが誰か不明でそれぞれでメッセージが出力されちゃう(2回) */}
        {/* <div className="text-right">
              <div className="bg-blue-500 inline-block rounded px-4 py-2 mb-2">
                <p>{message.text}</p>
              </div>
            </div>

            <div className="text-left">
              <div className="bg-green-500 inline-block rounded px-4 py-2 mb-2">
                <p>{message.text}</p>
              </div>
            </div> */}
        {isloading && <LoadingIcons.TailSpin />}
      </div>

      <div className="flex-shrink-0 relative">
        <input
          value={inputMessage}
          type="text"
          placeholder="メッセージ"
          className="border-2 rounded w-full pr-10 focus:outline-none p-2"
          onChange={(e) => setInputMessage(e.target.value)}
          // フォームタグじゃないからこれじゃないとEnter無理
          onKeyDown={(e) => {
            if ((e.key = 'Enter')) {
              sendMessage();
            }
          }}
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
