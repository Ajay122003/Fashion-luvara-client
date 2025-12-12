import React, { useEffect, useState } from "react";
import {
  fetchSingleAdminCollection,
  updateAdminCollection,
} from "../../api/admin";
import { useParams, useNavigate } from "react-router-dom";

const EditCollection = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    sort_order: 0,
    is_active: true,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // AUTO SLUG
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  // LOAD COLLECTION
  const loadCollection = async () => {
    try {
      const data = await fetchSingleAdminCollection(id);

      setForm({
        name: data.name,
        slug: data.slug,
        description: data.description || "",
        sort_order: data.sort_order,
        is_active: data.is_active,
      });

      setPreview(data.image_url);
    } catch (err) {
      console.error(err);
      alert("Failed to load collection data.");
    }
  };

  useEffect(() => {
    loadCollection();
  }, [id]);

  // HANDLE TEXT INPUTS
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
      slug: name === "name" ? generateSlug(value) : form.slug,
    });
  };

  // IMAGE SELECT
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // SUBMIT UPDATE
  const handleSubmit = async () => {
    const data = new FormData();

    Object.keys(form).forEach((key) => data.append(key, form[key]));
    if (image) data.append("image", image);

    try {
      await updateAdminCollection(id, data);
      alert("Collection updated successfully!");
      navigate("/admin/collections");
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to update collection.");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">Edit Collection</h3>

      <div className="card shadow-sm p-4">

        {/* NAME */}
        <div className="mb-3">
          <label className="form-label fw-bold">Name *</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
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
            value={form.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* SORT ORDER */}
        <div className="mb-3">
          <label className="form-label fw-bold">Sort Order</label>
          <input
            type="number"
            name="sort_order"
            className="form-control"
            value={form.sort_order}
            onChange={handleChange}
          />
        </div>

        {/* IMAGE */}
        <div className="mb-3">
          <label className="form-label fw-bold">Update Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageSelect}
          />
        </div>

        {/* PREVIEW */}
        {preview && (
          <div className="mb-3">
            <img
              src={preview}
              alt="preview"
              style={{
                height: "140px",
                width: "140px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>
        )}

        {/* ACTIVE */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            checked={form.is_active}
            onChange={(e) =>
              setForm({ ...form, is_active: e.target.checked })
            }
          />
          <label className="form-check-label">Active</label>
        </div>

        {/* SUBMIT */}
        <button
          className="btn btn-dark w-100 fw-bold"
          onClick={handleSubmit}
        >
          Update Collection
        </button>
      </div>
    </div>
  );
};

export default EditCollection;
