import React, { useEffect, useState } from "react";
import {
  fetchAdminCategories,
  updateAdminProduct,
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
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const prod = await apiClient.get(`/api/admin-panel/products/${id}/`);
    const cats = await fetchAdminCategories();

    setCategories(cats);

    setProduct({
      ...prod.data,
      // Convert array → comma string for form input
      sizes: prod.data.sizes?.join(", ") || "",
      colors: prod.data.colors?.join(", ") || "",
      category: prod.data.category,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    form.append("name", product.name);
    form.append("description", product.description);
    form.append("price", product.price);

    if (product.sale_price) {
      form.append("sale_price", product.sale_price);
    }

    form.append("stock", product.stock);
    form.append("category", product.category);

    // FIX: convert comma text → JSON array
    const sizesArray = product.sizes.split(",").map((s) => s.trim());
    const colorsArray = product.colors.split(",").map((c) => c.trim());

    form.append("sizes", JSON.stringify(sizesArray));
    form.append("colors", JSON.stringify(colorsArray));

    // Add new images only
    for (let img of images) {
      form.append("images", img);
    }

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
    <div>
      <h3 className="mb-3">Edit Product</h3>
      <ProductForm
        handleSubmit={handleSubmit}
        product={product}
        setProduct={setProduct}
        images={images}
        setImages={setImages}
        categories={categories}
        buttonText="Update Product"
      />
    </div>
  );
};

export default EditProduct;
