import axios from 'axios';

const apiUrl = 'http://localhost:8000/api/';

export const fetchUsers = () => axios.get(`${apiUrl}users/`);
export const createUser = (userData) => axios.post(`${apiUrl}users/`, userData);
export const updateUser = (userId, userData) => axios.put(`${apiUrl}users/${userId}/`, userData);
export const deleteUser = (userId) => axios.delete(`${apiUrl}users/${userId}/`);

export const fetchFriends = () => axios.get(`${apiUrl}friends/`);
export const createFriend = (friendData) => axios.post(`${apiUrl}friends/`, friendData);
