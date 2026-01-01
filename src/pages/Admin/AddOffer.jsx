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

    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("discount_type", form.discount_type);
    fd.append("discount_value", form.discount_value);
    fd.append("is_active", form.is_active);

    // ✅ LOCAL TIME → UTC FIX
    fd.append(
      "start_date",
      new Date(form.start_date).toISOString()
    );
    fd.append(
      "end_date",
      new Date(form.end_date).toISOString()
    );

    if (image) fd.append("image", image);

    await createAdminOffer(fd);
    alert("Offer created successfully");
    navigate("/admin/offers");
  };

  return (
    <div className="container">
      <h3>Add Offer</h3>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="title"
          placeholder="Offer Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          className="form-control mb-2"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <select
          className="form-control mb-2"
          name="discount_type"
          value={form.discount_type}
          onChange={handleChange}
        >
          <option value="PERCENT">Percentage (%)</option>
          <option value="FLAT">Flat Amount (₹)</option>
        </select>

        <input
          type="number"
          className="form-control mb-2"
          name="discount_value"
          placeholder="Discount value"
          value={form.discount_value}
          onChange={handleChange}
          required
        />

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

        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) => setImage(e.target.files[0])}
        />

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
          Create Offer
        </button>
      </form>
    </div>
  );
};

export default AddOffer;
