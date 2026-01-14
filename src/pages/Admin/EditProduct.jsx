import React, { useEffect, useState } from "react";
import {
  fetchAdminCategories,
  fetchAdminCollections,
  fetchAdminOffers,
   fetchSingleAdminProduct,
  updateAdminProduct,
  deleteProductImage,
} from "../../api/admin";
import adminClient from "../../api/adminClient";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/Admin/ProductForm";
import toast from "react-hot-toast";


const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const loadData = async () => {
  try {
    /* -------- PRODUCT -------- */
    const prodData = await fetchSingleAdminProduct(id);

    /* -------- MASTER DATA -------- */
    const cats = await fetchAdminCategories();
    const cols = await fetchAdminCollections();
    const offerRes = await fetchAdminOffers();

    setCategories(cats);
    setCollections(cols);
    setOffers(offerRes.results || offerRes);

    /* -------- SET PRODUCT -------- */
    setProduct({
      name: prodData.name || "",
      sku: prodData.sku || "",
      description: prodData.description || "",
      price: prodData.price || "",
      sale_price: prodData.sale_price || "",
      category: prodData.category || "",
      collections: prodData.collections || [],
      offer: prodData.offer ?? null,
      is_active: prodData.is_active ?? true,
      variants: (prodData.variants || []).map((v) => ({
        size: v.size || "",
        color: v.color || "",
        stock: v.stock ?? "",
      })),
    });

    setExistingImages(prodData.images || []);
  } catch (err) {
    console.error(err);
    toast.error("Failed to load product");
  }
};


  /* ================= REMOVE EXISTING IMAGE ================= */
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

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.sku.trim()) {
      toast.error("Product SKU is required");
      return;
    }

    if (product.variants.length === 0) {
      toast.error("Add at least one variant");
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

    /* ===== OFFER (ADD / REMOVE) ===== */
    if (product.offer !== null) {
      form.append("offer", product.offer);
    } else {
      // remove offer
      form.append("offer", "");
    }

    /* ===== COLLECTIONS ===== */
    product.collections.forEach((cid) =>
      form.append("collections", cid)
    );

    /* ===== VARIANTS (JSON – SAME AS ADD) ===== */
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

    /* ===== NEW IMAGES ===== */
    newImages.forEach((img) => {
      form.append("images", img);
    });

    try {
      await updateAdminProduct(id, form);
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to update product");

    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-3">Edit Product</h3>

      {/* ================= EXISTING IMAGES ================= */}
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

      {/* ================= PRODUCT FORM ================= */}
      <ProductForm
        handleSubmit={handleSubmit}
        product={product}
        setProduct={setProduct}
        categories={categories}
        collections={collections}
        offers={offers}
        newImages={newImages}
        setNewImages={setNewImages}
        buttonText="Update Product"
      />
    </div>
  );
};

export default EditProduct;
