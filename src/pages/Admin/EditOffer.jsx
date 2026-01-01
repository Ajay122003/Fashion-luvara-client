import { useEffect, useState } from "react";
import {
  fetchSingleAdminOffer,
  updateAdminOffer,
} from "../../api/admin";
import { useNavigate, useParams } from "react-router-dom";

const EditOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD OFFER ================= */
  useEffect(() => {
    const loadOffer = async () => {
      try {
        const data = await fetchSingleAdminOffer(id);

        setForm({
          title: data.title || "",
          description: data.description || "",
          discount_type: data.discount_type || "PERCENT",
          discount_value: data.discount_value ?? "",
          start_date: data.start_date
            ? new Date(data.start_date).toISOString().slice(0, 16)
            : "",
          end_date: data.end_date
            ? new Date(data.end_date).toISOString().slice(0, 16)
            : "",
          is_active: data.is_active ?? true,

          // ✅ EXISTING IMAGE
          image_url: data.image_url || null,
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load offer");
      }
    };

    loadOffer();
  }, [id]);

  if (!form) return <p>Loading...</p>;

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const start = new Date(form.start_date);
    const end = new Date(form.end_date);

    if (end <= start) {
      alert("End date must be after start date");
      return;
    }

    const fd = new FormData();

    fd.append("title", form.title);
    fd.append("description", form.description || "");
    fd.append("discount_type", form.discount_type);
    fd.append("discount_value", Number(form.discount_value));
    fd.append("is_active", form.is_active ? "true" : "false");
    fd.append("start_date", start.toISOString());
    fd.append("end_date", end.toISOString());

    if (image) {
      fd.append("image", image);
    }

    try {
      setLoading(true);
      await updateAdminOffer(id, fd);
      alert("Offer updated successfully");
      navigate("/admin/offers");
    } catch (err) {
      console.error(err);
      alert("Failed to update offer");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-3">Edit Offer</h3>

      <form onSubmit={handleSubmit}>
        {/* TITLE */}
        <input
          className="form-control mb-2"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Offer title"
          required
        />

        {/* DESCRIPTION */}
        <textarea
          className="form-control mb-2"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Offer description"
        />

        {/* DISCOUNT TYPE */}
        <select
          className="form-control mb-2"
          name="discount_type"
          value={form.discount_type}
          onChange={handleChange}
        >
          <option value="PERCENT">Percentage (%)</option>
          <option value="FLAT">Flat Amount (₹)</option>
        </select>

        {/* DISCOUNT VALUE */}
        <input
          type="number"
          className="form-control mb-2"
          name="discount_value"
          value={form.discount_value}
          onChange={handleChange}
          placeholder="Discount value"
          required
        />

        {/* START DATE */}
        <input
          type="datetime-local"
          className="form-control mb-2"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          required
        />

        {/* END DATE */}
        <input
          type="datetime-local"
          className="form-control mb-3"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
          required
        />

        {/* ✅ EXISTING IMAGE PREVIEW */}
        {form.image_url && (
          <div className="mb-3">
            <label className="fw-semibold d-block mb-1">
              Current Image
            </label>
            <img
              src={form.image_url}
              alt="Offer"
              style={{
                width: "160px",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>
        )}

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* ACTIVE */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          <label className="form-check-label">
            Active
          </label>
        </div>

        <button
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Offer"}
        </button>
      </form>
    </div>
  );
};

export default EditOffer;
