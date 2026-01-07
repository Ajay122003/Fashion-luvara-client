import { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { fetchCart } from "../../features/cart/cartSlice";
import { fetchWishlist } from "../../features/wishlist/wishlistSlice";
import storage from "../../utils/storage";
import brandLogo from "../../assets/images/logo3.png";
import brandLogo2 from "../../assets/images/logo4.jpeg";
import SearchModal from "../Search/SearchModal";





const UserNavbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const token = storage.getUserToken();

  /* ================= LOAD CART + WISHLIST ================= */
  
  useEffect(() => {
  if (token) {
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }
}, [dispatch, token]);



  /* ================= AUTO CLOSE OFFCANVAS ON ROUTE CHANGE ( FIX) ================= */
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

  /* ================= SEARCH BAR ================= */

  const handleSearchSubmit = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    if (!searchText.trim()) return;

    setShowSearch(false);
    navigate(`/search?q=${searchText}`);
    setSearchText("");
  }
};


  return (
    <>

     {/* ================= SEARCH BAR ================= */}
    <SearchModal
      show={showSearch}
      onClose={() => setShowSearch(false)}
    />
     
     

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
            <img src={brandLogo2} height="40" width="145" alt="logo" />
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
            <div className=" d-none d-lg-block me-4">
              <img src={brandLogo} height="120" width="110" alt="logo" />
            </div>

            <ul className="navbar-nav gap-4 small">
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/new" className="nav-link">Customar support</Link></li>

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
            <div className="ms-auto  d-none d-lg-flex gap-4 fs-5">
              <i
                className="bi bi-search"
                role="button"
                onClick={() => setShowSearch(true)}
              />

              {/* USER ICON / AUTH */}
<div className="nav-item dropdown">
  {user ? (
    /* LOGGED IN */
    <Link
      to="/profile"
      className="text-dark d-flex align-items-center"
    >
      <i className="bi bi-person fs-5" />
    </Link>
  ) : (
    /* NOT LOGGED IN */
    <>
      <span
        className="nav-link dropdown-toggle text-dark"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ cursor: "pointer" }}
      >
        <i className="bi bi-person fs-5" />
      </span>

      <ul className="dropdown-menu dropdown-menu-end shadow-sm">
        <li>
          <Link className="dropdown-item" to="/login">
            Sign in
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/register">
            Sign up
          </Link>
        </li>
      </ul>
    </>
  )}
</div>


              <Link to="/wishlist" className="position-relative text-dark">
                <i className="bi bi-heart" />
                {wishlistCount > 0 && (
                  <span className="badge bg-dark position-absolute top-0 start-100 translate-middle">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="  position-relative text-dark">
                <i className="bi bi-bag" />
                {cartCount > 0 && (
                  <span className="  badge bg-dark position-absolute top-0 start-100 translate-middle">
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
        <div className="offcanvas-header border-bottom">
          <button className="btn" onClick={closeMenu}>
            <i className="bi bi-x-lg fs-3" />
          </button>
          <img src={brandLogo2} height="45" alt="logo" />
        </div>

        <div className="offcanvas-body">
          <Link to="/" className="d-block text-dark py-2 text-decoration-none" onClick={closeMenu}>Home</Link>
          <Link to="/new" className="d-block text-dark py-2 text-decoration-none" onClick={closeMenu}>Customar support</Link>

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
                  className="d-block py-2 small text-decoration-none"
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
                  className="d-block py-2 small text-decoration-none"
                  to={`/collections/${col.slug}`}
                  onClick={closeMenu}
                >
                  {col.name}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/about" className="d-block text-dark py-2 text-decoration-none" onClick={closeMenu}>
            About us
          </Link>
          <div className="position-fixed bottom-5 start-0 p-3 mb-5" style={{ zIndex: 1050 }}>
  <a
    href="https://www.instagram.com/your_username/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-dark fs-3"
  >
    <i className="bi bi-instagram"></i>
  </a>
</div>

          

          {/* USER AREA */}
          <div className="position-absolute bottom-0 start-0 w-100 p-3 border-top">
            {user ? (
              <Link
                to="/profile"
                className="text-dark d-flex align-items-center gap-2 text-decoration-none"
                onClick={closeMenu}
              >
                <i className="bi bi-person-circle" /> {user.username}
              </Link>
            ) : (
              <>
                <Link className="d-block py-2 text-dark text-decoration-none" to="/register" onClick={closeMenu}>
                  Sign up
                </Link>
                <Link className="d-block py-2 text-dark text-decoration-none" to="/login" onClick={closeMenu}>
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