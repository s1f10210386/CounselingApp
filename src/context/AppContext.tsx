'use client';

import { User, onAuthStateChanged } from 'firebase/auth';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { setUserId } from 'firebase/analytics';
import { useRouter } from 'next/navigation';

type AppProviderProps = {
  children: ReactNode;
};

type AppContextType = {
  user: User | null;
  userId: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  selectedRoom: string | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
  selectedRoomName: string | null;
  setSelectedRoomName: React.Dispatch<React.SetStateAction<string | null>>;
};

const defaultContextData = {
  user: null,
  userId: null,
  setUser: () => {},
  selectedRoom: null,
  setSelectedRoom: () => {},
  selectedRoomName: null,
  setSelectedRoomName: () => {},
};

const AppContext = createContext<AppContextType>(defaultContextData);

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedRoomName, setSelectedRoomName] = useState<string | null>(null);
  const router = useRouter();
  //ログインかログアウトかの状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      setUserId(newUser ? newUser.uid : null);
      console.log('newuser', newUser);

      // useEffectじゃないとrouter.pushが使えない
      if (!newUser) {
        router.push('/auth/login');
      }
    });

    //ページが閉じられたとき(アンバウンドされた時)ストップされるようにする。メモリリークを止まる様に
    return () => {
      unsubscribe();
    };
  }, [user, router]);

  return (
    //ラップされてるのはグローバルで使える
    <AppContext.Provider
      value={{
        user,
        userId,
        setUser,
        selectedRoom,
        setSelectedRoom,
        selectedRoomName,
        setSelectedRoomName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
