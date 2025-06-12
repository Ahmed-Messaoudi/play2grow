'use client';

import { useEffect, useState } from 'react';
import ChildrenList from './components/ChildrenList';
import AddChildModal from './components/AddChildModal';

export default function ChildrenPage() {
  const [children, setChildren] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchChildren = async () => {
    const res = await fetch('http://localhost:3001/api/children', { credentials: 'include' });
    const data = await res.json();
    setChildren(data);
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-500">Childrens</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Child
        </button>
      </div>

      <ChildrenList children={children} refresh={fetchChildren} />

      <AddChildModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdded={fetchChildren}
      />
    </div>
  );
}
