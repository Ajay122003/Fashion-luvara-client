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
    collections: [],   // ✅ NEW FIELD
    is_active: true,
  });

  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);  // ✅ NEW
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const catData = await fetchAdminCategories();
      const colData = await fetchAdminCollections();

      setCategories(catData);
      setCollections(colData); // 👈 Load collections
    } catch (err) {
      alert("Failed to load categories/collections");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    // Basic Fields
    form.append("name", product.name);
    form.append("description", product.description);
    form.append("price", product.price);
    form.append("stock", product.stock);
    form.append("category", product.category);
    form.append("is_active", product.is_active);

    // Optional Sale Price
    if (product.sale_price) form.append("sale_price", product.sale_price);

    // Convert sizes & colors
    const sizesArray = product.sizes
      ? product.sizes.split(",").map((s) => s.trim())
      : [];

    const colorsArray = product.colors
      ? product.colors.split(",").map((c) => c.trim())
      : [];

    form.append("sizes", JSON.stringify(sizesArray));
    form.append("colors", JSON.stringify(colorsArray));

    // ✅ Add collections (M2M)
    product.collections.forEach((id) => {
      form.append("collections", id);
    });

    // Images
    images.forEach((img) => form.append("images", img));

    try {
      await createAdminProduct(form);
      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.log(error.response?.data);
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
        images={images}
        setImages={setImages}
        categories={categories}
        collections={collections}   // ✅ SEND TO FORM
        buttonText="Add Product"
      />
    </div>
  );
};

export default AddProduct;
