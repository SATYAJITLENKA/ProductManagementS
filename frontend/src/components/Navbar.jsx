import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {

  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (

    <div className="bg-white shadow-sm border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center h-16">

          {/* Logo */}

          <Link
            to="/dashboard"
            className="flex items-center gap-3 group"
          >
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg group-hover:from-blue-700 group-hover:to-indigo-700 transition">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TaskManager
            </span>
          </Link>

          {/* User Section */}

          <div className="flex items-center gap-4">

            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
              
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>

              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500">{user?.email || ""}</p>
              </div>

            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Navbar;
