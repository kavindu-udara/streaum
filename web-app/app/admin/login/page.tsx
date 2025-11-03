"use client"
import React, { useState } from 'react'
import toast from 'react-hot-toast';

type Form = {
  username: string;
  password: string;
}

const AdminLoginPage = () => {

  const [form, setForm] = useState<Form>({ username: '', password: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  }

  const handleSubmit = () => {
    if (!form.username || !form.password) {
      toast.error("All Fields are Required")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-sm flex flex-col gap-3 border p-6 rounded-xl shadow-md">
        <h1 className='font-semibold text-center text-xl'>Admin Login</h1>
        <label htmlFor="">Username</label>
        <input type="text" onChange={handleInputChange} className='p-1 rounded-xl border' />
        <label htmlFor="">Password</label>
        <input type="password" onChange={handleInputChange} className='p-1 rounded-xl border' />
        <button onClick={handleSubmit} className='dark:bg-white dark:text-black bg-black text-white rounded-xl py-2 cursor-pointer'>Login</button>
      </div>
    </main>
  )
}

export default AdminLoginPage
