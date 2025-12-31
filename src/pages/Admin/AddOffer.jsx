import { useState } from "react";
import { createAdminOffer } from "../../api/admin";
import { useNavigate } from "react-router-dom";

const AddOffer = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    discount_type: "PERCENT",
    discount_value: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  const [image, setImage] = useState(null);

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

    await createAdminOffer(fd);
    alert("Offer created successfully");
    navigate("/admin/offers");
  };

  return (
    <div className="container">
      <h3>Add Offer</h3>

      <form onSubmit={handleSubmit}>
        {/* TITLE */}
        <input
          className="form-control mb-2"
          name="title"
          placeholder="Offer Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* DESCRIPTION */}
        <textarea
          className="form-control mb-2"
          name="description"
          placeholder="Description"
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
          placeholder={
            form.discount_type === "PERCENT"
              ? "Discount %"
              : "Discount Amount"
          }
          value={form.discount_value}
          onChange={handleChange}
          required
        />

        {/* START / END DATE */}
        <input
          type="datetime-local"
          className="form-control mb-2"
          name="start_date"
          onChange={handleChange}
          required
        />

        <input
          type="datetime-local"
          className="form-control mb-2"
          name="end_date"
          onChange={handleChange}
          required
        />

        {/* IMAGE */}
        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* STATUS */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          <label className="form-check-label">Active</label>
        </div>

        <button className="btn btn-success">
          Create Offer
        </button>
      </form>
    </div>
  );
};

export default AddOffer;

