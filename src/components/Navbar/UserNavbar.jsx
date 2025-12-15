import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import { fetchCart } from "../../features/cart/cartSlice";
import { fetchWishlist } from "../../features/wishlist/wishlistSlice";

import brandLogo from "../../assets/images/logo.png";
import brandLogo2 from "../../assets/images/logo2.png";

const UserNavbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  /* ================= LOAD CART + WISHLIST ================= */
  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }, [dispatch]);

  /* ================= AUTO CLOSE OFFCANVAS ON ROUTE CHANGE (🔥 FIX) ================= */
  useEffect(() => {
    const menu = document.getElementById("mobileMenu");
    if (!menu) return;

    const offcanvas =
      window.bootstrap?.Offcanvas.getInstance(menu);

    if (offcanvas) {
      offcanvas.hide();
    }

    setMobileCatOpen(false);
    setMobileColOpen(false);
  }, [location.pathname]);

  /* ================= REDUX STATE ================= */
  const cartCount = useSelector((s) => s.cart?.items?.length ?? 0);
  const wishlistCount = useSelector((s) => s.wishlist?.items?.length ?? 0);

  const categories = useSelector(
    (s) => s.categories?.items ?? [],
    shallowEqual
  );
  const collections = useSelector(
    (s) => s.collections?.items ?? [],
    shallowEqual
  );
  const user = useSelector((s) => s.auth?.user ?? null, shallowEqual);

  /* ================= UI STATE ================= */
  const [showSearch, setShowSearch] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [mobileColOpen, setMobileColOpen] = useState(false);
  const [hoverCat, setHoverCat] = useState(false);
  const [hoverCol, setHoverCol] = useState(false);

  /* ================= HOVER SUPPORT ================= */
  const hoverSupported = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    []
  );

  /* ================= MANUAL CLOSE (X BUTTON / LINK CLICK) ================= */
  const closeMenu = () => {
    const menu = document.getElementById("mobileMenu");
    if (!menu) return;

    const offcanvas =
      window.bootstrap?.Offcanvas.getOrCreateInstance(menu);

    offcanvas.hide();

    setMobileCatOpen(false);
    setMobileColOpen(false);
  };

  return (
    <>
      {/* ================= SEARCH BAR ================= */}
      <div
        className="position-fixed top-0 start-0 w-100 bg-white shadow-sm p-3"
        style={{
          zIndex: 2000,
          transform: showSearch ? "translateY(0)" : "translateY(-100%)",
          transition: "transform .4s ease",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <i
            className="bi bi-x-lg fs-4"
            role="button"
            onClick={() => setShowSearch(false)}
          />
          <input
            className="form-control border-0 border-bottom rounded-0 shadow-none"
            placeholder="Search products…"
          />
        </div>
      </div>

      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg bg-white py-3 shadow-sm sticky-top">
        <div className="container-fluid">
          {/* MOBILE MENU */}
          <button
            className="btn d-lg-none"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileMenu"
          >
            <HiMenu size={25} />
          </button>

          {/* MOBILE LOGO */}
          <div className="mx-auto d-lg-none">
            <img src={brandLogo2} height="40" alt="logo" />
          </div>

          {/* MOBILE ICONS */}
          <div className="d-lg-none d-flex align-items-center gap-3 ms-auto fs-5">
            <i
              className="bi bi-search"
              role="button"
              onClick={() => setShowSearch(true)}
            />

            <Link to="/wishlist" className="position-relative text-dark">
              <i className="bi bi-heart" />
              {wishlistCount > 0 && (
                <span className="badge bg-dark position-absolute top-0 start-100 translate-middle">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="position-relative text-dark">
              <i className="bi bi-bag" />
              {cartCount > 0 && (
                <span className="badge bg-dark position-absolute top-0 start-100 translate-middle">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <div className="collapse navbar-collapse">
            <div className="d-none d-lg-block me-4">
              <img src={brandLogo} height="85" alt="logo" />
            </div>

            <ul className="navbar-nav gap-4 small">
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/new" className="nav-link">New</Link></li>

              <li
                className="nav-item dropdown"
                onMouseEnter={() => hoverSupported && setHoverCat(true)}
                onMouseLeave={() => hoverSupported && setHoverCat(false)}
              >
                <span className="nav-link dropdown-toggle">
                  Shop by Category
                </span>
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

              <li
                className="nav-item dropdown"
                onMouseEnter={() => hoverSupported && setHoverCol(true)}
                onMouseLeave={() => hoverSupported && setHoverCol(false)}
              >
                <span className="nav-link dropdown-toggle">
                  Shop by Collection
                </span>
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

              <li><Link to="/about" className="nav-link">About us</Link></li>
            </ul>

            {/* DESKTOP RIGHT */}
            <div className="ms-auto d-none d-lg-flex gap-4 fs-5">
              <i
                className="bi bi-search"
                role="button"
                onClick={() => setShowSearch(true)}
              />

              {user ? (
                <Link to="/profile" className="text-dark">
                  <i className="bi bi-person" />
                </Link>
              ) : (
                <>
                  <Link to="/login" className="small text-dark">Sign in</Link>
                  <Link to="/register" className="small text-dark">Sign up</Link>
                </>
              )}

              <Link to="/wishlist" className="position-relative text-dark">
                <i className="bi bi-heart" />
                {wishlistCount > 0 && (
                  <span className="badge bg-dark position-absolute top-0 start-100 translate-middle">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="position-relative text-dark">
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

      {/* ================= MOBILE OFFCANVAS ================= */}
      <div className="offcanvas offcanvas-start" id="mobileMenu">
        <div className="offcanvas-header">
          <button className="btn" onClick={closeMenu}>
            <i className="bi bi-x-lg fs-3" />
          </button>
          <img src={brandLogo2} height="45" alt="logo" />
        </div>

        <div className="offcanvas-body">
          <Link to="/" className="d-block py-2" onClick={closeMenu}>Home</Link>
          <Link to="/new" className="d-block py-2" onClick={closeMenu}>New</Link>

          {/* CATEGORY */}
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
                  onClick={closeMenu}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* COLLECTION */}
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
                  onClick={closeMenu}
                >
                  {col.name}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/about" className="d-block py-2" onClick={closeMenu}>
            About us
          </Link>

          {/* USER AREA */}
          <div className="position-absolute bottom-0 start-0 w-100 p-3 border-top">
            {user ? (
              <Link
                to="/profile"
                className="text-dark d-flex align-items-center gap-2"
                onClick={closeMenu}
              >
                <i className="bi bi-person-circle" /> {user.username}
              </Link>
            ) : (
              <>
                <Link className="d-block py-2 text-dark" to="/register" onClick={closeMenu}>
                  Sign up
                </Link>
                <Link className="d-block py-2 text-dark" to="/login" onClick={closeMenu}>
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
