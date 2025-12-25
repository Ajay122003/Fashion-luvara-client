import { Outlet } from "react-router-dom";
import UserNavbar from "../components/Navbar/UserNavbar";
import Footer from "../components/Footer/Footer";
import ThemeToggle from "../components/ThemeToggle";
import CartOffcanvas from "../components/Cart/CartOffcanvas"; // 🔥 ADD THIS

const UserLayout = () => {
  return (
    <>
      {/* CSS INSIDE JSX */}
      <style>{`
        .theme-toggle-wrapper {
          position: fixed;
          top: 90px;
          right: 20px;
          z-index: 3000;
        }

        @media (max-width: 768px) {
          .theme-toggle-wrapper {
            top: auto;
            bottom: 20px;
            right: 16px;
          }
        }
      `}</style>

      <div className="min-h-screen flex flex-col">

        {/* GLOBAL THEME TOGGLE */}
        <div className="theme-toggle-wrapper">
          <ThemeToggle />
        </div>

        {/* NAVBAR */}
        <UserNavbar />

        {/* PAGE CONTENT */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* FOOTER */}
        <Footer />
      </div>

      {/* 🔥 GLOBAL SIDE CART (OFFCANVAS) */}
      <CartOffcanvas />
    </>
  );
};

export default UserLayout;
