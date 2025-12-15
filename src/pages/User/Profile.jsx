import { useEffect, useState } from "react";
import { getMe, updateProfile, logoutUser } from "../../api/auth";
import {
  getAddresses,
  addAddress,
  deleteAddress,
} from "../../api/address";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

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
    const me = await getMe();
    setProfile(me.data);
    setUsername(me.data.username);

    const addr = await getAddresses();
    setAddresses(addr.data);

    setLoading(false);
  };

  /* ================= PROFILE UPDATE ================= */
  const saveProfile = async () => {
    await updateProfile({ username });
    alert("Profile updated");
    loadAll();
  };

  /* ================= ADDRESS ================= */
  const handleAddrChange = (e) => {
    setAddrForm({ ...addrForm, [e.target.name]: e.target.value });
  };

  const saveAddress = async () => {
    await addAddress(addrForm);
    setAddrForm({
      name: "",
      phone: "",
      pincode: "",
      city: "",
      state: "",
      full_address: "",
    });
    loadAll();
  };

  const removeAddress = async (id) => {
    await deleteAddress(id);
    loadAll();
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        await logoutUser(refresh);
      }
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  if (loading) return <p className="text-center py-5">Loading...</p>;

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <h3 className="mb-4">My Account</h3>

      {/* ================= PROFILE CARD ================= */}
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h5>{profile.username}</h5>
            <p className="mb-1 text-muted">{profile.email}</p>
            <span
              className={`badge ${
                profile.is_email_verified ? "bg-success" : "bg-warning"
              }`}
            >
              {profile.is_email_verified ? "Email Verified" : "Not Verified"}
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

      {/* ================= ADDRESS ================= */}
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
              {addr.full_address}, {addr.city} – {addr.pincode}
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

      {/* ================= ACTIONS ================= */}
      <div className="d-flex gap-3 flex-wrap mt-4">
        <button
          className="btn btn-dark"
          onClick={() => navigate("/")}
        >
          Add Shop
        </button>

        <button
          className="btn btn-outline-dark"
          onClick={() => navigate("/orders")}
        >
          My Orders
        </button>

        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      {/* ================= PROFILE MODAL ================= */}
      <div className="modal fade" id="profileModal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3">
            <h5>Edit Profile</h5>

            <input
              className="form-control my-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
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

      {/* ================= ADDRESS MODAL ================= */}
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
              <button className="btn btn-secondary" data-bs-dismiss="modal">
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
