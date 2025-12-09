import React, { useEffect, useState } from "react";
import { createAdminProduct, fetchAdminCategories } from "../../api/admin";
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
    is_active: true,
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchAdminCategories();
      setCategories(data);
    } catch (err) {
      alert("Failed to load categories");
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

    // Optional sale_price
    if (product.sale_price) {
      form.append("sale_price", product.sale_price);
    }

    // Convert comma text → array
    const sizesArray = product.sizes
      ? product.sizes.split(",").map((s) => s.trim())
      : [];

    const colorsArray = product.colors
      ? product.colors.split(",").map((c) => c.trim())
      : [];

    form.append("sizes", JSON.stringify(sizesArray));
    form.append("colors", JSON.stringify(colorsArray));

    // Add images
    images.forEach((img) => {
      form.append("images", img);
    });

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
        buttonText="Add Product"
      />
    </div>
  );
};

export default AddProduct;

