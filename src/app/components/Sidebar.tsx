'use client';

import React, { useEffect, useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { auth, db } from '../../../firebase';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { useAppContext } from '@/context/AppContext';
import { set } from 'firebase/database';

type Room = {
  id: string;
  name: string;
  createdAt: Timestamp;
};

const Sidebar = () => {
  //これでContextからグローバルにid呼出せる
  const { user, userId, setSelectedRoom, setSelectedRoomName } = useAppContext();

  const [rooms, setNewrooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const roomCollectionRef = collection(db, 'rooms');

      //where句でuserIdごとに各々のroom表示可能
      const q = query(roomCollectionRef, where('userId', '==', userId), orderBy('createdAt'));
      //snapshotでリアルタイムに表示されるぽい(この関数についてはまだようわからん)
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newRooms: Room[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          createdAt: doc.data().createdAt,
        }));
        //部屋が取得される
        // console.log(newRooms);
        setNewrooms(newRooms);
      });

      //常にroom監視するから閉じられたときストップ
      return () => {
        unsubscribe();
      };
    };

    fetchRooms();
  }, [userId]);

  const selectRoom = (roomId: string, roomName: string) => {
    setSelectedRoom(roomId);
    setSelectedRoomName(roomName);
  };

  const addNewRoom = async () => {
    const roomName = prompt('room名を入力してください。');
    if (roomName) {
      const newRoomRef = collection(db, 'rooms');
      await addDoc(newRoomRef, {
        name: roomName,
        userId: userId,
        createdAt: serverTimestamp(),
      });
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="bg-custom-blue h-full overflow-y-auto px-5 flex flex-col">
      <div className="flex-grow">
        <div
          onClick={addNewRoom}
          className="cursor-pointer flex justify-evenly items-center border mt-2 rounded-md hover:bg-blue-800 duration-150"
        >
          <span className="text-white p-4 text-2xl">+</span>
          <h1 className="text-white text-xl font-semibold p-4">New Chat</h1>
        </div>

        <ul>
          {rooms.map((room) => (
            <li
              key={room.id}
              className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150"
              onClick={() => selectRoom(room.id, room.name)}
            >
              {room.name}
            </li>
          ))}

          {/* <li className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150">
            Room 2
          </li>
          <li className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150">
            Room 3
          </li>
          <li className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150">
            Room 4
          </li> */}
        </ul>
      </div>

      {user && <div className="mb-2 text-slate-100 text-lg"> {user.email}</div>}

      <div
        onClick={() => handleLogout()}
        className="flex items-center justify-evenly cursor-pointer mb-2 p-4 text-slate-100 text-lg hover:bg-slate-700"
      >
        <LogoutIcon />
        <span>ログアウト</span>
      </div>
    </div>
  );
};

export default Sidebar;
