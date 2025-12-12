import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { fetchCart } from "../../features/cart/cartSlice";

import brandLogo from "../../assets/images/logo.png";
import brandLogo2 from "../../assets/images/logo2.png";

const UserNavbar = () => {
  const dispatch = useDispatch();

  // Load cart count on page load
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const cartCount = useSelector((s) => s.cart?.items?.length ?? 0);
  const wishlistCount = useSelector((s) => s.wishlist?.items?.length ?? 0);

  const categories = useSelector((s) => s.categories?.items ?? [], shallowEqual);
  const collections = useSelector((s) => s.collections?.items ?? [], shallowEqual);
  const user = useSelector((s) => s.auth?.user ?? null, shallowEqual);

  const [showSearch, setShowSearch] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [mobileColOpen, setMobileColOpen] = useState(false);
  const [hoverCat, setHoverCat] = useState(false);
  const [hoverCol, setHoverCol] = useState(false);

  const hoverSupported = useMemo(() => {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }, []);

  const closeMenu = () => {
    const menu = document.getElementById("mobileMenu");
    if (!menu) return;

    const offcanvas = bootstrap.Offcanvas.getInstance(menu);
    if (offcanvas) offcanvas.hide();

    setTimeout(() => {
      document.querySelectorAll(".offcanvas-backdrop").forEach((b) => b.remove());
      document.body.classList.remove("modal-open", "offcanvas-open");
      document.body.style.overflow = "";
    }, 200);
  };

  const handleMobileClick = () => {
    closeMenu();
    setMobileCatOpen(false);
    setMobileColOpen(false);
  };

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
          <i className="bi bi-x-lg fs-4" role="button" onClick={() => setShowSearch(false)} />
          <input
            type="text"
            className="form-control border-0 border-bottom rounded-0 shadow-none"
            placeholder="Search products…"
          />
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="navbar navbar-expand-lg bg-white py-3 shadow-sm sticky-top">
        <div className="container-fluid">

          {/* MOBILE MENU BUTTON */}
          <button className="btn d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu">
            <HiMenu size={25} />
          </button>

          {/* MOBILE LOGO */}
          <div className="mx-auto d-lg-none">
            <img src={brandLogo2} height="40" width="145" alt="logo" />
          </div>

          {/* MOBILE RIGHT ICONS */}
          <div className="d-lg-none d-flex align-items-center gap-3 ms-auto">
            <i className="bi bi-search fs-5" role="button" onClick={() => setShowSearch(true)} />

            <Link to="/wishlist" className="text-dark position-relative fs-5">
              <i className="bi bi-heart" />
              {wishlistCount > 0 && (
                <span className="badge bg-dark text-white position-absolute top-0 start-100 translate-middle">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="text-dark position-relative fs-5">
              <i className="bi bi-bag" />
              {cartCount > 0 && (
                <span className="badge bg-dark text-white position-absolute top-0 start-100 translate-middle">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <div className="collapse navbar-collapse">
            <div className="d-none d-lg-block me-4">
              <img src={brandLogo} height="85" width="100" alt="logo" />
            </div>

            <ul className="navbar-nav gap-4 fw-normal small">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>

              <li className="nav-item">
                <Link to="/new" className="nav-link">New</Link>
              </li>

              {/* CATEGORY DROPDOWN */}
              <li
                className="nav-item dropdown"
                onMouseEnter={() => hoverSupported && setHoverCat(true)}
                onMouseLeave={() => hoverSupported && setHoverCat(false)}
              >
                <span className="nav-link dropdown-toggle">Shop by Category</span>
                <ul className={`dropdown-menu ${hoverCat ? "show" : ""}`}>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link className="dropdown-item" to={`/categories/${cat.slug}`}>
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* COLLECTION DROPDOWN */}
              <li
                className="nav-item dropdown"
                onMouseEnter={() => hoverSupported && setHoverCol(true)}
                onMouseLeave={() => hoverSupported && setHoverCol(false)}
              >
                <span className="nav-link dropdown-toggle">Shop by Collection</span>
                <ul className={`dropdown-menu ${hoverCol ? "show" : ""}`}>
                  {collections.map((col) => (
                    <li key={col.id}>
                      <Link className="dropdown-item" to={`/collections/${col.slug}`}>
                        {col.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="nav-item">
                <Link to="/about" className="nav-link">About us</Link>
              </li>
            </ul>

            {/* RIGHT SIDE (DESKTOP) */}
            <div className="d-none d-lg-flex align-items-center gap-4 ms-auto fs-5">
              <i className="bi bi-search" role="button" onClick={() => setShowSearch(true)} />

              {user ? (
                <Link to="/profile" className="text-dark">
                  <i className="bi bi-person" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="small text-dark">Sign up</Link>
                  <Link to="/login" className="small text-dark">Sign in</Link>
                </>
              )}

              <Link to="/wishlist" className="text-dark position-relative">
                <i className="bi bi-heart" />
                {wishlistCount > 0 && (
                  <span className="badge bg-dark position-absolute top-0 start-100 translate-middle">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="text-dark position-relative">
                <i className="bi bi-bag" />
                {cartCount > 0 && (
                  <span className="badge bg-dark position-absolute top-0 start-100 translate-middle">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className="offcanvas offcanvas-start" id="mobileMenu">
        <div className="offcanvas-header">
          <button className="btn" onClick={closeMenu}>
            <i className="bi bi-x-lg fs-3" />
          </button>
          <img src={brandLogo2} height="45" alt="logo" />
        </div>

        <div className="offcanvas-body">
          <Link className="d-block py-2" to="/" onClick={handleMobileClick}>Home</Link>
          <Link className="d-block py-2" to="/new" onClick={handleMobileClick}>New</Link>

          {/* Categories */}
          <div className="mt-2">
            <div
              className="d-flex justify-content-between align-items-center py-2"
              onClick={() => setMobileCatOpen((v) => !v)}
            >
              <span>Shop by Category</span>
              <i className={`bi ${mobileCatOpen ? "bi-chevron-up" : "bi-chevron-down"}`} />
            </div>

            <div
              className="ps-3"
              style={{
                maxHeight: mobileCatOpen ? "500px" : "0",
                overflow: "hidden",
                transition: "max-height .35s ease",
              }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  className="d-block py-2 small"
                  to={`/categories/${cat.slug}`}
                  onClick={handleMobileClick}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div className="mt-2">
            <div
              className="d-flex justify-content-between align-items-center py-2"
              onClick={() => setMobileColOpen((v) => !v)}
            >
              <span>Shop by Collection</span>
              <i className={`bi ${mobileColOpen ? "bi-chevron-up" : "bi-chevron-down"}`} />
            </div>

            <div
              className="ps-3"
              style={{
                maxHeight: mobileColOpen ? "500px" : "0",
                overflow: "hidden",
                transition: "max-height .35s ease",
              }}
            >
              {collections.map((col) => (
                <Link
                  key={col.id}
                  className="d-block py-2 small"
                  to={`/collections/${col.slug}`}
                  onClick={handleMobileClick}
                >
                  {col.name}
                </Link>
              ))}
            </div>
          </div>

          <Link className="d-block py-2" to="/about" onClick={handleMobileClick}>
            About us
          </Link>

          {/* USER AREA */}
          <div className="position-absolute bottom-0 start-0 w-100 p-3 border-top">
            {user ? (
              <Link
                to="/profile"
                className="text-dark d-flex align-items-center gap-2"
                onClick={handleMobileClick}
              >
                <i className="bi bi-person" /> {user.username}
              </Link>
            ) : (
              <>
                <Link className="d-block py-2 text-dark" to="/register" onClick={handleMobileClick}>
                  Sign up
                </Link>
                <Link className="d-block py-2 text-dark" to="/login" onClick={handleMobileClick}>
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserNavbar;
