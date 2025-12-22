import React, { useEffect, useState } from "react";
import {
  fetchAdminCategories,
  fetchAdminCollections,
  updateAdminProduct,
  deleteProductImage,
} from "../../api/admin";
import apiClient from "../../api/client";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/Admin/ProductForm";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    sale_price: "",
    category: "",
    collections: [],
    is_active: true,
    variants: [], // { size, color, stock }
  });

  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const prodRes = await apiClient.get(
        `/api/admin-panel/products/${id}/`
      );

      const cats = await fetchAdminCategories();
      const cols = await fetchAdminCollections();

      setCategories(cats);
      setCollections(cols);

      setProduct({
        name: prodRes.data.name || "",
        description: prodRes.data.description || "",
        price: prodRes.data.price || "",
        sale_price: prodRes.data.sale_price || "",
        category: prodRes.data.category || "",
        collections: prodRes.data.collections || [],
        is_active: prodRes.data.is_active,
        variants: prodRes.data.variants || [],
      });

      setExistingImages(prodRes.data.images || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load product");
    }
  };

  /* ---------------- REMOVE EXISTING IMAGE ---------------- */
  const removeExistingImage = async (imageId) => {
    if (!window.confirm("Delete this image permanently?")) return;

    try {
      await deleteProductImage(imageId);
      setExistingImages((prev) =>
        prev.filter((img) => img.id !== imageId)
      );
    } catch {
      alert("Failed to delete image");
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (product.variants.length === 0) {
      alert("Add at least one variant");
      return;
    }

    const form = new FormData();

    form.append("name", product.name);
    form.append("description", product.description);
    form.append("price", product.price);
    form.append("category", product.category);
    form.append("is_active", product.is_active);

    if (product.sale_price) {
      form.append("sale_price", product.sale_price);
    }

    // ✅ VARIANTS (size + color + stock)
    form.append(
      "variants",
      JSON.stringify(
        product.variants.map((v) => ({
          size: v.size,
          color: v.color,
          stock: v.stock,
        }))
      )
    );

    // ✅ COLLECTIONS
    product.collections.forEach((cid) =>
      form.append("collections", cid)
    );

    // ✅ NEW IMAGES
    newImages.forEach((img) =>
      form.append("images", img)
    );

    try {
      await updateAdminProduct(id, form);
      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Failed to update product");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-3">Edit Product</h3>

      {/* EXISTING IMAGES */}
      {existingImages.length > 0 && (
        <div className="mb-4">
          <label className="fw-bold">Existing Images</label>
          <div className="d-flex flex-wrap gap-3 mt-2">
            {existingImages.map((img) => (
              <div key={img.id} className="position-relative">
                <img
                  src={img.image_url}
                  alt="product"
                  width="90"
                  height="90"
                  className="rounded border"
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
        </div>
      )}

      {/* PRODUCT FORM */}
      <ProductForm
        handleSubmit={handleSubmit}
        product={product}
        setProduct={setProduct}
        categories={categories}
        collections={collections}
        newImages={newImages}
        setNewImages={setNewImages}
        buttonText="Update Product"
      />
    </div>
  );
};

export default EditProduct;
