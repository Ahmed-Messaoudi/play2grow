'use client';

import { useEffect, useState } from 'react';

export default function ChildrenPage() {
    type Child = { id: string | number; firstName: string; email: string };
    const [children, setChildren] = useState<Child[]>([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const fetchChildren = async () => {
        const res = await fetch('http://localhost:3001/api/children', {
            credentials: 'include',
        });
        const data = await res.json();

        console.log('Children API response:', data); // 👈 Log this

        setChildren(Array.isArray(data) ? data : []);
    };

    const createChild = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/children', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ firstName: name, email }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert(`Error: ${errorData.message || 'Failed to add child'}`);
                return;
            }

            setName('');
            setEmail('');
            fetchChildren();
        } catch (err) {
            alert('Network error while creating child');
            console.error(err);
        }
    };


    useEffect(() => {
        fetchChildren();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">My Children</h1>

            <div className="mb-4">
                <input
                    className="border p-2 mr-2"
                    value={name}
                    placeholder="Child Name"
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="border p-2 mr-2"
                    value={email}
                    placeholder="Child Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={createChild} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Add Child
                </button>
            </div>

            <ul>
                {Array.isArray(children) && children.length > 0 ? (
                    children.map((child) => (
                        <li key={child.id} className="mb-2">
                            👶 {child.firstName} ({child.email})
                        </li>
                    ))
                ) : (
                    <li>No children found.</li>
                )}
            </ul>

        </div>
    );
}
