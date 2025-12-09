import React from "react";

const CategoryForm = ({ category, setCategory, image, setImage, handleSubmit, buttonText }) => {
  return (
    <form
      className="card p-4 shadow-sm"
      onSubmit={handleSubmit}
      style={{ maxWidth: "600px", margin: "auto" }}
    >
      {/* Name */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Category Name</label>
        <input
          type="text"
          className="form-control"
          value={category.name}
          onChange={(e) => setCategory({ ...category, name: e.target.value })}
          required
        />
      </div>

      {/* Sort Order */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Sort Order</label>
        <input
          type="number"
          className="form-control"
          value={category.sort_order}
          onChange={(e) => setCategory({ ...category, sort_order: e.target.value })}
        />
      </div>

      {/* Active */}
      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          checked={category.is_active}
          onChange={(e) =>
            setCategory({ ...category, is_active: e.target.checked })
          }
        />
        <label className="form-check-label">Active Category</label>
      </div>

      {/* Image Upload */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Upload Image</label>
        <input
          type="file"
          className="form-control"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>

      {/* Preview */}
      {category.image_url && (
        <div className="mb-3 text-center">
          <img
            src={category.image_url}
            alt="Preview"
            className="img-fluid rounded"
            style={{ maxHeight: "140px" }}
          />
        </div>
      )}

      {/* Button */}
      <button type="submit" className="btn btn-primary w-100">
        {buttonText}
      </button>
    </form>
  );
};

export default CategoryForm;
