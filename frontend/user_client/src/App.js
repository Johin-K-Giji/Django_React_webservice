import React, { useState, useEffect } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser, fetchFriends, createFriend } from './api';
import 'tailwindcss/tailwind.css';

function App() {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friendName, setFriendName] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers().then(response => setUsers(response.data));
    fetchFriends().then(response => setFriends(response.data));
  }, []);

  const handleAddUser = () => {
    createUser({ name, email, friend_ids: selectedFriends.map(friend => friend.id) })
      .then(() => {
        fetchUsers().then(response => setUsers(response.data));
        resetForm();
      });
  };

  const handleUpdateUser = () => {
    updateUser(editingUserId, { name, email, friend_ids: selectedFriends.map(friend => friend.id) })
      .then(() => {
        fetchUsers().then(response => setUsers(response.data));
        resetForm();
      });
  };

  const handleDeleteUser = (id) => {
    deleteUser(id)
      .then(() => fetchUsers().then(response => setUsers(response.data)));
  };

  const handleAddFriend = () => {
    createFriend({ name: friendName })
      .then(() => {
        fetchFriends().then(response => setFriends(response.data));
        setFriendName('');
      });
  };

  const handleSelectFriend = (friend) => {
    if (selectedFriends.includes(friend)) {
      setSelectedFriends(selectedFriends.filter(f => f.id !== friend.id));
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setSelectedFriends([]);
    setEditingUserId(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl mb-4 text-center font-bold">User Management</h1>
      
      {/* Friend Creation Form */}
      <div className="mb-4">
        <h2 className="text-lg mb-2">Add Friend</h2>
        <input
          type="text"
          value={friendName}
          onChange={(e) => setFriendName(e.target.value)}
          placeholder="Friend Name"
          className="border p-2 mr-2"
        />
        <button onClick={handleAddFriend} className="bg-blue-500 text-white p-2">Add Friend</button>
      </div>
      
      {/* User Creation/Update Form */}
      <div className="mb-4">
        <h2 className="text-lg mb-2">{editingUserId ? 'Edit User' : 'Add User'}</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border p-2 mr-2"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 mr-2"
        />
        <div className="mb-2">
          <h3 className="text-md mb-1">Select Friends:</h3>
          <div className="flex flex-wrap">
            {friends.map(friend => (
              <div
                key={friend.id}
                className={`border p-2 m-1 cursor-pointer ${selectedFriends.includes(friend) ? 'bg-green-200' : ''}`}
                onClick={() => handleSelectFriend(friend)}
              >
                {friend.name}
              </div>
            ))}
          </div>
        </div>
        {editingUserId ? (
          <button onClick={handleUpdateUser} className="bg-blue-500 text-white p-2">Update User</button>
        ) : (
          <button onClick={handleAddUser} className="bg-green-500 text-white p-2">Add User</button>
        )}
      </div>

      {/* User List */}
      <div className="mt-4">
        <h2 className="text-lg mb-2">Users List</h2>
        <ul>
          {users.map(user => (
            <li key={user.id} className="border p-2 mb-2">
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Friends: {user.friends.map(friend => friend.name).join(', ')}</p>
              <button onClick={() => {
                setEditingUserId(user.id);
                setName(user.name);
                setEmail(user.email);
                setSelectedFriends(user.friends);
              }} className="bg-yellow-500 text-white p-1 mr-2">Edit</button>
              <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 text-white p-1">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
