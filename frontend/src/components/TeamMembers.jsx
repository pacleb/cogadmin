import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const TeamMembers = ({ teamId, onClose }) => {
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [teamId]);

  const fetchMembers = async () => {
    try {
      const response = await api.get(`/teams/${teamId}/members`);
      setMembers(response.data);
    } catch (error) {
      toast.error('Failed to fetch members');
    }
  };

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      const response = await api.get(`/users/search/${query}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const addMember = async (userId) => {
    setLoading(true);
    try {
      await api.post(`/teams/${teamId}/members`, { user_id: userId });
      setSearchQuery('');
      setUsers([]);
      setSelectedUser(null);
      fetchMembers();
      toast.success('Member added');
    } catch (error) {
      toast.error('Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (userId) => {
    if (!confirm('Remove this member from team?')) return;

    try {
      await api.delete(`/teams/${teamId}/members/${userId}`);
      fetchMembers();
      toast.success('Member removed');
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-bold text-gray-900">Team Members</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchUsers(e.target.value);
            }}
            placeholder="Search users..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 mb-2"
          />
          {users.length > 0 && (
            <div className="border border-gray-300 rounded max-h-40 overflow-y-auto">
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => addMember(user.id)}
                  disabled={loading || members.find(m => m.id === user.id)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0 disabled:opacity-50"
                >
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-gray-900">Members</h3>
          {members.map(member => (
            <div
              key={member.id}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <div>
                <p className="font-medium text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
              {member.role !== 'owner' && (
                <button
                  onClick={() => removeMember(member.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
