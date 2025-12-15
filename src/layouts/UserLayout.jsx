import { Outlet } from "react-router-dom";
import UserNavbar from "../components/Navbar/UserNavbar";
import Footer from "../components/Footer/Footer";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* NAVBAR */}
      <UserNavbar />

      {/* PAGE CONTENT */}
      <main className="flex-1">
        <Outlet />
        
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
};

export default UserLayout;
