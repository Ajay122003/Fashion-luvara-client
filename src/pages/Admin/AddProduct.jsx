import React, { useEffect, useState } from "react";
import {
  createAdminProduct,
  fetchAdminCategories,
  fetchAdminCollections,
  fetchAdminOffers,
} from "../../api/admin";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/Admin/ProductForm";
import toast from "react-hot-toast";

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
    variants: [], // 🔥 important
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

    /* ===== BASIC VALIDATION ===== */
    if (!product.sku.trim()) {
      toast.error("Product SKU is required");
      return;
    }

    if (product.variants.length === 0) {
      toast.error("Add at least one variant");
      return;
    }

    /* ===== VARIANT VALIDATION (🔥 IMPORTANT FIX) ===== */
    const invalidVariant = product.variants.some(
      (v) => !v.size || v.stock === "" || Number(v.stock) < 0
    );

    if (invalidVariant) {
      toast.error("Please fill all variant fields correctly");
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
    if (product.offer !== null) {
      form.append("offer", product.offer);
    }

    /* ===== COLLECTIONS ===== */
    product.collections.forEach((id) => {
      form.append("collections", id);
    });

    /* ===== VARIANTS (JSON) ===== */
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
      toast.success("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err.response?.data || err);

      if (err.response?.data?.sku) {
        toast.error("Product SKU already exists");
      } else if (err.response?.data?.variants) {
        toast.error("Invalid variants data");
      } else {
        toast.error("Failed to add product");
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
