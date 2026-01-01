import React from "react";

const ProductForm = ({
  handleSubmit,
  product,
  setProduct,
  categories = [],
  offers = [],
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
        { size: "", color: "", stock: 0 },
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
      className="container-fluid"
      style={{ maxWidth: 960 }}
    >

      {/* ================= BASIC INFO ================= */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Basic Information</h5>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Product Name
            </label>
            <input
              className="form-control"
              value={product.name}
              required
              onChange={(e) =>
                setProduct({ ...product, name: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Product SKU
            </label>
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
              Unique product code
            </small>
          </div>

          <div>
            <label className="form-label fw-semibold">
              Description
            </label>
            <textarea
              className="form-control"
              rows="3"
              value={product.description}
              onChange={(e) =>
                setProduct({
                  ...product,
                  description: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>

      {/* ================= PRICING ================= */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Pricing</h5>

          <div className="row g-3">
            <div className=" col-6 col-md-6">
              <label className="form-label fw-semibold">
                Price
              </label>
              <input
                type="number"
                className="form-control"
                required
                value={product.price}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    price: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="col-6 col-md-6">
              <label className="form-label fw-semibold">
                Sale Price
              </label>
              <input
                type="number"
                className="form-control"
                value={product.sale_price || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    sale_price:
                      Number(e.target.value) || "",
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= CATEGORY & COLLECTION ================= */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Organization</h5>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Category
            </label>
            <select
              className="form-select"
              value={product.category}
              required
              onChange={(e) =>
                setProduct({
                  ...product,
                  category: e.target.value,
                })
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

          <div>
            <label className="form-label fw-semibold">
              Collections
            </label>
            <select
              multiple
              className="form-select"
              value={product.collections}
              onChange={(e) => {
                const values = Array.from(
                  e.target.selectedOptions,
                  (o) => Number(o.value)
                );
                setProduct({
                  ...product,
                  collections: values,
                });
              }}
            >
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>


      {/* ================= OFFER ================= */}
<div className="mt-3">
  <label className="form-label fw-semibold">
    Offer (Optional)
  </label>

  <select
    className="form-select"
    value={product.offer ?? ""}
    onChange={(e) =>
      setProduct({
        ...product,
        offer: e.target.value
          ? Number(e.target.value)
          : null,
      })
    }
  >
    <option value="">No Offer</option>

    {offers.map((o) => (
      <option key={o.id} value={o.id}>
        {o.title} –{" "}
        {o.discount_type === "PERCENT"
          ? `${o.discount_value}%`
          : `₹${o.discount_value}`} OFF
      </option>
    ))}
  </select>

  <small className="text-muted">
    Final price will be calculated automatically
  </small>
</div>


      {/* ================= VARIANTS ================= */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Variants</h5>

          {product.variants.map((v, i) => (
            <div
              key={i}
              className="row g-2 align-items-center mb-2"
            >
              <div className=" col-4 col-md-3">
                <input
                  className="form-control"
                  placeholder="Size"
                  required
                  value={v.size}
                  onChange={(e) =>
                    updateVariant(
                      i,
                      "size",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="col-4 col-md-3">
                <input
                  className="form-control"
                  placeholder="Color (optional)"
                  value={v.color || ""}
                  onChange={(e) =>
                    updateVariant(
                      i,
                      "color",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="col-4 col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Stock"
                  min="0"
                  required
                  value={v.stock}
                  onChange={(e) =>
                    updateVariant(
                      i,
                      "stock",
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-outline-danger w-100"
                  onClick={() => removeVariant(i)}
                >
                  Remove
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
      </div>

      {/* ================= IMAGES ================= */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Images</h5>

          <input
            type="file"
            multiple
            accept="image/*"
            className="form-control"
            onChange={handleImageUpload}
          />

          {newImages.length > 0 && (
            <div className="d-flex flex-wrap gap-3 mt-3">
              {newImages.map((img, i) => (
                <div
                  key={i}
                  className="position-relative"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    width="96"
                    height="96"
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
      </div>

      {/* ================= STATUS ================= */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={product.is_active}
              onChange={(e) =>
                setProduct({
                  ...product,
                  is_active: e.target.checked,
                })
              }
            />
            <label className="form-check-label fw-semibold">
              Product is Active
            </label>
          </div>
        </div>
      </div>

      {/* ================= SUBMIT ================= */}
      <button className="btn btn-dark btn-lg w-100 fw-bold">
        {buttonText}
      </button>
    </form>
  );
};

export default ProductForm;



