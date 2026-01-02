import React, { useEffect, useState } from "react";
import {
  createAdminProduct,
  fetchAdminCategories,
  fetchAdminCollections,
  fetchAdminOffers,
} from "../../api/admin";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/Admin/ProductForm";

const AddProduct = () => {
  const navigate = useNavigate();

  /* ================= PRODUCT STATE ================= */
  const [product, setProduct] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    sale_price: "",
    category: "",
    collections: [],
    offer: null,
    is_active: true,
    variants: [],
  });

  /* ================= MASTER DATA ================= */
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [offers, setOffers] = useState([]);

  /* ================= IMAGES ================= */
  const [newImages, setNewImages] = useState([]);

  /* ================= LOAD INITIAL DATA ================= */
  useEffect(() => {
    fetchAdminCategories().then(setCategories);
    fetchAdminCollections().then(setCollections);

    fetchAdminOffers().then((data) => {
      setOffers(data.results || data);
    });
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.sku.trim()) {
      alert("Product Number (SKU) is required");
      return;
    }

    if (product.variants.length === 0) {
      alert("Add at least one variant");
      return;
    }

    const form = new FormData();

    /* ===== BASIC ===== */
    form.append("name", product.name);
    form.append("sku", product.sku);
    form.append("description", product.description);
    form.append("price", product.price);
    form.append("category", product.category);
    form.append("is_active", product.is_active);

    if (product.sale_price) {
      form.append("sale_price", product.sale_price);
    }

    /* ===== OFFER ===== */
    if (product.offer) {
      form.append("offer", product.offer);
    }

    /* ===== COLLECTIONS ===== */
    product.collections.forEach((id) => {
      form.append("collections", id);
    });

    /* ===== VARIANTS (🔥 FIXED – JSON FORMAT) ===== */
    form.append(
      "variants",
      JSON.stringify(
        product.variants.map((v) => ({
          size: v.size,
          color: v.color || "",
          stock: Number(v.stock),
        }))
      )
    );

    /* ===== IMAGES ===== */
    newImages.forEach((img) => {
      form.append("images", img);
    });

    try {
      await createAdminProduct(form);
      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err.response?.data);

      if (err.response?.data?.sku) {
        alert("Product Number (SKU) already exists");
      } else if (err.response?.data?.variants) {
        alert("Invalid variants data");
      } else {
        alert("Failed to add product");
      }
    }
  };

  return (
    <ProductForm
      handleSubmit={handleSubmit}
      product={product}
      setProduct={setProduct}
      categories={categories}
      collections={collections}
      offers={offers}
      newImages={newImages}
      setNewImages={setNewImages}
      buttonText="Add Product"
    />
  );
};

export default AddProduct;
