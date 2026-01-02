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

  return days > 0 ? `${days}d ${hrs % 24}h` : `${hrs}h`;
};

const ManageOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminOffers();
      setOffers(data || []);
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

  if (loading) return <p className="text-center py-4">Loading offers…</p>;

  return (
    <div className="container-fluid">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Manage Offers</h3>
        <Link to="/admin/offers/add" className="btn btn-dark">
          + Add Offer
        </Link>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Discount</th>
              <th>Products</th>
              <th>Duration</th>
              <th>Status</th>
              <th style={{ width: 170 }}>Actions</th>
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
                  <td>{offer.title}</td>

                  <td>
                    {offer.discount_type === "PERCENT"
                      ? `${offer.discount_value}%`
                      : `₹${offer.discount_value}`}
                  </td>

                  <td className="fw-semibold">
                    {offer.products_count ?? 0}
                  </td>

                  <td>
                    {new Date(offer.start_date).toLocaleDateString()}
                    <br />
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
                      className="btn btn-sm btn-outline-primary me-2"
                      title="Edit"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>

                    <button
                      onClick={() => toggleActive(offer)}
                      className={`btn btn-sm me-2 ${
                        offer.is_active
                          ? "btn-outline-secondary"
                          : "btn-outline-success"
                      }`}
                      title={
                        offer.is_active ? "Disable" : "Enable"
                      }
                    >
                      <i
                        className={`bi ${
                          offer.is_active
                            ? "bi-pause"
                            : "bi-play"
                        }`}
                      ></i>
                    </button>

                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="btn btn-sm btn-outline-danger"
                      title="Delete"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="d-block d-md-none">
        {offers.length === 0 && (
          <p className="text-center text-muted">
            No offers found
          </p>
        )}

        {offers.map((offer) => {
          const status = getOfferStatus(offer);

          return (
            <div
              key={offer.id}
              className="card shadow-sm mb-3"
            >
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h6 className="fw-bold">{offer.title}</h6>
                  {status === "LIVE" && (
                    <span className="badge bg-success">
                      Live
                    </span>
                  )}
                  {status === "UPCOMING" && (
                    <span className="badge bg-warning text-dark">
                      Upcoming
                    </span>
                  )}
                  {status === "EXPIRED" && (
                    <span className="badge bg-danger">
                      Expired
                    </span>
                  )}
                  {status === "DISABLED" && (
                    <span className="badge bg-secondary">
                      Disabled
                    </span>
                  )}
                </div>

                <p className="mb-1">
                  <strong>Discount:</strong>{" "}
                  {offer.discount_type === "PERCENT"
                    ? `${offer.discount_value}%`
                    : `₹${offer.discount_value}`}
                </p>

                <p className="mb-1">
                  <strong>Products:</strong>{" "}
                  {offer.products_count ?? 0}
                </p>

                <p className="mb-2 text-muted">
                  {new Date(offer.start_date).toLocaleDateString()} –{" "}
                  {new Date(offer.end_date).toLocaleDateString()}
                </p>

                <div className="d-flex gap-2">
                  <Link
                    to={`/admin/offers/edit/${offer.id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    <i className="bi bi-pencil"></i>
                  </Link>

                  <button
                    onClick={() => toggleActive(offer)}
                    className={`btn btn-sm ${
                      offer.is_active
                        ? "btn-outline-secondary"
                        : "btn-outline-success"
                    }`}
                  >
                    <i
                      className={`bi ${
                        offer.is_active
                          ? "bi-pause"
                          : "bi-play"
                      }`}
                    ></i>
                  </button>

                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageOffers;

