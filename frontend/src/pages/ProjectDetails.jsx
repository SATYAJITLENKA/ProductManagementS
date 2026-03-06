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

    if (!newTask.title) return;

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

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-6">

          <div>

            <Link to="/dashboard" className="text-blue-600 text-sm">
              ← Back
            </Link>

            <h1 className="text-2xl font-bold mt-2">
              {project ? project.name : "Loading..."}
            </h1>

          </div>

          <button
            onClick={() => setShowTaskModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Task
          </button>

        </div>

        {/* FILTERS */}

        <div className="bg-white p-4 rounded-xl shadow mb-6 flex items-end gap-4">

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
            className="ml-auto bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
          >
            Clear
          </button>

        </div>

  

        <div className="space-y-4">

          {loading ? (
            // Show skeletons
            <>
              <TaskSkeleton />
              <TaskSkeleton />
              <TaskSkeleton />
              <TaskSkeleton />
              <TaskSkeleton />
            </>
          ) : filteredTasks.length === 0 ? (
            // Show empty state
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <p className="text-gray-500 text-lg">No tasks found</p>
              <p className="text-gray-400 text-sm mt-2">
                {tasks.length === 0 
                  ? "Create your first task to get started" 
                  : "Try adjusting your filters"}
              </p>
            </div>
          ) : (
            // Show tasks
            filteredTasks.map((task) => (

              <div
                key={task._id}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              >

              {editingTaskId === task._id ? (

                <div className="flex flex-col gap-2 w-full">

                  <input
                    name="title"
                    value={editData.title}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                  />

                  <select
                    name="status"
                    value={editData.status}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                  >
                    <option>Todo</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>

                  <select
                    name="priority"
                    value={editData.priority}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>

                  <div className="flex gap-3 mt-2">

                    <button
                      onClick={() => handleSave(task._id)}
                      className="text-green-600"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingTaskId(null)}
                      className="text-gray-600"
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              ) : (

                <>
                  <div>

                    <h3 className="font-semibold">
                      {task.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Status: {task.status}
                    </p>

                    <p className="text-sm text-gray-500">
                      Priority: {task.priority}
                    </p>

                  </div>

                  <div className="flex gap-3">

                    <button
                      onClick={() => startEdit(task)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>

                  </div>
                </>

              )}

            </div>

          )))}

        </div>

      </div>



      {showTaskModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg w-[400px]">

            <h2 className="text-lg font-semibold mb-4">
              Add New Task
            </h2>

            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={newTask.title}
              onChange={handleNewTaskChange}
              className="w-full border p-2 rounded mb-3"
            />

            <select
              name="status"
              value={newTask.status}
              onChange={handleNewTaskChange}
              className="w-full border p-2 rounded mb-3"
            >
              <option>Todo</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>

            <select
              name="priority"
              value={newTask.priority}
              onChange={handleNewTaskChange}
              className="w-full border p-2 rounded mb-4"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-600 text-white rounded"
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