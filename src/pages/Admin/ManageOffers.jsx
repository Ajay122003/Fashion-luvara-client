import { useEffect, useState } from "react";
import {
  fetchAdminOffers,
  deleteAdminOffer,
  updateAdminOffer,
} from "../../api/admin";
import { Link } from "react-router-dom";

/* ================= TIME HELPERS ================= */
const getNow = () => new Date();

const getOfferStatus = (offer) => {
  const now = getNow();
  const start = new Date(offer.start_date);
  const end = new Date(offer.end_date);

  if (!offer.is_active) return "DISABLED";
  if (now < start) return "UPCOMING";
  if (now > end) return "EXPIRED";
  return "LIVE";
};

const getCountdown = (date) => {
  const diff = new Date(date) - getNow();
  if (diff <= 0) return "Expired";

  const hrs = Math.floor(diff / 1000 / 3600);
  const days = Math.floor(hrs / 24);

  return days > 0
    ? `${days}d ${hrs % 24}h`
    : `${hrs}h`;
};

const ManageOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminOffers();
      setOffers(data);
    } catch {
      alert("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this offer permanently?")) return;
    await deleteAdminOffer(id);
    loadOffers();
  };

  /* ================= TOGGLE ACTIVE ================= */
  const toggleActive = async (offer) => {
    await updateAdminOffer(offer.id, {
      is_active: !offer.is_active,
    });
    loadOffers();
  };

  if (loading) return <p>Loading offers...</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Manage Offers</h3>
        <Link to="/admin/offers/add" className="btn btn-primary">
          + Add Offer
        </Link>
      </div>

      <table className="table table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th>Title</th>
            <th>Discount</th>
            <th>Products</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {offers.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                No offers found
              </td>
            </tr>
          )}

          {offers.map((offer) => {
            const status = getOfferStatus(offer);

            return (
              <tr key={offer.id}>
                {/* TITLE */}
                <td>{offer.title}</td>

                {/* DISCOUNT */}
                <td>
                  {offer.discount_type === "PERCENT"
                    ? `${offer.discount_value}%`
                    : `₹${offer.discount_value}`}
                </td>

                {/* PRODUCT COUNT */}
                <td>
                  <span className="fw-semibold">
                    {offer.products_count ?? 0}
                  </span>
                </td>

                {/* DURATION */}
                <td>
                  {new Date(offer.start_date).toLocaleDateString()} <br />
                  {new Date(offer.end_date).toLocaleDateString()}
                  <br />
                  <small className="text-muted">
                    {status === "LIVE" &&
                      `Ends in ${getCountdown(offer.end_date)}`}
                    {status === "UPCOMING" &&
                      `Starts in ${getCountdown(offer.start_date)}`}
                    {status === "EXPIRED" && "Expired"}
                  </small>
                </td>

                {/* STATUS */}
                <td>
                  {status === "LIVE" && (
                    <span className="badge bg-success">Live</span>
                  )}
                  {status === "UPCOMING" && (
                    <span className="badge bg-warning text-dark">
                      Upcoming
                    </span>
                  )}
                  {status === "EXPIRED" && (
                    <span className="badge bg-danger">Expired</span>
                  )}
                  {status === "DISABLED" && (
                    <span className="badge bg-secondary">
                      Disabled
                    </span>
                  )}
                </td>

                {/* ACTIONS */}
                <td>
                  <Link
                    to={`/admin/offers/edit/${offer.id}`}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => toggleActive(offer)}
                    className={`btn btn-sm me-2 ${
                      offer.is_active
                        ? "btn-outline-secondary"
                        : "btn-outline-success"
                    }`}
                  >
                    {offer.is_active ? "Disable" : "Enable"}
                  </button>

                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOffers;
