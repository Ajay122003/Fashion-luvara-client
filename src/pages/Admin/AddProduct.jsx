import React, { useEffect, useState } from "react";
import { createAdminProduct, fetchAdminCategories, fetchAdminCollections,} from "../../api/admin";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/Admin/ProductForm";

const AddProduct = () => {
  const navigate = useNavigate();

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
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    fetchAdminCategories().then(setCategories);
    fetchAdminCollections().then(setCollections);
  }, []);

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

    //VARIANTS (size + color + stock)
    product.variants.forEach((v, i) => {
      form.append(`variants[${i}][size]`, v.size);
      form.append(`variants[${i}][color]`, v.color);
      form.append(`variants[${i}][stock]`, v.stock);
    });

    // IMAGES
    newImages.forEach((img) => {
      form.append("images", img);
    });

    try {
      await createAdminProduct(form);
      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to add product");
    }
  };

  return (
    <ProductForm
      handleSubmit={handleSubmit}
      product={product}
      setProduct={setProduct}
      categories={categories}
      collections={collections}
      newImages={newImages}
      setNewImages={setNewImages}
      buttonText="Add Product"
    />
  );
};

export default AddProduct;
