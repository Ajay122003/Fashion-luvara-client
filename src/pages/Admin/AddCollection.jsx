import React, { useState } from "react";
import { createAdminCollection } from "../../api/admin";
import { useNavigate } from "react-router-dom";

const AddCollection = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    is_active: true,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Auto-slug generator
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleChange = (e) => {
    let { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
      slug: name === "name" ? generateSlug(value) : form.slug,
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const submitForm = async () => {
    if (!form.name || !form.slug) {
      return alert("Name & slug are required!");
    }

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    if (image) data.append("image", image);

    try {
      await createAdminCollection(data); // ✅ Correct API helper function
      alert("Collection created successfully!");
      navigate("/admin/collections");
    } catch (err) {
      console.log(err.response?.data);
      alert("Failed to create collection.");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">Add Collection</h3>

      <div className="card shadow-sm p-4">

        {/* NAME */}
        <div className="mb-3">
          <label className="form-label fw-bold">Collection Name *</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            placeholder="Eg: Summer Special"
            required
          />
        </div>

        {/* SLUG */}
        <div className="mb-3">
          <label className="form-label fw-bold">Slug *</label>
          <input
            type="text"
            name="slug"
            className="form-control"
            value={form.slug}
            onChange={handleChange}
            placeholder="auto-generated"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-3">
          <label className="form-label fw-bold">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            placeholder="Short description about this collection"
            value={form.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* IMAGE */}
        <div className="mb-3">
          <label className="form-label fw-bold">Collection Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageSelect}
          />

          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="preview"
                width="150"
                height="150"
                className="rounded border"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
        </div>

        {/* ACTIVE CHECKBOX */}
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={form.is_active}
            onChange={(e) =>
              setForm({ ...form, is_active: e.target.checked })
            }
          />
          <label className="form-check-label">Active Collection</label>
        </div>

        {/* SUBMIT BUTTON */}
        <button className="btn btn-dark w-100 fw-bold" onClick={submitForm}>
          Save Collection
        </button>
      </div>
    </div>
  );
};

export default AddCollection;
