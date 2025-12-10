import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { useSelector } from "react-redux";
// import brandLogo from "../../assets/images/logo.jpg";





const UserNavbar = () => {
  const cartCount = useSelector((state) => state.cart?.items?.length || 0);
  const wishlistCount = useSelector((state) => state.wishlist?.items?.length || 0);
  const categories = useSelector((state) => state.category?.items || []);
  const user = useSelector((state) => state.auth?.user || null);

  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      {/* SEARCH BAR */}
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
            <img src="/logo192.png" height="45" alt="logo" />
          </div>

          {/* MOBILE RIGHT ICONS */}
          <div className="d-lg-none d-flex align-items-center gap-3 ms-auto">

            <i
              className="bi bi-search fs-5"
              role="button"
              onClick={() => setShowSearch(true)}
            ></i>

            {/* WISHLIST */}
            <Link to="/wishlist" className="text-dark position-relative fs-5">
              <i className="bi bi-heart"></i>
              {wishlistCount > 0 && (
                <span className="badge bg-dark text-white rounded-pill position-absolute top-0 start-100 translate-middle">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* CART */}
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

            {/* DESKTOP LOGO LEFT SIDE */}
            <div className="d-none d-lg-block me-4">
              <img src="/logo192.png" height="55" alt="logo" />
            </div>

            {/* LEFT MENU */}
            <ul className="navbar-nav gap-4 fw-normal small">

              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>

              <li className="nav-item">
                <Link to="/new" className="nav-link">New</Link>
              </li>

              {/* CATEGORY DROPDOWN */}
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  style={{ cursor: "pointer" }}
                >
                  Shop by category
                </span>

                <ul className="dropdown-menu fade">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link className="dropdown-item" to={`/category/${cat.id}`}>
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

            {/* RIGHT ICONS (DESKTOP) */}
            <div className="d-none d-lg-flex align-items-center gap-4 ms-auto fs-5">

              {/* SEARCH */}
              <i
                className="bi bi-search"
                role="button"
                onClick={() => setShowSearch(true)}
              ></i>

              {/* USER → LOGIN / REGISTER / PROFILE */}
              {user ? (
                <Link to="/profile" className="text-dark">
                  <i className="bi bi-person"></i>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="small text-dark text-decoration-none">
                    Login
                  </Link>
                  <Link to="/register" className="small text-dark text-decoration-none ms-2">
                    Register
                  </Link>
                </>
              )}

              {/* WISHLIST */}
              <Link to="/wishlist" className="text-dark position-relative">
                <i className="bi bi-heart"></i>
                {wishlistCount > 0 && (
                  <span className="badge bg-dark text-white rounded-pill position-absolute top-0 start-100 translate-middle">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* CART */}
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
          <img src="/logo192.png" height="45" alt="logo" />
        </div>

        <div className="offcanvas-body">

          <Link className="d-block py-2" to="/" data-bs-dismiss="offcanvas">
            Home
          </Link>

          <Link className="d-block py-2" to="/new" data-bs-dismiss="offcanvas">
            New
          </Link>

          {/* CATEGORY LISTING MOBILE */}
          {categories.map((cat) => (
            <Link
              key={cat.id}
              className="d-block py-2"
              to={`/category/${cat.id}`}
              data-bs-dismiss="offcanvas"
            >
              {cat.name}
            </Link>
          ))}

          <Link className="d-block py-2" to="/about" data-bs-dismiss="offcanvas">
            About us
          </Link>

          {/* ACCOUNT SECTION */}
          <div className="position-absolute bottom-0 start-0 w-100 p-3 border-top">
            {user ? (
              <Link to="/profile" className="text-dark d-flex align-items-center gap-2">
                <i className="bi bi-person"></i> {user.username}
              </Link>
            ) : (
              <>
                <Link to="/login" className="d-block py-2 text-dark">Login</Link>
                <Link to="/register" className="d-block py-2 text-dark">Register</Link>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default UserNavbar;
