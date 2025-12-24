import { useEffect, useState } from "react";
import { getMe, updateProfile, logoutUser,} from "../../api/auth";
import { getAddresses, addAddress, deleteAddress,} from "../../api/address";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import storage from "../../utils/storage";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ================= PROFILE ================= */
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");

  /* ================= ADDRESS ================= */
  const [addresses, setAddresses] = useState([]);
  const [addrForm, setAddrForm] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    full_address: "",
  });

  const [loading, setLoading] = useState(true);

  /* ================= LOAD ================= */
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
    } catch (err) {
      //  user-only logout
      storage.clearUserToken();
      dispatch(logout());
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  /* ================= PROFILE UPDATE ================= */
  const saveProfile = async () => {
    if (!username) {
      toast.error("Username cannot be empty");
      return;
    }

    try {
      await updateProfile({ username });
      toast.success("Profile updated");
      loadAll();
    } catch {
      toast.error("Profile update failed");
    }
  };

  /* ================= ADDRESS ================= */
  const handleAddrChange = (e) => {
    setAddrForm({ ...addrForm, [e.target.name]: e.target.value });
  };

  const saveAddress = async () => {
    const { name, phone, pincode, city, full_address } = addrForm;

    if (!name || !phone || !pincode || !city || !full_address) {
      toast.error("All address fields are required");
      return;
    }

    try {
      await addAddress(addrForm);
      toast.success("Address added");
      setAddrForm({
        name: "",
        phone: "",
        pincode: "",
        city: "",
        state: "",
        full_address: "",
      });
      loadAll();
    } catch {
      toast.error("Failed to add address");
    }
  };

  const removeAddress = async (id) => {
    try {
      await deleteAddress(id);
      toast.success("Address deleted");
      loadAll();
    } catch {
      toast.error("Failed to delete address");
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await logoutUser(); // refresh handled internally
    } catch {
      // ignore
    } finally {
      storage.clearUserToken();
      dispatch(logout());
      navigate("/login", { replace: true });
      window.location.reload(); // reset axios memory
    }
  };

  if (loading)
    return <p className="text-center py-5">Loading...</p>;

  /* ================= UI ================= */
  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <h3 className="mb-4">My Account</h3>

      {/* PROFILE CARD */}
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h5>{profile.username}</h5>
            <p className="mb-1 text-muted">{profile.email}</p>
            <span
              className={`badge ${
                profile.is_email_verified
                  ? "bg-success"
                  : "bg-warning"
              }`}
            >
              {profile.is_email_verified
                ? "Email Verified"
                : "Not Verified"}
            </span>
          </div>

          <button
            className="btn btn-outline-dark mt-3 mt-md-0"
            data-bs-toggle="modal"
            data-bs-target="#profileModal"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* ADDRESSES */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Saved Addresses</h5>
        <button
          className="btn btn-dark btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#addressModal"
        >
          + Add Address
        </button>
      </div>

      {addresses.length === 0 && (
        <p className="text-muted">No addresses added</p>
      )}

      {addresses.map((addr) => (
        <div key={addr.id} className="card shadow-sm mb-3">
          <div className="card-body">
            <strong>{addr.name}</strong> – {addr.phone}
            <p className="mb-1">
              {addr.full_address}, {addr.city} –{" "}
              {addr.pincode}
            </p>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => removeAddress(addr.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* ACTIONS */}
      <div className="d-flex gap-3 flex-wrap mt-4">
        <button
          className="btn btn-dark"
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

        <button
          className="btn btn-outline-danger"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </div>

      {/* PROFILE MODAL */}
      <div className="modal fade" id="profileModal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3">
            <h5>Edit Profile</h5>

            <input
              className="form-control my-3"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                className="btn btn-dark"
                data-bs-dismiss="modal"
                onClick={saveProfile}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      <div className="modal fade" id="addressModal">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content p-3">
            <h5>Add Address</h5>

            <div className="row g-2 my-2">
              <input
                className="form-control"
                name="name"
                placeholder="Name"
                onChange={handleAddrChange}
              />
              <input
                className="form-control"
                name="phone"
                placeholder="Phone"
                onChange={handleAddrChange}
              />
              <input
                className="form-control"
                name="pincode"
                placeholder="Pincode"
                onChange={handleAddrChange}
              />
              <input
                className="form-control"
                name="city"
                placeholder="City"
                onChange={handleAddrChange}
              />
              <textarea
                className="form-control"
                name="full_address"
                placeholder="Full Address"
                onChange={handleAddrChange}
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                className="btn btn-dark"
                data-bs-dismiss="modal"
                onClick={saveAddress}
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
