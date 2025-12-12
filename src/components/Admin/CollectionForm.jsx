import React from "react";

const CollectionForm = ({
  collection,
  setCollection,
  image,
  setImage,
  handleSubmit,
  buttonText,
}) => {
  return (
    <form
      className="card p-4 shadow-sm"
      onSubmit={handleSubmit}
      style={{ maxWidth: "600px", margin: "auto" }}
    >
      {/* NAME */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Collection Name</label>
        <input
          type="text"
          className="form-control"
          value={collection.name}
          onChange={(e) =>
            setCollection({ ...collection, name: e.target.value })
          }
          required
        />
      </div>

      {/* DESCRIPTION */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Description</label>
        <textarea
          className="form-control"
          rows="3"
          value={collection.description}
          onChange={(e) =>
            setCollection({ ...collection, description: e.target.value })
          }
        ></textarea>
      </div>

      {/* SORT ORDER */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Sort Order</label>
        <input
          type="number"
          className="form-control"
          value={collection.sort_order}
          onChange={(e) =>
            setCollection({ ...collection, sort_order: e.target.value })
          }
        />
      </div>

      {/* ACTIVE STATUS */}
      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          checked={collection.is_active}
          onChange={(e) =>
            setCollection({ ...collection, is_active: e.target.checked })
          }
        />
        <label className="form-check-label">Active Collection</label>
      </div>

      {/* IMAGE UPLOAD */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Upload Image</label>
        <input
          type="file"
          className="form-control"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>

      {/* IMAGE PREVIEW */}
      {(collection.image_url || collection.image) && (
        <div className="mb-3 text-center">
          <img
            src={collection.image_url || collection.image}
            alt="Preview"
            className="img-fluid rounded"
            style={{ maxHeight: "140px" }}
          />
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <button type="submit" className="btn btn-primary w-100 fw-bold">
        {buttonText}
      </button>
    </form>
  );
};

export default CollectionForm;
