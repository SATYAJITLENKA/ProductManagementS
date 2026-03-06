import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Dropdown from "../components/Dropdown";
import TaskSkeleton from "../components/TaskSkeleton";

import { getProject } from "../api/projectApi";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from "../api/taskApi";

function ProjectDetails() {

  const { id } = useParams();

  const [project, setProject] = useState(null);

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [editingTaskId, setEditingTaskId] = useState(null);

  const [editData, setEditData] = useState({
    title: "",
    status: "",
    priority: ""
  });

  const [showTaskModal, setShowTaskModal] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    status: "Todo",
    priority: "Medium"
  });

  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        const [projectRes, tasksRes] = await Promise.all([
          getProject(id),
          getTasks(id)
        ]);

        setProject(projectRes.data);
        setTasks(tasksRes.data);

      } catch (error) {

        console.error("Error fetching data:", error);
        alert("Failed to load project data. Please check if the project exists.");

      } finally {

        setLoading(false);

      }

    };

    fetchData();

  }, [id]);

  const handleAddTask = async () => {

    if (!newTask.title.trim()) return;

    try {

      const res = await createTask({
        ...newTask,
        project: id
      });

      setTasks([...tasks, res.data]);

      setNewTask({
        title: "",
        status: "Todo",
        priority: "Medium"
      });

      setShowTaskModal(false);

    } catch (error) {

      console.error(error);

    }

  };

  const handleNewTaskChange = (e) => {

    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value
    });

  };

  const handleDelete = async (taskId) => {

    if (!confirm("Are you sure you want to delete this task?")) return;

    try {

      await deleteTask(taskId);

      setTasks(tasks.filter(task => task._id !== taskId));

    } catch (error) {

      console.error(error);

    }

  };

  const startEdit = (task) => {

    setEditingTaskId(task._id);

    setEditData({
      title: task.title,
      status: task.status,
      priority: task.priority
    });

  };

  const handleEditChange = (e) => {

    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });

  };

  const handleSave = async (taskId) => {

    try {

      const res = await updateTask(taskId, editData);

      setTasks(
        tasks.map(task =>
          task._id === taskId ? res.data : task
        )
      );

      setEditingTaskId(null);

    } catch (error) {

      console.error(error);

    }

  };

  const filteredTasks = tasks.filter((task) => {

    if (statusFilter !== "All" && task.status !== statusFilter) {
      return false;
    }

    if (priorityFilter !== "All" && task.priority !== priorityFilter) {
      return false;
    }

    return true;

  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Todo": return "bg-gray-100 text-gray-700";
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Done": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "bg-green-100 text-green-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "High": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">

          <div>

            <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 mb-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">
              {project ? project.name : "Loading..."}
            </h1>

          </div>

          <button
            onClick={() => setShowTaskModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>

        </div>

        {/* FILTERS */}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
          
          <div className="flex flex-wrap items-end gap-4">

            <Dropdown
              label="Status"
              options={["All", "Todo", "In Progress", "Done"]}
              value={statusFilter}
              onChange={setStatusFilter}
            />

            <Dropdown
              label="Priority"
              options={["All", "Low", "Medium", "High"]}
              value={priorityFilter}
              onChange={setPriorityFilter}
            />

            <button
              onClick={() => {
                setStatusFilter("All");
                setPriorityFilter("All");
              }}
              className="ml-auto bg-gray-100 hover:bg-gray-200 px-6 py-2.5 rounded-lg transition font-medium text-gray-700"
            >
              Clear
            </button>

          </div>

        </div>

        {/* TASK LIST */}

        <div className="space-y-3">

          {loading ? (
            <>
              <TaskSkeleton />
              <TaskSkeleton />
              <TaskSkeleton />
              <TaskSkeleton />
              <TaskSkeleton />
            </>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-6">
                {tasks.length === 0 
                  ? "Create your first task to get started" 
                  : "Try adjusting your filters"}
              </p>
              {tasks.length === 0 && (
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Task
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => (

              <div
                key={task._id}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
              >

              {editingTaskId === task._id ? (

                <div className="space-y-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                    <input
                      name="title"
                      value={editData.title}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        name="status"
                        value={editData.status}
                        onChange={handleEditChange}
                        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>Todo</option>
                        <option>In Progress</option>
                        <option>Done</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        name="priority"
                        value={editData.priority}
                        onChange={handleEditChange}
                        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">

                    <button
                      onClick={() => setEditingTaskId(null)}
                      className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => handleSave(task._id)}
                      className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                    >
                      Save
                    </button>

                  </div>

                </div>

              ) : (

                <div className="flex justify-between items-start">
                  
                  <div className="flex-1">

                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {task.title}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        Status: {task.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        Priority: {task.priority}
                      </span>
                    </div>

                  </div>

                  <div className="flex gap-2 ml-4">

                    <button
                      onClick={() => startEdit(task)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit task"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete task"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                  </div>
                  
                </div>

              )}

            </div>

          )))}

        </div>

      </div>

      {/* ADD TASK MODAL */}

      {showTaskModal && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white p-8 rounded-2xl w-full shadow-2xl transform transition-all" style={{ maxWidth: '600px' }}>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Add New Task
              </h2>
            </div>

            <div className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={handleNewTaskChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={newTask.status}
                    onChange={handleNewTaskChange}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option>Todo</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    name="priority"
                    value={newTask.priority}
                    onChange={handleNewTaskChange}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

              </div>

            </div>

            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setNewTask({
                    title: "",
                    status: "Todo",
                    priority: "Medium"
                  });
                }}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleAddTask}
                disabled={!newTask.title.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-blue-500/30"
              >
                Add Task
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default ProjectDetails;
