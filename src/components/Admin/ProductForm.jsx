import React from "react";

const ProductForm = ({
  handleSubmit,
  product,
  setProduct,

  existingImages = [],
  setExistingImages,

  newImages = [],
  setNewImages,

  categories = [],
  collections = [],
  buttonText,
}) => {
  /* -------------------- NEW IMAGE UPLOAD -------------------- */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  const removeNewImage = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
  };

  /* -------------------- REMOVE EXISTING IMAGE -------------------- */
  const removeExistingImage = (id) => {
    const updated = existingImages.filter((img) => img.id !== id);
    setExistingImages(updated);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 shadow rounded bg-white"
      style={{ maxWidth: "800px" }}
    >
      {/* NAME */}
      <div className="mb-3">
        <label className="form-label fw-bold">Product Name</label>
        <input
          type="text"
          className="form-control"
          value={product.name}
          required
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
      </div>

      {/* DESCRIPTION */}
      <div className="mb-3">
        <label className="form-label fw-bold">Description</label>
        <textarea
          className="form-control"
          rows="3"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
        ></textarea>
      </div>

      {/* PRICE + SALE PRICE */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label fw-bold">Price</label>
          <input
            type="number"
            className="form-control"
            value={product.price}
            required
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-bold">Sale Price (Optional)</label>
          <input
            type="number"
            className="form-control"
            value={product.sale_price}
            onChange={(e) =>
              setProduct({ ...product, sale_price: e.target.value })
            }
          />
        </div>
      </div>

      {/* STOCK */}
      <div className="mb-3">
        <label className="form-label fw-bold">Stock</label>
        <input
          type="number"
          className="form-control"
          value={product.stock}
          required
          onChange={(e) => setProduct({ ...product, stock: e.target.value })}
        />
      </div>

      {/* SIZES + COLORS */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label fw-bold">Sizes (comma separated)</label>
          <input
            type="text"
            className="form-control"
            placeholder="S, M, L"
            value={product.sizes}
            onChange={(e) =>
              setProduct({ ...product, sizes: e.target.value })
            }
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-bold">Colors (comma separated)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Red, Black"
            value={product.colors}
            onChange={(e) =>
              setProduct({ ...product, colors: e.target.value })
            }
          />
        </div>
      </div>

      {/* CATEGORY */}
      <div className="mb-3">
        <label className="form-label fw-bold">Category</label>
        <select
          className="form-select"
          value={product.category}
          required
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* COLLECTIONS (MULTIPLE) */}
      <div className="mb-3">
        <label className="form-label fw-bold">Collections</label>
        <select
          className="form-select"
          multiple
          value={product.collections}
          onChange={(e) => {
            const selected = Array.from(
              e.target.selectedOptions,
              (opt) => Number(opt.value)
            );
            setProduct({ ...product, collections: selected });
          }}
        >
          {collections.length > 0 ? (
            collections.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))
          ) : (
            <option disabled>No collections available</option>
          )}
        </select>
        <small className="text-muted">Hold CTRL/CMD to select multiple</small>
      </div>

      {/* ACTIVE */}
      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          checked={product.is_active}
          onChange={(e) =>
            setProduct({ ...product, is_active: e.target.checked })
          }
        />
        <label className="form-check-label">Active Product</label>
      </div>

      {/* NEW IMAGE UPLOAD */}
      <div className="mb-3">
        <label className="form-label fw-bold">Upload New Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          className="form-control"
          onChange={handleImageUpload}
        />
      </div>

      {/* EXISTING IMAGE PREVIEW */}
      {existingImages.length > 0 && (
        <>
          <label className="fw-bold">Existing Images</label>
          <div className="d-flex flex-wrap gap-3 mb-3">
            {existingImages.map((img) => (
              <div key={img.id} className="position-relative">
                <img
                  src={img.image_url}
                  alt="existing"
                  width="90"
                  height="90"
                  className="border rounded"
                  style={{ objectFit: "cover" }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0"
                  onClick={() => removeExistingImage(img.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* NEW IMAGE PREVIEW */}
      {newImages.length > 0 && (
        <>
          <label className="fw-bold">New Images</label>
          <div className="d-flex flex-wrap gap-3 mb-3">
            {newImages.map((img, i) => (
              <div key={i} className="position-relative">
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  width="90"
                  height="90"
                  className="border rounded"
                  style={{ objectFit: "cover" }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0"
                  onClick={() => removeNewImage(i)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <button className="btn btn-primary w-100 fw-bold mt-3">
        {buttonText}
      </button>
    </form>
  );
};

export default ProductForm;