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

    <div className="bg-white shadow">

      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">



        <Link
          to="/dashboard"
          className="text-xl font-bold text-blue-600"
        >
          TaskManager
        </Link>

 

        <div className="flex items-center gap-4">

          <div className="text-sm text-gray-600">

            <p className="font-medium">{user?.name || "User"}</p>
            <p className="text-xs">{user?.email || ""}</p>

          </div>

          <button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm cursor-pointer"
          >
            Logout
          </button>

        </div>

      </div>

    </div>

  );

}

export default Navbar;