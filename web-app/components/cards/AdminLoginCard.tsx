"use client"
import React, { useState } from 'react'
import PrimaryInput from '../inputs/PrimaryInput'
import PrimaryButton from '../buttons/PrimaryButton'
import toast from 'react-hot-toast';
import api from '@/axios';

type Form = {
    username: string;
    password: string;
}

const AdminLoginCard = () => {

    const [form, setForm] = useState<Form>({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
            return;
        }

        setIsLoading(true);
        api.post("/admin-login", {
            username: form.username,
            password: form.password
        }).then(res => {
            setIsLoading(false);
            console.log(res);
            toast.success(res.data.message || "Login Failed. Please check your credentials.")
        }).catch(err => {
            setIsLoading(false);
            console.log(err);
            toast.error(err.response.data.message || "Login Failed. Please check your credentials.")
        })

    }

    return (
        <div className="w-sm flex flex-col gap-3 p-6 rounded-xl">
            <h1 className='font-semibold text-center text-xl'>Admin Login</h1>
            <label htmlFor="username">Username</label>
            <PrimaryInput id="username" name="username" type="text" onChange={handleInputChange} className='p-1 px-2 rounded-xl border' />
            <label htmlFor="password">Password</label>
            <PrimaryInput id="password" name="password" type="password" onChange={handleInputChange} className='p-1 px-2 rounded-xl border' />
            <PrimaryButton onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </PrimaryButton>
        </div>
    )

}

export default AdminLoginCard
