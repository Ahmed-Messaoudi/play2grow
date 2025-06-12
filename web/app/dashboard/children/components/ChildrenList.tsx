'use client';

import { useState } from 'react';
import EditChildModal from './EditChildModal';

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ChildrenListProps {
  children: Child[];
  refresh: () => void;
}

export default function ChildrenList({ children, refresh }: ChildrenListProps) {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this child?");
    if (!confirm) return;

    await fetch(`/api/children/${id}`, { method: 'DELETE' });
    refresh();
  };

  return (
    <div className="grid gap-4">
      {children.map((child) => (
        <div key={child.id} className="p-4 border rounded flex justify-between items-center">
          <div>
            <p className="font-semibold text-black">{child.firstName} {child.lastName}</p>
            <p className="text-sm text-gray-600">{child.email}</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setSelectedChild(child)}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(child.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {selectedChild && (
        <EditChildModal
          child={selectedChild}
          onClose={() => setSelectedChild(null)}
          onUpdated={refresh}
        />
      )}
    </div>
  );
}
