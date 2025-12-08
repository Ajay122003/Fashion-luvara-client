import React, { useEffect, useState } from "react";
import { getProductDetails, updateProduct, deleteProductImage } from "../../api/products";
// import { getAdminCategories } from "../../api/category";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);

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
  const [newImages, setNewImages] = useState([]);

  // Load product + categories
  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = async () => {
    const data = await getProductDetails(id);
    setProduct(data);

    setForm({
      name: data.name,
      description: data.description,
      price: data.price,
      sale_price: data.sale_price,
      stock: data.stock,
      category: data.category,
    });

    setSizes(data.sizes);
    setColors(data.colors);
  };

  const loadCategories = async () => {
    const res = await getAdminCategories();
    setCategories(res);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleSize = (size) =>
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );

  const toggleColor = (color) =>
    setColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );

  const handleImageUpload = (e) => {
    setNewImages([...e.target.files]);
  };

  const removeOldImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await deleteProductImage(imageId);
      loadProduct();
    } catch (err) {
      alert("Failed to delete image");
    }
  };

  const submitUpdate = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    for (let key in form) fd.append(key, form[key]);

    fd.append("sizes", JSON.stringify(sizes));
    fd.append("colors", JSON.stringify(colors));

    newImages.forEach((img) => fd.append("images", img));

    try {
      await updateProduct(id, fd);
      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h3 className="mb-4">Edit Product</h3>

      <form className="row g-4" onSubmit={submitUpdate}>
        {/* LEFT */}
        <div className="col-lg-8">
          <div className="card p-4 shadow-sm">
            <h5>Basic Details</h5>

            <div className="mb-3">
              <label className="form-label fw-semibold">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows={4}
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Sale Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="sale_price"
                  value={form.sale_price}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
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
              >
                {categories.map((cat) => (
                  <option value={cat.id} key={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SIZES */}
          <div className="card p-4 shadow-sm mt-4">
            <h5>Sizes</h5>
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <label key={size} className="me-3">
                <input
                  type="checkbox"
                  checked={sizes.includes(size)}
                  onChange={() => toggleSize(size)}
                />{" "}
                {size}
              </label>
            ))}
          </div>

          {/* COLORS */}
          <div className="card p-4 shadow-sm mt-4">
            <h5>Colors</h5>
            {["Red", "Blue", "Black", "White", "Green", "Yellow"].map((color) => (
              <label key={color} className="me-3">
                <input
                  type="checkbox"
                  checked={colors.includes(color)}
                  onChange={() => toggleColor(color)}
                />{" "}
                {color}
              </label>
            ))}
          </div>
        </div>

        {/* RIGHT — IMAGES */}
        <div className="col-lg-4">
          <div className="card p-4 shadow-sm">
            <h5>Existing Images</h5>

            <div className="d-flex flex-wrap gap-2">
              {product.images.map((img) => (
                <div key={img.id} className="position-relative">
                  <img
                    src={img.image_url}
                    className="rounded"
                    width="90"
                    height="90"
                    style={{ objectFit: "cover" }}
                  />

                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                    onClick={() => removeOldImage(img.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* New image upload */}
          <div className="card p-4 shadow-sm mt-4">
            <h5>Upload New Images</h5>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="form-control"
            />

            <div className="mt-3 d-flex flex-wrap gap-2">
              {newImages.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  width="80"
                  height="80"
                  className="rounded"
                  style={{ objectFit: "cover" }}
                />
              ))}
            </div>
          </div>

          <button className="btn btn-dark w-100 mt-4 py-2">
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
