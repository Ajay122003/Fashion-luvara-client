import React, { useState, useEffect } from "react";
import { createProduct } from "../../api/products";
// import { getAdminCategories } from "../../api/category";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  // Form fields
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    sale_price: "",
    stock: "",
    category: "",
  });

  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  // Load categories
  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await getAdminCategories();
        setCategories(res);
      } catch (err) {
        console.error(err);
      }
    };
    loadCats();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    for (let key in form) fd.append(key, form[key]);
    fd.append("sizes", JSON.stringify(sizes));
    fd.append("colors", JSON.stringify(colors));

    images.forEach((img) => fd.append("images", img));

    try {
      await createProduct(fd);
      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  return (
    <div>
      <h3 className="mb-4">Add New Product</h3>

      <form onSubmit={submitProduct} className="row g-4">

        {/* LEFT SIDE */}
        <div className="col-lg-8">

          <div className="card p-4 shadow-sm">
            <h5 className="mb-3">Basic Information</h5>

            <div className="mb-3">
              <label className="form-label fw-semibold">Product Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                name="description"
                rows="4"
                className="form-control"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Sale Price</label>
                <input
                  type="number"
                  name="sale_price"
                  className="form-control"
                  value={form.sale_price}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  className="form-control"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* CATEGORY */}
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sizes */}
          <div className="card p-4 shadow-sm mt-4">
            <h5 className="mb-3">Sizes</h5>
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <label className="me-3">
                <input
                  type="checkbox"
                  checked={sizes.includes(size)}
                  onChange={() => toggleSize(size)}
                />{" "}
                {size}
              </label>
            ))}
          </div>

          {/* Colors */}
          <div className="card p-4 shadow-sm mt-4">
            <h5 className="mb-3">Colors</h5>
            {["Red", "Blue", "Black", "White", "Green", "Yellow"].map(
              (color) => (
                <label className="me-3">
                  <input
                    type="checkbox"
                    checked={colors.includes(color)}
                    onChange={() => toggleColor(color)}
                  />{" "}
                  {color}
                </label>
              )
            )}
          </div>
        </div>

        {/* RIGHT SIDE (IMAGE UPLOAD) */}
        <div className="col-lg-4">
          <div className="card p-4 shadow-sm">
            <h5 className="mb-3">Product Images</h5>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
              required
            />

            {/* Preview */}
            <div className="mt-3 d-flex flex-wrap gap-2">
              {images.length > 0 &&
                [...images].map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="rounded"
                    width="80"
                    height="80"
                    style={{ objectFit: "cover" }}
                  />
                ))}
            </div>
          </div>

          <button className="btn btn-dark w-100 mt-4 py-2">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
