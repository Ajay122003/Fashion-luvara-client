import React from "react";

const ProductForm = ({
  handleSubmit,
  product,
  setProduct,
  images,
  setImages,
  categories = [],
  buttonText,
}) => {
  // Handle new image selection
  const handleImageUpload = (e) => {
    setImages([...images, ...e.target.files]);
  };

  // Remove selected images (frontend only)
  const removeNewImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
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

      {/* SIZES & COLORS */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label fw-bold">
            Sizes (comma separated)
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="S, M, L, XL"
            value={product.sizes}
            onChange={(e) => setProduct({ ...product, sizes: e.target.value })}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-bold">
            Colors (comma separated)
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Red, Black, White"
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
          <option value="">Select a category</option>
          {categories.length > 0 &&
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      {/* IMAGE UPLOAD */}
      <div className="mb-3">
        <label className="form-label fw-bold">Upload Images</label>
        <input
          type="file"
          className="form-control"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>

      {/* NEW IMAGES PREVIEW */}
      {images.length > 0 && (
        <div className="mb-3">
          <label className="fw-bold mb-2">New Images Preview</label>
          <div className="d-flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="position-relative">
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  width="90"
                  height="90"
                  className="rounded border"
                  style={{ objectFit: "cover" }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0"
                  style={{ padding: "2px 6px" }}
                  onClick={() => removeNewImage(i)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <button className="btn btn-primary w-100 fw-bold mt-3">
        {buttonText}
      </button>
    </form>
  );
};

export default ProductForm;
