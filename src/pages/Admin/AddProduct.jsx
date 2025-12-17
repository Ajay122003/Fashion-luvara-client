import React, { useEffect, useState } from "react";
import {
  createAdminProduct,
  fetchAdminCategories,
  fetchAdminCollections,
} from "../../api/admin";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/Admin/ProductForm";

const AddProduct = () => {
  const navigate = useNavigate();

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

  // For new file uploads (no existing images on Add page)
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const catData = await fetchAdminCategories();
      const colData = await fetchAdminCollections();

      setCategories(catData);
      setCollections(colData);
    } catch (err) {
      alert("Failed to load categories or collections");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    // Basic fields
    form.append("name", product.name);
    form.append("description", product.description);
    form.append("price", product.price);
    form.append("stock", product.stock);
    form.append("category", product.category);
    form.append("is_active", product.is_active);

    if (product.sale_price) {
      form.append("sale_price", product.sale_price);
    }

    // Sizes and Colors → convert string → list
    const sizesList = product.sizes
      ? product.sizes.split(",").map((s) => s.trim())
      : [];
    const colorsList = product.colors
      ? product.colors.split(",").map((c) => c.trim())
      : [];

    form.append("sizes", JSON.stringify(sizesList));
    form.append("colors", JSON.stringify(colorsList));

    // Add collections (M2M)
    product.collections.forEach((collectionId) =>
      form.append("collections", collectionId)
    );

    // Add uploaded images
    newImages.forEach((file) => form.append("images", file));

    try {
      await createAdminProduct(form);
      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-3">Add Product</h3>

      <ProductForm
        handleSubmit={handleSubmit}
        product={product}
        setProduct={setProduct}
        existingImages={[]}              // No preloaded images
        setExistingImages={() => {}}     // Not used in Add form
        newImages={newImages}
        setNewImages={setNewImages}
        categories={categories}
        collections={collections}
        buttonText="Add Product"
      />
    </div>
  );
};

export default AddProduct;