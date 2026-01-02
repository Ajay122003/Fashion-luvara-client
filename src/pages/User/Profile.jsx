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

  const removeAddress = async (id) => {
    try {
      await deleteAddress(id);
      toast.success("Address removed");
      loadAll();
    } catch {
      toast.error("Delete failed");
    }
  };

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

  if (loading) return <p className="text-center py-5">Loading...</p>;

  return (
    <div className="container py-4">
      <h3 className="mb-4">My Account</h3>

      <div className="row g-4">
        {/* ================= LEFT : PROFILE ================= */}
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="mb-1">{profile.username}</h5>
            <p className="text-muted mb-2">{profile.email}</p>

            <span
              className={`badge ${
                profile.is_email_verified
                  ? "bg-success"
                  : "bg-warning"
              }`}
            >
              {profile.is_email_verified
                ? "Email Verified"
                : "Email Not Verified"}
            </span>

            <hr />

            <label className="form-label fw-semibold">
              Update Username
            </label>
            <input
              className="form-control mb-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <button
              className="btn btn-dark w-100 mb-2"
              onClick={saveProfile}
            >
              Save Profile
            </button>

            <button
              className="btn btn-outline-danger w-100"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* ================= RIGHT : ADDRESSES ================= */}
        <div className="col-md-8">
          <div className="d-flex justify-content-between mb-3">
            <h5>Saved Addresses</h5>
            <button
              className="btn btn-sm btn-dark"
              onClick={() => setShowAddrForm(!showAddrForm)}
            >
              {showAddrForm ? "Close" : "+ Add Address"}
            </button>
          </div>

          {showAddrForm && (
            <div className="card shadow-sm p-3 mb-3">
              <div className="row g-2">
                <input
                  className="form-control"
                  placeholder="Name"
                  onChange={(e) =>
                    setAddrForm({ ...addrForm, name: e.target.value })
                  }
                />
                <input
                  className="form-control"
                  placeholder="Phone"
                  onChange={(e) =>
                    setAddrForm({ ...addrForm, phone: e.target.value })
                  }
                />
                <input
                  className="form-control"
                  placeholder="Pincode"
                  onChange={(e) =>
                    setAddrForm({ ...addrForm, pincode: e.target.value })
                  }
                />
                <input
                  className="form-control"
                  placeholder="City"
                  onChange={(e) =>
                    setAddrForm({ ...addrForm, city: e.target.value })
                  }
                />
                <textarea
                  className="form-control"
                  placeholder="Full Address"
                  onChange={(e) =>
                    setAddrForm({
                      ...addrForm,
                      full_address: e.target.value,
                    })
                  }
                />
              </div>

              <button
                className="btn btn-dark mt-3"
                onClick={saveAddress}
              >
                Save Address
              </button>
            </div>
          )}

          {addresses.length === 0 && (
            <p className="text-muted">No addresses added</p>
          )}

          {addresses.map((addr) => (
            <div key={addr.id} className="card shadow-sm p-3 mb-2">
              <strong>{addr.name}</strong> – {addr.phone}
              <p className="mb-2 text-muted">
                {addr.full_address}, {addr.city} – {addr.pincode}
              </p>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeAddress(addr.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex gap-3 mt-4">
        <button
          className="btn btn-outline-dark"
          onClick={() => navigate("/")}
        >
          Go to Shop
        </button>
        <button
          className="btn btn-outline-dark"
          onClick={() => navigate("/orders")}
        >
          My Orders
        </button>
      </div>
    </div>
  );
};

export default Profile;
