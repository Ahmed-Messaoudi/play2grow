'use client';

import { useState } from 'react';
import axios from 'axios';

export default function AddUserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:4000/api/users', {
        name,
        email,
      });

      alert('✅ User added successfully!');
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('❌ Failed to add user');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow w-full max-w-md">
      <h2 className="text-xl font-bold">Add New User</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Add User
      </button>
    </form>
  );
}
