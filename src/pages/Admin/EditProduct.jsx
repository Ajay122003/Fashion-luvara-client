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
    stock: "",
    sizes: "",
    colors: "",
    category: "",
    collections: [],
    is_active: true,
  });

  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);

  const [existingImages, setExistingImages] = useState([]); // OLD images
  const [newImages, setNewImages] = useState([]);           // NEW uploads

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const prod = await apiClient.get(`/api/admin-panel/products/${id}/`);
      const cats = await fetchAdminCategories();
      const cols = await fetchAdminCollections();

      setCategories(cats);
      setCollections(cols);

      setProduct({
        name: prod.data.name,
        description: prod.data.description,
        price: prod.data.price,
        sale_price: prod.data.sale_price || "",
        stock: prod.data.stock,
        sizes: prod.data.sizes?.join(", ") || "",
        colors: prod.data.colors?.join(", ") || "",
        category: prod.data.category,
        collections: prod.data.collections || [],
        is_active: prod.data.is_active,
      });

      setExistingImages(prod.data.images || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load product");
    }
  };

  /* ----------------- REMOVE EXISTING IMAGE ----------------- */
  const removeExistingImage = async (imageId) => {
    if (!window.confirm("Delete this image permanently?")) return;

    try {
      await deleteProductImage(imageId);
      setExistingImages(existingImages.filter((img) => img.id !== imageId));
    } catch (err) {
      alert("Failed to delete image");
    }
  };

  /* ------------------------ SUBMIT ------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    form.append("name", product.name);
    form.append("description", product.description);
    form.append("price", product.price);
    form.append("stock", product.stock);
    form.append("category", product.category);
    form.append("is_active", product.is_active);

    if (product.sale_price) {
      form.append("sale_price", product.sale_price);
    }

    // Convert sizes/colors
    const sizesArray = product.sizes
      ? product.sizes.split(",").map((s) => s.trim())
      : [];

    const colorsArray = product.colors
      ? product.colors.split(",").map((c) => c.trim())
      : [];

    form.append("sizes", JSON.stringify(sizesArray));
    form.append("colors", JSON.stringify(colorsArray));

    // Collections (M2M)
    product.collections.forEach((colId) => form.append("collections", colId));

    // NEW images
    newImages.forEach((img) => form.append("images", img));

    // EXISTING images that remain
    existingImages.forEach((img) =>
      form.append("existing_images", img.id)
    );

    try {
      await updateAdminProduct(id, form);
      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.log(error.response?.data);
      alert("Failed to update product");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-3">Edit Product</h3>

      {/* EXISTING IMAGES SECTION */}
      {existingImages.length > 0 && (
        <div className="mb-4">
          <label className="fw-bold">Existing Images</label>
          <div className="d-flex flex-wrap gap-3 mt-2">
            {existingImages.map((img) => (
              <div key={img.id} className="position-relative">
                <img
                  src={img.image_url}
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
        existingImages={existingImages}
        setExistingImages={setExistingImages}
        newImages={newImages}
        setNewImages={setNewImages}
        categories={categories}
        collections={collections}
        buttonText="Update Product"
      />
    </div>
  );
};

export default EditProduct;
