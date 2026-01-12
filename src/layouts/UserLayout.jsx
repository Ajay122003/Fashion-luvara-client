import { Outlet, useLocation } from "react-router-dom";
import UserNavbar from "../components/Navbar/UserNavbar";
import Footer from "../components/Footer/Footer";
import ThemeToggle from "../components/ThemeToggle";
import CartOffcanvas from "../components/Cart/CartOffcanvas";
import { Toaster } from "react-hot-toast";

const UserLayout = () => {
  const location = useLocation();

  // 🔥 Home page check
  const isHomePage = location.pathname === "/";

  return (
    <>
      {/* 🔥 TOAST ROOT */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* 🔥 THEME TOGGLE STYLE */}
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
        {/* 🔥 THEME TOGGLE – HOME PAGE ONLY */}
        {isHomePage && (
          <div className="theme-toggle-wrapper">
            <ThemeToggle />
          </div>
        )}

        <UserNavbar />

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>

      {/*  SIDE CART */}
      <CartOffcanvas />
    </>
  );
};

export default UserLayout;
