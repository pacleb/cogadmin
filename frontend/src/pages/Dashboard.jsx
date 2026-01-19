import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import socketService from '../services/socket';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showNewTeamModal, setShowNewTeamModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTeams();
    socketService.connect(user?.id);

    return () => {
      socketService.disconnect();
    };
  }, [user?.id]);

  useEffect(() => {
    if (selectedTeam) {
      socketService.joinTeam(selectedTeam.id);
      fetchTeamTasks(selectedTeam.id);

      const handleTaskUpdated = (data) => {
        setTasks(prev => prev.map(t => t.id === data.id ? data : t));
        toast.success('Task updated');
      };

      const handleTaskCreated = (data) => {
        setTasks(prev => [...prev, data]);
        toast.success('New task created');
      };

      socketService.on('task-updated', handleTaskUpdated);
      socketService.on('task-created', handleTaskCreated);

      return () => {
        socketService.off('task-updated', handleTaskUpdated);
        socketService.off('task-created', handleTaskCreated);
        socketService.leaveTeam(selectedTeam.id);
      };
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      setTeams(response.data);
      if (response.data.length > 0) {
        setSelectedTeam(response.data[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch teams');
    }
  };

  const fetchTeamTasks = async (teamId) => {
    try {
      const response = await api.get(`/tasks/team/${teamId}`);
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };

  const createTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      toast.error('Team name required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/teams', { name: newTeamName });
      setTeams([...teams, response.data]);
      setNewTeamName('');
      setShowNewTeamModal(false);
      toast.success('Team created');
    } catch (error) {
      toast.error('Failed to create team');
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedTeam) {
      toast.error('Task title and team required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/tasks', {
        title: newTaskTitle,
        team_id: selectedTeam.id
      });
      socketService.emit('task-created', response.data);
      setNewTaskTitle('');
      setShowNewTaskModal(false);
      toast.success('Task created');
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, { status: newStatus });
      socketService.emit('task-updated', response.data);
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{user?.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Teams</h2>
            <div className="space-y-2 mb-6">
              {teams.map(team => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className={`w-full text-left px-3 py-2 rounded ${
                    selectedTeam?.id === team.id
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {team.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowNewTeamModal(true)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              + New Team
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {selectedTeam ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTeam.name}
                  </h2>
                  <button
                    onClick={() => setShowNewTaskModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    + New Task
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['todo', 'in_progress', 'in_review', 'done'].map(status => (
                    <div key={status} className="bg-white rounded-lg shadow p-4">
                      <h3 className="font-bold text-gray-900 mb-4 capitalize">
                        {status.replace('_', ' ')}
                      </h3>
                      <div className="space-y-2">
                        {tasks
                          .filter(t => t.status === status)
                          .map(task => (
                            <div
                              key={task.id}
                              className="bg-gray-50 p-3 rounded border border-gray-200 cursor-move hover:shadow"
                            >
                              <p className="font-medium text-gray-900">
                                {task.title}
                              </p>
                              <select
                                value={task.status}
                                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                className="mt-2 w-full text-sm border rounded px-2 py-1"
                              >
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="in_review">In Review</option>
                                <option value="done">Done</option>
                              </select>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No teams yet. Create one to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Team Modal */}
      {showNewTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Team</h3>
            <form onSubmit={createTeam}>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Team name"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTeamModal(false)}
                  className="flex-1 bg-gray-200 text-gray-900 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Task</h3>
            <form onSubmit={createTask}>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="flex-1 bg-gray-200 text-gray-900 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
