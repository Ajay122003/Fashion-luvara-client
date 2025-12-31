import { useEffect, useState } from "react";
import {
  fetchAdminOffers,
  deleteAdminOffer,
} from "../../api/admin";
import { Link } from "react-router-dom";

const ManageOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminOffers();
      setOffers(data);
    } catch (err) {
      alert("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    await deleteAdminOffer(id);
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

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Discount</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {offers.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                No offers found
              </td>
            </tr>
          )}

          {offers.map((offer) => (
            <tr key={offer.id}>
              <td>{offer.title}</td>

              <td>
                {offer.discount_type === "PERCENT"
                  ? `${offer.discount_value}%`
                  : `₹${offer.discount_value}`}
              </td>

              <td>
                {new Date(offer.start_date).toLocaleDateString()} <br />
                {new Date(offer.end_date).toLocaleDateString()}
              </td>

              <td>
                {offer.is_active ? (
                  <span className="badge bg-success">Active</span>
                ) : (
                  <span className="badge bg-secondary">Inactive</span>
                )}
              </td>

              <td>
                <Link
                  to={`/admin/offers/edit/${offer.id}`}
                  className="btn btn-sm btn-warning me-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(offer.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOffers;
