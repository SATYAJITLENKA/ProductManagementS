import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject } from "../api/projectApi";
import ProjectSkeleton from "../components/ProjectSkeleton";

function Dashboard() {

  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(true);

 useEffect(() => {

  const fetchProjects = async () => {

    try {

      setLoading(true);

      const res = await getProjects();
      setProjects(res.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  fetchProjects();

}, []);

  const goToProject = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  // CREATE PROJECT

  const handleCreateProject = async () => {

    if (!projectName.trim()) return;

    try {

      const res = await createProject({ name: projectName });

      setProjects([...projects, res.data]);

      setProjectName("");
      setShowModal(false);

    } catch (error) {

      console.error(error);
      alert("Failed to create project");

    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Projects
            </h1>
            <p className="text-gray-600 mt-1">Manage and organize your projects</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>

        </div>

        {/* Project Grid */}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {loading ? (
            <>
              <ProjectSkeleton />
              <ProjectSkeleton />
              <ProjectSkeleton />
              <ProjectSkeleton />
              <ProjectSkeleton />
              <ProjectSkeleton />
            </>
          ) : projects.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-500 mb-6">Create your first project to get started</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Project
                </button>
              </div>
            </div>
          ) : (
            projects.map((project) => (

              <div
                key={project._id}
                onClick={() => goToProject(project._id)}
                className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 border border-gray-200 hover:border-blue-300 transform hover:-translate-y-1"
              >

                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-100 transition">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  {project.name}
                </h3>

                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm font-medium">{project.taskCount || 0} Tasks</span>
                </div>

              </div>

            ))
          )}

        </div>

      </div>


      {/* CREATE PROJECT MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl transform transition-all">

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Project
              </h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
              <input
                type="text"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => {
                  setShowModal(false);
                  setProjectName("");
                }}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateProject}
                disabled={!projectName.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-blue-500/30"
              >
                Create Project
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;
