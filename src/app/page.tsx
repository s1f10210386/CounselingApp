'use client';

import Image from 'next/image';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  //ユーザー情報がないときにログインページにリダイレクトする
  const router = useRouter();
  const { user } = useAppContext();
  if (!user) {
    router.push('/auth/login');
  }

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="h-full flex" style={{ width: '120vh' }}>
        <div className="w-1/5 h-full border-r">
          <Sidebar />
        </div>
        <div className="w-4/5">
          <Chat />
        </div>
      </div>
    </div>
  );
}
