'use client';

import { useState } from 'react';

interface AddChildModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export default function AddChildModal({ open, onClose, onAdded }: AddChildModalProps) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch('/api/children', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    onClose();
    onAdded();
    setForm({ firstName: '', lastName: '', email: '' });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded w-[400px] space-y-4">
        <h2 className="text-xl font-semibold">Add Child</h2>

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
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
