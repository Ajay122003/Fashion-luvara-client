import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { useSelector } from "react-redux";
import brandLogo from "../../assets/images/logo.png";
import brandLogo2 from "../../assets/images/logo2.png";

const UserNavbar = () => {
  const cartCount = useSelector((state) => state.cart?.items?.length || 0);
  const wishlistCount = useSelector((state) => state.wishlist?.items?.length || 0);
  const categories = useSelector((state) => state.category?.items || []);
  const user = useSelector((state) => state.auth?.user || null);

  const [showSearch, setShowSearch] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);

  // ⭐ Detect mobile width (<992px)
  const [isMobileWidth, setIsMobileWidth] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileWidth(window.innerWidth < 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = () => {
    const menu = document.getElementById("mobileMenu");
    if (!menu) return;

    const bsOffcanvas = bootstrap.Offcanvas.getInstance(menu);
    if (bsOffcanvas) bsOffcanvas.hide();

    const backdrop = document.querySelector(".offcanvas-backdrop");
    if (backdrop) backdrop.remove();
  };

  return (
    <>
      {/* 🔍 SEARCH BAR */}
      <div
        className="position-fixed top-0 start-0 w-100 bg-white shadow-sm p-3"
        style={{
          zIndex: 2000,
          transition: "transform .4s ease",
          transform: showSearch ? "translateY(0)" : "translateY(-100%)",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <i
            className="bi bi-x-lg fs-4"
            role="button"
            onClick={() => setShowSearch(false)}
          ></i>

          <input
            type="text"
            className="form-control border-0 border-bottom rounded-0 shadow-none"
            placeholder="Search products…"
          />
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg bg-white py-3 shadow-sm sticky-top">
        <div className="container-fluid">
          {/* MOBILE MENU BUTTON */}
          <button
            className="btn d-lg-none"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileMenu"
          >
            <HiMenu size={25} />
          </button>

          {/* MOBILE LOGO */}
          <div className="mx-auto d-lg-none">
            <img src={brandLogo2} height="40" width="145" alt="logo" />
          </div>

          {/* MOBILE RIGHT ICONS */}
          <div className="d-lg-none d-flex align-items-center gap-3 ms-auto">
            <i
              className="bi bi-search fs-5"
              role="button"
              onClick={() => setShowSearch(true)}
            ></i>

            <Link to="/wishlist" className="text-dark position-relative fs-5">
              <i className="bi bi-heart"></i>
              {wishlistCount > 0 && (
                <span className="badge bg-dark text-white rounded-pill position-absolute top-0 start-100 translate-middle">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="text-dark position-relative fs-5">
              <i className="bi bi-bag"></i>
              {cartCount > 0 && (
                <span className="badge bg-dark text-white rounded-pill position-absolute top-0 start-100 translate-middle">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* DESKTOP NAV CONTENT */}
          <div className="collapse navbar-collapse">
            <div className="d-none d-lg-block me-4">
              <img src={brandLogo} height="85" width="100" alt="logo" />
            </div>

            {/* LEFT MENU */}
            <ul className="navbar-nav gap-4 fw-normal small">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>

              <li className="nav-item">
                <Link to="/new" className="nav-link">New</Link>
              </li>

              {/* ⭐ UPDATED CATEGORY DROPDOWN */}
              <li
                className="nav-item dropdown"
                onMouseEnter={(e) => {
                  if (!isMobileWidth) {
                    const menu = e.currentTarget.querySelector(".dropdown-menu");
                    menu.style.display = "block";
                    menu.style.opacity = 1;
                    menu.style.transform = "translateY(0)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobileWidth) {
                    const menu = e.currentTarget.querySelector(".dropdown-menu");
                    menu.style.display = "none";
                    menu.style.opacity = 0;
                    menu.style.transform = "translateY(10px)";
                  }
                }}
              >
                <span
                  className="nav-link dropdown-toggle"
                  data-bs-toggle={isMobileWidth ? "dropdown" : ""}
                  style={{ cursor: "pointer" }}
                >
                  Shop by category
                </span>

                <ul className="dropdown-menu fade">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link className="dropdown-item" to={`/categories/${cat.slug}`}>
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="nav-item">
                <Link to="/about" className="nav-link">About us</Link>
              </li>
            </ul>

            {/* RIGHT ICONS DESKTOP */}
            <div className="d-none d-lg-flex align-items-center gap-4 ms-auto fs-5">

              <i className="bi bi-search" role="button" onClick={() => setShowSearch(true)}></i>

              {user ? (
                <Link to="/profile" className="text-dark">
                  <i className="bi bi-person"></i>
                </Link>
              ) : (
                <>
                  <Link to="/register" className="small text-dark text-decoration-none ms-2">Sign up</Link>
                  <Link to="/login" className="small text-dark text-decoration-none">Sign in</Link>
                </>
              )}

              <Link to="/wishlist" className="text-dark position-relative">
                <i className="bi bi-heart"></i>
                {wishlistCount > 0 && (
                  <span className="badge bg-dark text-white rounded-pill position-absolute top-0 start-100 translate-middle">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="text-dark position-relative">
                <i className="bi bi-bag"></i>
                {cartCount > 0 && (
                  <span className="badge bg-dark text-white rounded-pill position-absolute top-0 start-100 translate-middle">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE OFFCANVAS MENU */}
      <div className="offcanvas offcanvas-start" id="mobileMenu">
        <div className="offcanvas-header">
          <button className="btn" data-bs-dismiss="offcanvas">
            <i className="bi bi-x-lg fs-3"></i>
          </button>
          <img src={brandLogo2} height="45" alt="logo" />
        </div>

        <div className="offcanvas-body">
          <Link className="d-block py-2" to="/" onClick={closeMenu}>Home</Link>
          <Link className="d-block py-2" to="/new" onClick={closeMenu}>New</Link>

          {/* ⭐ MOBILE CATEGORY DROPDOWN */}
          <div className="mt-2">
            <div
              className="d-flex justify-content-between align-items-center py-2 fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => setMobileCatOpen(!mobileCatOpen)}
            >
              <span>Shop by category</span>
              <i className={`bi ${mobileCatOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
            </div>

            <div
              className="ps-3"
              style={{
                maxHeight: mobileCatOpen ? "500px" : "0px",
                overflow: "hidden",
                transition: "max-height .35s ease",
              }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  className="d-block py-2 small"
                  to={`/categories/${cat.slug}`}
                  onClick={closeMenu}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <Link className="d-block py-2" to="/about" onClick={closeMenu}>About us</Link>

          {/* ACCOUNT SECTION */}
          <div className="position-absolute bottom-0 start-0 w-100 p-3 border-top">
            {user ? (
              <Link to="/profile" className="text-dark d-flex align-items-center gap-2" onClick={closeMenu}>
                <i className="bi bi-person"></i> {user.username}
              </Link>
            ) : (
              <>
                <Link to="/register" className="d-block py-2 text-dark" onClick={closeMenu}>Sign up</Link>
                <Link to="/login" className="d-block py-2 text-dark" onClick={closeMenu}>Sign in</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Smooth Dropdown Animation */}
      <style>{`
        .dropdown-menu {
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.25s ease;
          display: none;
        }
      `}</style>
    </>
  );
};

export default UserNavbar;
