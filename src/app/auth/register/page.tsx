'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type inputs = {
  email: string;
  password: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<inputs>();

  const onSubmit: SubmitHandler<inputs> = async (data) => {
    console.log(data);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="mb-4 text-2xl text-gray-700 font-medium">新規登録</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            {...register('email', {
              required: 'メールアドレスを入力してください',
            })}
            type="text"
            className="mt-1 border-2 rounded-md w-full p-2"
          />
          {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Password</label>

          <input type="Password" className="mt-1 border-2 rounded-md w-full p-2" />
          {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            新規登録
          </button>
        </div>

        <div className="mt-4">
          <span className="text-gray-600 text-sm">既にアカウントをお持ちですか？</span>
          <button className="text-blue-500 text-sm font-bold ml-1 hover:text-blue-700">
            ログインページへ
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
