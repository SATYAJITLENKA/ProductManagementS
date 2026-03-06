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
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

  

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold">
            Dashboard
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + New Project
          </button>

        </div>

     

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
        
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No projects yet</p>
              <p className="text-gray-400 text-sm mt-2">Create your first project to get started</p>
            </div>
          ) : (
 
            projects.map((project) => (

              <div
                key={project._id}
                onClick={() => goToProject(project._id)}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
              >

                <h3 className="text-lg font-semibold mb-2">
                  {project.name}
                </h3>

                <p className="text-gray-500">
                  {project.taskCount || 0} Tasks
                </p>

              </div>

            ))
          )}

        </div>

      </div>


      

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg w-[400px]">

            <h2 className="text-lg font-semibold mb-4">
              Create New Project
            </h2>

            <input
              type="text"
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;