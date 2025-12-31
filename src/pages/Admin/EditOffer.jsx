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

  useEffect(() => {
    const loadOffer = async () => {
      const data = await fetchSingleAdminOffer(id);

      setForm({
        title: data.title || "",
        description: data.description || "",
        discount_type: data.discount_type || "PERCENT",
        discount_value: data.discount_value || "",
        start_date: data.start_date?.slice(0, 16),
        end_date: data.end_date?.slice(0, 16),
        is_active: data.is_active ?? true,
      });
    };

    loadOffer();
  }, [id]);

  if (!form) return <p>Loading...</p>;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      fd.append(key, form[key]);
    });

    if (image) fd.append("image", image);

    await updateAdminOffer(id, fd);
    alert("Offer updated successfully");
    navigate("/admin/offers");
  };

  return (
    <div className="container">
      <h3>Edit Offer</h3>

      <form onSubmit={handleSubmit}>
        {/* TITLE */}
        <input
          className="form-control mb-2"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* DESCRIPTION */}
        <textarea
          className="form-control mb-2"
          name="description"
          value={form.description}
          onChange={handleChange}
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
          required
        />

        {/* START / END DATE */}
        <input
          type="datetime-local"
          className="form-control mb-2"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          required
        />

        <input
          type="datetime-local"
          className="form-control mb-2"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
          required
        />

        {/* IMAGE */}
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

        <button className="btn btn-success">
          Update Offer
        </button>
      </form>
    </div>
  );
};

export default EditOffer;

