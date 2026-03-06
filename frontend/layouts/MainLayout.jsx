import { Outlet } from "react-router-dom";
import Navbar from "../src/components/Navbar";


function MainLayout() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <Navbar />

      <Outlet />

    </div>
  );

}

export default MainLayout;