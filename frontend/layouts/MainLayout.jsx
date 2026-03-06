import { Outlet } from "react-router-dom";
import Navbar from "../src/components/Navbar";


function MainLayout() {

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <Outlet />
      </div>

    </div>
  );

}

export default MainLayout;