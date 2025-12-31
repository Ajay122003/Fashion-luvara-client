import React from "react";

const ProductForm = ({
  handleSubmit,
  product,
  setProduct,
  categories = [],
  collections = [],
  newImages = [],
  setNewImages,
  buttonText,
}) => {
  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    e.target.value = null;
  };

  const removeNewImage = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
  };

  /* ================= VARIANTS ================= */
  const addVariant = () => {
    setProduct({
      ...product,
      variants: [
        ...product.variants,
        {
          size: "",
          color: "",
          stock: 0,
        },
      ],
    });
  };

  const updateVariant = (index, field, value) => {
    const updated = [...product.variants];
    updated[index][field] = value;
    setProduct({ ...product, variants: updated });
  };

  const removeVariant = (index) => {
    const updated = [...product.variants];
    updated.splice(index, 1);
    setProduct({ ...product, variants: updated });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 shadow rounded bg-white"
      style={{ maxWidth: 900 }}
    >
      {/* ================= NAME ================= */}
      <div className="mb-3">
        <label className="fw-bold">Product Name</label>
        <input
          className="form-control"
          value={product.name}
          required
          onChange={(e) =>
            setProduct({ ...product, name: e.target.value })
          }
        />
      </div>

      {/* ================= SKU ================= */}
      <div className="mb-3">
        <label className="fw-bold">Product Number (SKU)</label>
        <input
          className="form-control"
          placeholder="LV-TSH-001"
          value={product.sku}
          required
          onChange={(e) =>
            setProduct({
              ...product,
              sku: e.target.value.toUpperCase(),
            })
          }
        />
        <small className="text-muted">
          Unique product code (example: LV-TSH-001)
        </small>
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div className="mb-3">
        <label className="fw-bold">Description</label>
        <textarea
          className="form-control"
          rows="3"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
        />
      </div>

      {/* ================= PRICE ================= */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="fw-bold">Price</label>
          <input
            type="number"
            className="form-control"
            value={product.price}
            required
            onChange={(e) =>
              setProduct({
                ...product,
                price: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="fw-bold">Sale Price</label>
          <input
            type="number"
            className="form-control"
            value={product.sale_price || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                sale_price: Number(e.target.value) || "",
              })
            }
          />
        </div>
      </div>

      {/* ================= CATEGORY ================= */}
      <div className="mb-3">
        <label className="fw-bold">Category</label>
        <select
          className="form-select"
          value={product.category}
          required
          onChange={(e) =>
            setProduct({ ...product, category: e.target.value })
          }
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* ================= COLLECTIONS ================= */}
      <div className="mb-3">
        <label className="fw-bold">Collections</label>
        <select
          multiple
          className="form-select"
          value={product.collections}
          onChange={(e) => {
            const values = Array.from(
              e.target.selectedOptions,
              (o) => Number(o.value)
            );
            setProduct({ ...product, collections: values });
          }}
        >
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* ================= VARIANTS ================= */}
      <div className="mb-3">
        <label className="fw-bold">
          Variants (Size • Color optional • Stock)
        </label>

        {product.variants.map((v, i) => (
          <div key={i} className="row g-2 mb-2 align-items-center">
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Size"
                value={v.size}
                required
                onChange={(e) =>
                  updateVariant(i, "size", e.target.value.trim())
                }
              />
            </div>

            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Color (optional)"
                value={v.color || ""}
                onChange={(e) =>
                  updateVariant(i, "color", e.target.value.trim())
                }
              />
            </div>

            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                placeholder="Stock"
                min="0"
                required
                value={v.stock}
                onChange={(e) =>
                  updateVariant(i, "stock", Number(e.target.value))
                }
              />
            </div>

            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeVariant(i)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-outline-dark mt-2"
          onClick={addVariant}
        >
          + Add Variant
        </button>
      </div>

      {/* ================= IMAGES ================= */}
      <div className="mb-3">
        <label className="fw-bold">Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          className="form-control"
          onChange={handleImageUpload}
        />

        {newImages.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mt-3">
            {newImages.map((img, i) => (
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
                  onClick={() => removeNewImage(i)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= ACTIVE ================= */}
      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          checked={product.is_active}
          onChange={(e) =>
            setProduct({ ...product, is_active: e.target.checked })
          }
        />
        <label className="form-check-label">Active</label>
      </div>

      <button className="btn btn-primary w-100 fw-bold">
        {buttonText}
      </button>
    </form>
  );
};

export default ProductForm;



