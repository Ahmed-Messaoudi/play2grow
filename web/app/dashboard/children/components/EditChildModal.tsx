'use client';

import { useState } from 'react';

interface Child {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  // Add other fields as needed
}

interface EditChildModalProps {
  child: Child;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditChildModal({ child, onClose, onUpdated }: EditChildModalProps) {
  const [form, setForm] = useState({ ...child });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch(`/api/children/${child.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    onClose();
    onUpdated();
  };

  if (!child) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded w-[400px] space-y-4 text-black">
        <h2 className="text-xl font-semibold">Edit Child</h2>

        <input
          type="text"
          placeholder="First Name"
          className="w-full border p-2 rounded"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          className="w-full border p-2 rounded"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
