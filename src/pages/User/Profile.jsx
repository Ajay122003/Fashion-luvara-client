import { useEffect, useState } from "react";
import {
  getMe,
  updateProfile,
  logoutUser,
} from "../../api/auth";
import {
  getAddresses,
  addAddress,
  deleteAddress,
} from "../../api/address";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import storage from "../../utils/storage";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import AOS from "aos";
import "aos/dist/aos.css";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");

  const [addresses, setAddresses] = useState([]);
  const [showAddrForm, setShowAddrForm] = useState(false);

  const [addrForm, setAddrForm] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "",
    full_address: "",
  });

  const [loading, setLoading] = useState(true);

  /* ================= AOS INIT ================= */
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const me = await getMe();
      setProfile(me);
      setUsername(me.username);

      const addr = await getAddresses();
      setAddresses(addr);
    } catch {
      storage.clearUserToken();
      dispatch(logout());
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  /* ================= PROFILE UPDATE ================= */
  const saveProfile = async () => {
    if (!username.trim()) return toast.error("Username required");
    try {
      await updateProfile({ username });
      toast.success("Profile updated");
      loadAll();
    } catch {
      toast.error("Update failed");
    }
  };

  /* ================= ADDRESS ADD ================= */
  const saveAddress = async () => {
    const { name, phone, pincode, city, full_address } = addrForm;
    if (!name || !phone || !pincode || !city || !full_address) {
      return toast.error("Fill all address fields");
    }

    try {
      await addAddress(addrForm);
      toast.success("Address added");
      setAddrForm({
        name: "",
        phone: "",
        pincode: "",
        city: "",
        full_address: "",
      });
      setShowAddrForm(false);
      loadAll();
    } catch {
      toast.error("Failed to add address");
    }
  };

  /* ================= ADDRESS DELETE ================= */
  const removeAddress = async (id) => {
    try {
      await deleteAddress(id);
      toast.success("Address removed");
      loadAll();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      storage.clearUserToken();
      dispatch(logout());
      navigate("/login", { replace: true });
      window.location.reload();
    }
  };

  if (loading)
    return <p className="text-center py-5">Loading...</p>;

  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold">My Account</h3>

      <div className="row g-4">
        {/* ================= LEFT : PROFILE ================= */}
        <div className="col-md-4" data-aos="fade-right">
          <div className="card shadow-sm p-4 rounded-4 text-center">
            <i className="bi bi-person-circle fs-1 mb-2"></i>

            <h5 className="fw-bold mb-0">{profile.username}</h5>
            <p className="text-muted small">{profile.email}</p>

            <span
              className={`badge px-3 py-2 ${
                profile.is_email_verified
                  ? "bg-success"
                  : "bg-warning"
              }`}
            >
              <i
                className={`bi ${
                  profile.is_email_verified
                    ? "bi-patch-check-fill"
                    : "bi-exclamation-circle-fill"
                } me-1`}
              ></i>
              {profile.is_email_verified
                ? "Email Verified"
                : "Email Not Verified"}
            </span>

            <hr />

            <label className="form-label fw-semibold text-start w-100">
              <i className="bi bi-pencil-square me-1"></i>
              Update Username
            </label>

            <input
              className="form-control mb-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <button
              className="btn btn-dark w-100 mb-2"
              onClick={saveProfile}
            >
              <i className="bi bi-save me-1"></i>
              Save Profile
            </button>

            <button
              className="btn btn-outline-danger w-100"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              Sign Out
            </button>
          </div>
        </div>

        {/* ================= RIGHT : ADDRESSES ================= */}
        <div className="col-md-8">
          <div
            className="d-flex justify-content-between align-items-center mb-3"
            data-aos="fade-up"
          >
            <h5 className="fw-bold mb-0">
              <i className="bi bi-geo-alt-fill me-1"></i>
              Saved Addresses
            </h5>

            <button
              className="btn btn-sm btn-dark"
              onClick={() => setShowAddrForm(!showAddrForm)}
            >
              <i
                className={`bi ${
                  showAddrForm ? "bi-x-lg" : "bi-plus-lg"
                } me-1`}
              ></i>
              {showAddrForm ? "Close" : "Add Address"}
            </button>
          </div>

          {/* ADD ADDRESS FORM */}
          {showAddrForm && (
            <div
              className="card shadow-sm p-4 mb-3 rounded-4"
              data-aos="fade-down"
            >
              <div className="row g-3">
                <input
                  className="form-control"
                  placeholder=" Name"
                  onChange={(e) =>
                    setAddrForm({ ...addrForm, name: e.target.value })
                  }
                />
                <input
                  className="form-control"
                  placeholder=" Phone"
                  onChange={(e) =>
                    setAddrForm({ ...addrForm, phone: e.target.value })
                  }
                />
                <input
                  className="form-control"
                  placeholder=" Pincode"
                  onChange={(e) =>
                    setAddrForm({ ...addrForm, pincode: e.target.value })
                  }
                />
                <input
                  className="form-control"
                  placeholder=" City"
                  onChange={(e) =>
                    setAddrForm({ ...addrForm, city: e.target.value })
                  }
                />
                <textarea
                  className="form-control"
                  placeholder=" Full Address"
                  rows={2}
                  onChange={(e) =>
                    setAddrForm({
                      ...addrForm,
                      full_address: e.target.value,
                    })
                  }
                />
              </div>

              <button
                className="btn btn-dark mt-3 w-100"
                onClick={saveAddress}
              >
                <i className="bi bi-check-circle me-1"></i>
                Save Address
              </button>
            </div>
          )}

          {addresses.length === 0 && (
            <p className="text-muted">No addresses added</p>
          )}

          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="card shadow-sm p-3 mb-3 rounded-4"
              data-aos="fade-up"
            >
              <div className="d-flex justify-content-between">
                <div>
                  <strong>
                    <i className="bi bi-person-fill me-1"></i>
                    {addr.name}
                  </strong>
                  <p className="small text-muted mb-1">
                    <i className="bi bi-telephone-fill me-1"></i>
                    {addr.phone}
                  </p>
                  <p className="small text-muted mb-0">
                    <i className="bi bi-house-door-fill me-1"></i>
                    {addr.full_address}, {addr.city} – {addr.pincode}
                  </p>
                </div>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeAddress(addr.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= BOTTOM ACTIONS ================= */}
      <div className="d-flex gap-3 mt-4">
        <button
          className="btn btn-outline-dark w-50"
          onClick={() => navigate("/")}
        >
          <i className="bi bi-shop me-1"></i>
          Go to Shop
        </button>

        <button
          className="btn btn-outline-dark w-50"
          onClick={() => navigate("/orders")}
        >
          <i className="bi bi-receipt me-1"></i>
          My Orders
        </button>
      </div>
    </div>
  );
};

export default Profile;
