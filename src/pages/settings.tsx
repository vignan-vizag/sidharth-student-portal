import Head from 'next/head'
import React, { useState, ChangeEvent, FormEvent } from 'react'

interface StudentData {
    name: string
    email: string
    password: string
}

const Settings = () => {
    const [studentData, setStudentData] = useState<StudentData>({
        name: 'Sidharth Varma',
        email: 'varma.work@gmail.com',
        password: '',
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setStudentData({
            ...studentData,
            [name]: value,
        })
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        alert('Changes saved successfully!')
    }

    return (
        <div className="max-w-lg mx-auto p-6 border rounded-lg shadow-md mt-10">
            <Head><title>Settings | Assessment Student Portal</title></Head>
            <h2 className="text-2xl font-bold mb-4">Edit Your Information</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={studentData.name}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md placeholder:text-neutral-200"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={studentData.email}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md placeholder:text-neutral-200"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">New Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={studentData.password}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </div>
                <button type="submit" className="w-full p-2 mt-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md">
                    Save Changes
                </button>
            </form>
        </div>
    )
}

export default Settings
